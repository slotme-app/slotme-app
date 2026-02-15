package com.slotme.conversation.service;

import com.slotme.appointment.dto.CancelRequest;
import com.slotme.appointment.dto.CreateAppointmentRequest;
import com.slotme.appointment.dto.RescheduleRequest;
import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.appointment.service.AppointmentService;
import com.slotme.calendar.service.AvailabilityService;
import com.slotme.calendar.dto.AvailableSlotResponse;
import com.slotme.master.entity.Master;
import com.slotme.master.repository.MasterRepository;
import com.slotme.service.entity.SalonService;
import com.slotme.service.repository.SalonServiceRepository;
import org.springframework.ai.model.function.FunctionCallback;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Creates FunctionCallback instances for Spring AI function calling.
 * Each tool is registered as a FunctionCallback with the ChatClient.
 */
public class BookingToolProvider {

    private final UUID salonId;
    private final UUID clientId;
    private final AvailabilityService availabilityService;
    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final MasterRepository masterRepository;

    public BookingToolProvider(UUID salonId, UUID clientId,
                               AvailabilityService availabilityService,
                               AppointmentService appointmentService,
                               AppointmentRepository appointmentRepository,
                               SalonServiceRepository salonServiceRepository,
                               MasterRepository masterRepository) {
        this.salonId = salonId;
        this.clientId = clientId;
        this.availabilityService = availabilityService;
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.masterRepository = masterRepository;
    }

    public record CheckAvailabilityInput(String serviceName, String masterName,
                                          String dateFrom, String dateTo) {}
    public record BookAppointmentInput(String serviceId, String masterId, String startTime) {}
    public record CancelAppointmentInput(String appointmentId) {}
    public record RescheduleInput(String appointmentId, String newStartTime) {}
    public record EscalateInput(String reason) {}

    public FunctionCallback[] buildCallbacks() {
        return new FunctionCallback[]{
                FunctionCallback.builder()
                        .function("check_availability", (CheckAvailabilityInput input) -> doCheckAvailability(input))
                        .description("Check available time slots for a service and optional master on given dates")
                        .inputType(CheckAvailabilityInput.class)
                        .build(),
                FunctionCallback.builder()
                        .function("book_appointment", (BookAppointmentInput input) -> doBookAppointment(input))
                        .description("Book an appointment for the client")
                        .inputType(BookAppointmentInput.class)
                        .build(),
                FunctionCallback.builder()
                        .function("list_services", () -> doListServices())
                        .description("List available services and prices at the salon")
                        .build(),
                FunctionCallback.builder()
                        .function("get_client_appointments", () -> doGetClientAppointments())
                        .description("Get the client's upcoming confirmed appointments")
                        .build(),
                FunctionCallback.builder()
                        .function("cancel_appointment", (CancelAppointmentInput input) -> doCancelAppointment(input))
                        .description("Cancel an existing appointment")
                        .inputType(CancelAppointmentInput.class)
                        .build(),
                FunctionCallback.builder()
                        .function("reschedule_appointment", (RescheduleInput input) -> doRescheduleAppointment(input))
                        .description("Reschedule an appointment to a new time")
                        .inputType(RescheduleInput.class)
                        .build(),
                FunctionCallback.builder()
                        .function("escalate_to_staff", (EscalateInput input) -> doEscalate(input))
                        .description("Escalate conversation to a human staff member")
                        .inputType(EscalateInput.class)
                        .build()
        };
    }

    private String doCheckAvailability(CheckAvailabilityInput input) {
        List<SalonService> services = salonServiceRepository.findBySalonIdAndActiveTrue(salonId);
        SalonService service = services.stream()
                .filter(s -> s.getName().equalsIgnoreCase(input.serviceName()))
                .findFirst()
                .orElse(null);
        if (service == null) {
            return "Service '" + input.serviceName() + "' not found. Available: " +
                    services.stream().map(SalonService::getName).collect(Collectors.joining(", "));
        }

        UUID masterId = null;
        if (input.masterName() != null && !input.masterName().isBlank()) {
            List<Master> masters = masterRepository.findBySalonIdAndActiveTrue(salonId);
            masterId = masters.stream()
                    .filter(m -> m.getDisplayName().equalsIgnoreCase(input.masterName()))
                    .findFirst()
                    .map(Master::getId)
                    .orElse(null);
        }

        LocalDate from = LocalDate.parse(input.dateFrom());
        LocalDate to = (input.dateTo() != null && !input.dateTo().isBlank())
                ? LocalDate.parse(input.dateTo()) : from;

        AvailableSlotResponse response = availabilityService.getAvailableSlots(
                salonId, service.getId(), masterId, from, to);

        if (response.slots().isEmpty()) {
            return "No available slots for " + input.serviceName() + " between " + from + " and " + to;
        }

        StringBuilder sb = new StringBuilder("Available slots:\n");
        for (AvailableSlotResponse.DaySlots day : response.slots()) {
            sb.append(day.date()).append(" - ").append(day.masterName())
                    .append(" (master_id: ").append(day.masterId()).append("):\n");
            for (AvailableSlotResponse.TimeSlot slot : day.availableTimes()) {
                sb.append("  ").append(slot.start()).append("-").append(slot.end()).append("\n");
            }
        }
        return sb.toString();
    }

    private String doBookAppointment(BookAppointmentInput input) {
        try {
            CreateAppointmentRequest request = new CreateAppointmentRequest(
                    salonId, UUID.fromString(input.masterId()), UUID.fromString(input.serviceId()),
                    clientId, null, null, Instant.parse(input.startTime()), null, null, "whatsapp");
            var response = appointmentService.bookAppointment(salonId, request);
            return "Appointment booked! ID: " + response.id() +
                    ", Start: " + response.startAt() + ", End: " + response.endAt();
        } catch (Exception e) {
            return "Booking failed: " + e.getMessage();
        }
    }

    private String doListServices() {
        List<SalonService> services = salonServiceRepository.findBySalonIdAndActiveTrue(salonId);
        if (services.isEmpty()) return "No services available.";
        StringBuilder sb = new StringBuilder("Services:\n");
        for (SalonService s : services) {
            sb.append("- ").append(s.getName()).append(" (").append(s.getDurationMinutes())
                    .append(" min, ").append(s.getPrice()).append(" ").append(s.getCurrency())
                    .append(") [id: ").append(s.getId()).append("]\n");
        }
        return sb.toString();
    }

    private String doGetClientAppointments() {
        List<Appointment> upcoming = appointmentRepository.findByClientIdOrderByStartAtDesc(clientId)
                .stream()
                .filter(a -> a.getStartAt().isAfter(Instant.now()) && "confirmed".equals(a.getStatus()))
                .toList();
        if (upcoming.isEmpty()) return "No upcoming appointments.";
        StringBuilder sb = new StringBuilder("Upcoming appointments:\n");
        for (Appointment a : upcoming) {
            sb.append("- ID: ").append(a.getId()).append(", Date: ").append(a.getStartAt())
                    .append(", Status: ").append(a.getStatus()).append("\n");
        }
        return sb.toString();
    }

    private String doCancelAppointment(CancelAppointmentInput input) {
        try {
            appointmentService.cancel(UUID.fromString(input.appointmentId()),
                    new CancelRequest("Cancelled via AI assistant"));
            return "Appointment " + input.appointmentId() + " cancelled.";
        } catch (Exception e) {
            return "Cancel failed: " + e.getMessage();
        }
    }

    private String doRescheduleAppointment(RescheduleInput input) {
        try {
            var response = appointmentService.reschedule(UUID.fromString(input.appointmentId()),
                    new RescheduleRequest(Instant.parse(input.newStartTime())));
            return "Rescheduled to " + response.startAt();
        } catch (Exception e) {
            return "Reschedule failed: " + e.getMessage();
        }
    }

    private String doEscalate(EscalateInput input) {
        return "ESCALATE:" + input.reason();
    }
}
