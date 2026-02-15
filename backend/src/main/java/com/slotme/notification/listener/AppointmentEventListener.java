package com.slotme.notification.listener;

import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.event.AppointmentCancelledEvent;
import com.slotme.appointment.event.AppointmentCreatedEvent;
import com.slotme.appointment.event.AppointmentRescheduledEvent;
import com.slotme.client.entity.Client;
import com.slotme.client.repository.ClientRepository;
import com.slotme.master.entity.Master;
import com.slotme.master.repository.MasterRepository;
import com.slotme.notification.service.NotificationService;
import com.slotme.service.entity.SalonService;
import com.slotme.service.repository.SalonServiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
public class AppointmentEventListener {

    private static final Logger log = LoggerFactory.getLogger(AppointmentEventListener.class);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    private final NotificationService notificationService;
    private final ClientRepository clientRepository;
    private final MasterRepository masterRepository;
    private final SalonServiceRepository salonServiceRepository;

    public AppointmentEventListener(NotificationService notificationService,
                                    ClientRepository clientRepository,
                                    MasterRepository masterRepository,
                                    SalonServiceRepository salonServiceRepository) {
        this.notificationService = notificationService;
        this.clientRepository = clientRepository;
        this.masterRepository = masterRepository;
        this.salonServiceRepository = salonServiceRepository;
    }

    @Async
    @EventListener
    public void onAppointmentCreated(AppointmentCreatedEvent event) {
        Appointment appt = event.getAppointment();
        log.info("Handling AppointmentCreatedEvent for appointment {}", appt.getId());

        Map<String, String> variables = buildVariables(appt);
        if (variables == null) return;

        notificationService.sendNotification(
                appt.getTenantId(), appt.getSalonId(), appt.getClientId(),
                appt.getId(), "appointment_confirmation",
                variables.get("client_phone"), variables);
    }

    @Async
    @EventListener
    public void onAppointmentCancelled(AppointmentCancelledEvent event) {
        Appointment appt = event.getAppointment();
        log.info("Handling AppointmentCancelledEvent for appointment {}", appt.getId());

        Map<String, String> variables = buildVariables(appt);
        if (variables == null) return;

        // Notify client
        notificationService.sendNotification(
                appt.getTenantId(), appt.getSalonId(), appt.getClientId(),
                appt.getId(), "appointment_cancelled",
                variables.get("client_phone"), variables);
    }

    @Async
    @EventListener
    public void onAppointmentRescheduled(AppointmentRescheduledEvent event) {
        Appointment appt = event.getAppointment();
        log.info("Handling AppointmentRescheduledEvent for appointment {}", appt.getId());

        Map<String, String> variables = buildVariables(appt);
        if (variables == null) return;

        variables.put("previous_date", DATE_FORMAT.format(
                event.getPreviousStartAt().atZone(ZoneId.systemDefault())));
        variables.put("previous_time", TIME_FORMAT.format(
                event.getPreviousStartAt().atZone(ZoneId.systemDefault())));

        notificationService.sendNotification(
                appt.getTenantId(), appt.getSalonId(), appt.getClientId(),
                appt.getId(), "appointment_rescheduled",
                variables.get("client_phone"), variables);
    }

    private Map<String, String> buildVariables(Appointment appt) {
        Client client = clientRepository.findById(appt.getClientId()).orElse(null);
        if (client == null) {
            log.warn("Client not found for appointment {}", appt.getId());
            return null;
        }

        Master master = masterRepository.findById(appt.getMasterId()).orElse(null);
        SalonService service = salonServiceRepository.findById(appt.getServiceId()).orElse(null);

        Map<String, String> vars = new HashMap<>();
        vars.put("client_name", (client.getFirstName() != null ? client.getFirstName() : "") +
                (client.getLastName() != null ? " " + client.getLastName() : ""));
        vars.put("client_phone", client.getPhone());
        vars.put("master_name", master != null ? master.getDisplayName() : "Your specialist");
        vars.put("service_name", service != null ? service.getName() : "Your service");
        vars.put("date", DATE_FORMAT.format(appt.getStartAt().atZone(ZoneId.systemDefault())));
        vars.put("time", TIME_FORMAT.format(appt.getStartAt().atZone(ZoneId.systemDefault())));
        vars.put("duration", String.valueOf(appt.getDurationMinutes()));
        vars.put("price", appt.getPrice() != null ? appt.getPrice().toPlainString() : "");
        vars.put("currency", appt.getCurrency());

        return vars;
    }
}
