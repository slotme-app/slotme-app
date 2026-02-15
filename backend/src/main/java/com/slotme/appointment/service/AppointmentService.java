package com.slotme.appointment.service;

import com.slotme.appointment.dto.*;
import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.entity.AppointmentHistory;
import com.slotme.appointment.entity.AppointmentStatus;
import com.slotme.appointment.event.*;
import com.slotme.appointment.repository.AppointmentHistoryRepository;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.client.entity.Client;
import com.slotme.client.repository.ClientRepository;
import com.slotme.common.exception.ConflictException;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.master.entity.Master;
import com.slotme.master.repository.MasterRepository;
import com.slotme.security.SecurityUtils;
import com.slotme.service.entity.SalonService;
import com.slotme.service.repository.SalonServiceRepository;
import io.micrometer.core.instrument.Counter;
import jakarta.persistence.EntityManager;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentHistoryRepository historyRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final MasterRepository masterRepository;
    private final ClientRepository clientRepository;
    private final EntityManager entityManager;
    private final ApplicationEventPublisher eventPublisher;
    private final Counter appointmentCreatedCounter;
    private final Counter bookingConflictCounter;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              AppointmentHistoryRepository historyRepository,
                              SalonServiceRepository salonServiceRepository,
                              MasterRepository masterRepository,
                              ClientRepository clientRepository,
                              EntityManager entityManager,
                              ApplicationEventPublisher eventPublisher,
                              Counter appointmentCreatedCounter,
                              Counter bookingConflictCounter) {
        this.appointmentRepository = appointmentRepository;
        this.historyRepository = historyRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.masterRepository = masterRepository;
        this.clientRepository = clientRepository;
        this.entityManager = entityManager;
        this.eventPublisher = eventPublisher;
        this.appointmentCreatedCounter = appointmentCreatedCounter;
        this.bookingConflictCounter = bookingConflictCounter;
    }

    @Transactional
    public AppointmentResponse bookAppointment(UUID salonId, CreateAppointmentRequest request) {
        SalonService service = salonServiceRepository.findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", request.serviceId()));

        Instant startAt = request.resolvedStartAt();
        int durationMinutes = service.getDurationMinutes();
        Instant endAt = startAt.plusSeconds((long) durationMinutes * 60);

        // Advisory lock on master + date to prevent concurrent double-booking
        acquireAdvisoryLock(request.masterId(), startAt);

        // Check for conflicts
        List<Appointment> conflicts = appointmentRepository.findConflicting(
                request.masterId(), startAt, endAt);
        if (!conflicts.isEmpty()) {
            bookingConflictCounter.increment();
            throw new ConflictException("Time slot is already booked for this master");
        }

        Appointment appointment = new Appointment();
        appointment.setSalonId(salonId);
        appointment.setMasterId(request.masterId());
        appointment.setClientId(request.clientId());
        appointment.setServiceId(request.serviceId());
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setStartAt(startAt);
        appointment.setEndAt(endAt);
        appointment.setDurationMinutes(durationMinutes);
        appointment.setPrice(service.getPrice());
        appointment.setCurrency(service.getCurrency());
        appointment.setNotes(request.notes());
        appointment.setSource(request.source() != null ? request.source() : "manual");

        appointment = appointmentRepository.save(appointment);

        recordHistory(appointment.getId(), "created", null,
                AppointmentStatus.CONFIRMED, null, appointment.getStartAt(), null);

        appointmentCreatedCounter.increment();
        eventPublisher.publishEvent(new AppointmentCreatedEvent(this, appointment));

        return toResponse(appointment);
    }

    public Page<AppointmentResponse> listAppointments(UUID salonId, UUID masterId, UUID clientId,
                                                       String status, Instant dateFrom, Instant dateTo,
                                                       Pageable pageable) {
        return appointmentRepository.findFiltered(salonId, masterId, clientId, status,
                dateFrom, dateTo, pageable).map(this::toResponse);
    }

    public AppointmentResponse getAppointment(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));
        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse reschedule(UUID appointmentId, RescheduleRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        if (!AppointmentStatus.CONFIRMED.equals(appointment.getStatus())) {
            throw new ConflictException("Only confirmed appointments can be rescheduled");
        }

        Instant newEndAt = request.startAt().plusSeconds((long) appointment.getDurationMinutes() * 60);

        acquireAdvisoryLock(appointment.getMasterId(), request.startAt());

        List<Appointment> conflicts = appointmentRepository.findConflictingExcluding(
                appointment.getMasterId(), request.startAt(), newEndAt, appointmentId);
        if (!conflicts.isEmpty()) {
            throw new ConflictException("New time slot is already booked for this master");
        }

        Instant previousStartAt = appointment.getStartAt();
        String oldStatus = appointment.getStatus();

        appointment.setStartAt(request.startAt());
        appointment.setEndAt(newEndAt);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment = appointmentRepository.save(appointment);

        // After rescheduling, set back to confirmed for the new slot
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment = appointmentRepository.save(appointment);

        recordHistory(appointment.getId(), "rescheduled", oldStatus,
                AppointmentStatus.CONFIRMED, previousStartAt, request.startAt(), null);

        eventPublisher.publishEvent(new AppointmentRescheduledEvent(this, appointment, previousStartAt));

        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancel(UUID appointmentId, CancelRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        if (!AppointmentStatus.CONFIRMED.equals(appointment.getStatus())) {
            throw new ConflictException("Only confirmed appointments can be cancelled");
        }

        String oldStatus = appointment.getStatus();
        String newStatus = SecurityUtils.isMaster()
                ? AppointmentStatus.CANCELLED_BY_MASTER
                : AppointmentStatus.CANCELLED_BY_CLIENT;

        appointment.setStatus(newStatus);
        appointment.setCancelledAt(Instant.now());
        appointment.setCancellationReason(request != null ? request.reason() : null);
        appointment = appointmentRepository.save(appointment);

        recordHistory(appointment.getId(), "cancelled", oldStatus, newStatus,
                null, null, request != null ? request.reason() : null);

        eventPublisher.publishEvent(new AppointmentCancelledEvent(this, appointment));

        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse complete(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        if (!AppointmentStatus.CONFIRMED.equals(appointment.getStatus())) {
            throw new ConflictException("Only confirmed appointments can be completed");
        }

        String oldStatus = appointment.getStatus();
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment = appointmentRepository.save(appointment);

        recordHistory(appointment.getId(), "completed", oldStatus,
                AppointmentStatus.COMPLETED, null, null, null);

        eventPublisher.publishEvent(new AppointmentCompletedEvent(this, appointment));

        return toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse markNoShow(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        if (!AppointmentStatus.CONFIRMED.equals(appointment.getStatus())) {
            throw new ConflictException("Only confirmed appointments can be marked as no-show");
        }

        String oldStatus = appointment.getStatus();
        appointment.setStatus(AppointmentStatus.NO_SHOW);
        appointment = appointmentRepository.save(appointment);

        recordHistory(appointment.getId(), "no_show", oldStatus,
                AppointmentStatus.NO_SHOW, null, null, null);

        return toResponse(appointment);
    }

    public List<AppointmentHistoryResponse> getHistory(UUID appointmentId) {
        return historyRepository.findByAppointmentIdOrderByCreatedAtDesc(appointmentId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    // --- Helper Methods ---

    private void acquireAdvisoryLock(UUID masterId, Instant startAt) {
        String lockKey = masterId.toString() + startAt.toString().substring(0, 10);
        entityManager.createNativeQuery("SELECT pg_advisory_xact_lock(hashtext(:key))")
                .setParameter("key", lockKey)
                .getSingleResult();
    }

    private void recordHistory(UUID appointmentId, String action, String oldStatus,
                               String newStatus, Instant oldStartAt, Instant newStartAt,
                               String notes) {
        AppointmentHistory history = new AppointmentHistory();
        history.setAppointmentId(appointmentId);
        history.setAction(action);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setOldStartAt(oldStartAt);
        history.setNewStartAt(newStartAt);
        history.setChangeSource("manual");
        history.setNotes(notes);
        try {
            history.setChangedBy(SecurityUtils.getCurrentUserId());
        } catch (IllegalStateException e) {
            // System-initiated change (e.g., AI booking) - changedBy stays null
        }
        historyRepository.save(history);
    }

    private AppointmentResponse toResponse(Appointment a) {
        String masterName = masterRepository.findById(a.getMasterId())
                .map(Master::getDisplayName).orElse(null);
        String clientName = clientRepository.findById(a.getClientId())
                .map(c -> {
                    String first = c.getFirstName() != null ? c.getFirstName() : "";
                    String last = c.getLastName() != null ? c.getLastName() : "";
                    return (first + " " + last).trim();
                }).orElse(null);
        String serviceName = salonServiceRepository.findById(a.getServiceId())
                .map(SalonService::getName).orElse(null);

        return new AppointmentResponse(
                a.getId().toString(),
                a.getSalonId().toString(),
                a.getMasterId().toString(),
                masterName,
                a.getClientId().toString(),
                clientName,
                a.getServiceId().toString(),
                serviceName,
                a.getStatus(),
                a.getStartAt(),
                a.getEndAt(),
                a.getDurationMinutes(),
                a.getPrice(),
                a.getCurrency(),
                a.getNotes(),
                a.getInternalNotes(),
                a.getSource(),
                a.getCancelledAt(),
                a.getCancellationReason(),
                a.getCreatedAt(),
                a.getUpdatedAt()
        );
    }

    private AppointmentHistoryResponse toHistoryResponse(AppointmentHistory h) {
        return new AppointmentHistoryResponse(
                h.getId().toString(),
                h.getAppointmentId().toString(),
                h.getAction(),
                h.getOldStatus(),
                h.getNewStatus(),
                h.getOldStartAt(),
                h.getNewStartAt(),
                h.getChangedBy() != null ? h.getChangedBy().toString() : null,
                h.getChangeSource(),
                h.getNotes(),
                h.getCreatedAt()
        );
    }
}
