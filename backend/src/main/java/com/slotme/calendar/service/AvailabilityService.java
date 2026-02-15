package com.slotme.calendar.service;

import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.calendar.dto.*;
import com.slotme.calendar.entity.AvailabilityRule;
import com.slotme.calendar.entity.Calendar;
import com.slotme.calendar.entity.TimeBlock;
import com.slotme.calendar.repository.AvailabilityRuleRepository;
import com.slotme.calendar.repository.CalendarRepository;
import com.slotme.calendar.repository.TimeBlockRepository;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.master.entity.Master;
import com.slotme.master.repository.MasterRepository;
import com.slotme.security.SecurityUtils;
import com.slotme.service.entity.SalonService;
import com.slotme.service.repository.SalonServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
public class AvailabilityService {

    private static final int DEFAULT_SLOT_INCREMENT_MINUTES = 15;

    private final CalendarRepository calendarRepository;
    private final AvailabilityRuleRepository availabilityRuleRepository;
    private final TimeBlockRepository timeBlockRepository;
    private final MasterRepository masterRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final AppointmentRepository appointmentRepository;

    public AvailabilityService(CalendarRepository calendarRepository,
                                AvailabilityRuleRepository availabilityRuleRepository,
                                TimeBlockRepository timeBlockRepository,
                                MasterRepository masterRepository,
                                SalonServiceRepository salonServiceRepository,
                                AppointmentRepository appointmentRepository) {
        this.calendarRepository = calendarRepository;
        this.availabilityRuleRepository = availabilityRuleRepository;
        this.timeBlockRepository = timeBlockRepository;
        this.masterRepository = masterRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // --- Availability Rules Management ---

    public List<AvailabilityRuleDto> getAvailabilityRules(UUID masterId) {
        Calendar calendar = getOrCreateCalendar(masterId);
        return availabilityRuleRepository.findByCalendarId(calendar.getId()).stream()
                .map(this::toRuleDto)
                .toList();
    }

    @Transactional
    public List<AvailabilityRuleDto> setAvailabilityRules(UUID masterId, SetAvailabilityRequest request) {
        Calendar calendar = getOrCreateCalendar(masterId);

        // Clear existing rules and create new ones
        availabilityRuleRepository.deleteByCalendarId(calendar.getId());

        List<AvailabilityRule> rules = request.rules().stream().map(dayRule -> {
            AvailabilityRule rule = new AvailabilityRule();
            rule.setCalendarId(calendar.getId());
            rule.setDayOfWeek((short) dayRule.dayOfWeek());
            rule.setStartTime(dayRule.startTime());
            rule.setEndTime(dayRule.endTime());
            rule.setAvailable(dayRule.available());
            return availabilityRuleRepository.save(rule);
        }).toList();

        return rules.stream().map(this::toRuleDto).toList();
    }

    // --- Time Block Management ---

    public List<TimeBlockDto> getTimeBlocks(UUID masterId, Instant from, Instant to) {
        Calendar calendar = getOrCreateCalendar(masterId);
        return timeBlockRepository.findByCalendarIdAndStartAtBetween(calendar.getId(), from, to)
                .stream()
                .map(this::toBlockDto)
                .toList();
    }

    @Transactional
    public TimeBlockDto createTimeBlock(UUID masterId, CreateTimeBlockRequest request) {
        Calendar calendar = getOrCreateCalendar(masterId);

        TimeBlock block = new TimeBlock();
        block.setCalendarId(calendar.getId());
        block.setBlockType(request.blockType());
        block.setTitle(request.title());
        block.setStartAt(request.startAt());
        block.setEndAt(request.endAt());
        block.setRecurring(request.recurring());
        block.setRecurrenceRule(request.recurrenceRule());
        block = timeBlockRepository.save(block);

        return toBlockDto(block);
    }

    @Transactional
    public void deleteTimeBlock(UUID blockId) {
        timeBlockRepository.deleteById(blockId);
    }

    // --- Available Slots Calculation ---

    public AvailableSlotResponse getAvailableSlots(UUID salonId, UUID serviceId,
                                                     UUID masterId, LocalDate dateFrom,
                                                     LocalDate dateTo) {
        SalonService service = salonServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));

        int slotDuration = service.getDurationMinutes() + service.getBufferMinutes();
        List<Master> masters;

        if (masterId != null) {
            Master master = masterRepository.findById(masterId)
                    .orElseThrow(() -> new ResourceNotFoundException("Master", masterId));
            masters = List.of(master);
        } else {
            masters = masterRepository.findBySalonIdAndActiveTrue(salonId);
        }

        List<AvailableSlotResponse.DaySlots> allSlots = new ArrayList<>();

        for (Master master : masters) {
            Calendar calendar = calendarRepository.findByMasterId(master.getId()).orElse(null);
            if (calendar == null) continue;

            ZoneId zoneId = ZoneId.of(calendar.getTimezone());

            for (LocalDate date = dateFrom; !date.isAfter(dateTo); date = date.plusDays(1)) {
                short dayOfWeek = (short) (date.getDayOfWeek().getValue() - 1); // 0=Mon

                List<AvailabilityRule> rules = availabilityRuleRepository
                        .findActiveRules(calendar.getId(), dayOfWeek, date);

                if (rules.isEmpty() || rules.stream().noneMatch(AvailabilityRule::isAvailable)) {
                    continue;
                }

                // Get available time windows from rules
                List<TimeWindow> windows = rules.stream()
                        .filter(AvailabilityRule::isAvailable)
                        .map(r -> new TimeWindow(r.getStartTime(), r.getEndTime()))
                        .toList();

                // Subtract time blocks
                Instant dayStart = date.atStartOfDay(zoneId).toInstant();
                Instant dayEnd = date.plusDays(1).atStartOfDay(zoneId).toInstant();
                List<TimeBlock> blocks = timeBlockRepository
                        .findOverlapping(calendar.getId(), dayStart, dayEnd);

                List<TimeWindow> availableWindows = new ArrayList<>(windows);
                for (TimeBlock block : blocks) {
                    LocalTime blockStart = block.getStartAt().atZone(zoneId).toLocalTime();
                    LocalTime blockEnd = block.getEndAt().atZone(zoneId).toLocalTime();
                    availableWindows = subtractBlock(availableWindows, blockStart, blockEnd);
                }

                // Subtract existing confirmed appointments
                List<Appointment> appointments = appointmentRepository
                        .findConflicting(master.getId(), dayStart, dayEnd);
                for (Appointment appt : appointments) {
                    LocalTime apptStart = appt.getStartAt().atZone(zoneId).toLocalTime();
                    LocalTime apptEnd = appt.getEndAt().atZone(zoneId).toLocalTime();
                    availableWindows = subtractBlock(availableWindows, apptStart, apptEnd);
                }

                // Generate discrete slots
                List<AvailableSlotResponse.TimeSlot> slots = new ArrayList<>();
                for (TimeWindow window : availableWindows) {
                    LocalTime cursor = window.start();
                    while (cursor.plusMinutes(slotDuration).compareTo(window.end()) <= 0) {
                        slots.add(new AvailableSlotResponse.TimeSlot(
                                cursor, cursor.plusMinutes(service.getDurationMinutes())));
                        cursor = cursor.plusMinutes(DEFAULT_SLOT_INCREMENT_MINUTES);
                    }
                }

                if (!slots.isEmpty()) {
                    allSlots.add(new AvailableSlotResponse.DaySlots(
                            date,
                            master.getId().toString(),
                            master.getDisplayName(),
                            slots
                    ));
                }
            }
        }

        return new AvailableSlotResponse(allSlots);
    }

    // --- Helper Methods ---

    private Calendar getOrCreateCalendar(UUID masterId) {
        return calendarRepository.findByMasterId(masterId)
                .orElseGet(() -> {
                    Master master = masterRepository.findById(masterId)
                            .orElseThrow(() -> new ResourceNotFoundException("Master", masterId));
                    Calendar cal = new Calendar();
                    cal.setTenantId(master.getTenantId());
                    cal.setMasterId(masterId);
                    return calendarRepository.save(cal);
                });
    }

    private List<TimeWindow> subtractBlock(List<TimeWindow> windows, LocalTime blockStart, LocalTime blockEnd) {
        List<TimeWindow> result = new ArrayList<>();
        for (TimeWindow window : windows) {
            if (blockEnd.compareTo(window.start()) <= 0 || blockStart.compareTo(window.end()) >= 0) {
                result.add(window);
            } else {
                if (blockStart.isAfter(window.start())) {
                    result.add(new TimeWindow(window.start(), blockStart));
                }
                if (blockEnd.isBefore(window.end())) {
                    result.add(new TimeWindow(blockEnd, window.end()));
                }
            }
        }
        return result;
    }

    private record TimeWindow(LocalTime start, LocalTime end) {}

    private AvailabilityRuleDto toRuleDto(AvailabilityRule rule) {
        return new AvailabilityRuleDto(
                rule.getId().toString(),
                rule.getDayOfWeek(),
                rule.getStartTime(),
                rule.getEndTime(),
                rule.isAvailable()
        );
    }

    private TimeBlockDto toBlockDto(TimeBlock block) {
        return new TimeBlockDto(
                block.getId().toString(),
                block.getBlockType(),
                block.getTitle(),
                block.getStartAt(),
                block.getEndAt(),
                block.isRecurring(),
                block.getRecurrenceRule()
        );
    }
}
