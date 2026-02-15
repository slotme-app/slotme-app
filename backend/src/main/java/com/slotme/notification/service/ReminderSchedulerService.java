package com.slotme.notification.service;

import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.client.entity.Client;
import com.slotme.client.repository.ClientRepository;
import com.slotme.master.entity.Master;
import com.slotme.master.repository.MasterRepository;
import com.slotme.service.entity.SalonService;
import com.slotme.service.repository.SalonServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReminderSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(ReminderSchedulerService.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    private final AppointmentRepository appointmentRepository;
    private final ClientRepository clientRepository;
    private final MasterRepository masterRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final NotificationService notificationService;

    public ReminderSchedulerService(AppointmentRepository appointmentRepository,
                                    ClientRepository clientRepository,
                                    MasterRepository masterRepository,
                                    SalonServiceRepository salonServiceRepository,
                                    NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.clientRepository = clientRepository;
        this.masterRepository = masterRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void scheduleReminders() {
        scheduleRemindersForWindow(24, "appointment_reminder_24h");
        scheduleRemindersForWindow(2, "appointment_reminder_2h");
    }

    private void scheduleRemindersForWindow(int hoursAhead, String triggerEvent) {
        Instant windowStart = Instant.now().plus(hoursAhead, ChronoUnit.HOURS).minus(30, ChronoUnit.MINUTES);
        Instant windowEnd = Instant.now().plus(hoursAhead, ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES);

        List<Appointment> appointments = appointmentRepository.findConfirmedBetween(windowStart, windowEnd);
        log.info("Found {} appointments for {} reminder window", appointments.size(), triggerEvent);

        for (Appointment appt : appointments) {
            try {
                Client client = clientRepository.findById(appt.getClientId()).orElse(null);
                if (client == null) continue;

                Master master = masterRepository.findById(appt.getMasterId()).orElse(null);
                SalonService service = salonServiceRepository.findById(appt.getServiceId()).orElse(null);

                Map<String, String> vars = new HashMap<>();
                vars.put("client_name", (client.getFirstName() != null ? client.getFirstName() : "") +
                        (client.getLastName() != null ? " " + client.getLastName() : ""));
                vars.put("master_name", master != null ? master.getDisplayName() : "Your specialist");
                vars.put("service_name", service != null ? service.getName() : "Your service");
                vars.put("date", DATE_FORMAT.format(appt.getStartAt().atZone(ZoneId.systemDefault())));
                vars.put("time", TIME_FORMAT.format(appt.getStartAt().atZone(ZoneId.systemDefault())));
                vars.put("duration", String.valueOf(appt.getDurationMinutes()));

                Instant sendAt = appt.getStartAt().minus(hoursAhead, ChronoUnit.HOURS);
                if (sendAt.isBefore(Instant.now())) {
                    sendAt = Instant.now();
                }

                notificationService.scheduleNotification(
                        appt.getTenantId(), appt.getSalonId(), appt.getClientId(),
                        appt.getId(), triggerEvent,
                        client.getPhone(), vars, sendAt);
            } catch (Exception e) {
                log.error("Failed to schedule reminder for appointment {}", appt.getId(), e);
            }
        }
    }
}
