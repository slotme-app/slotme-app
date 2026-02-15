package com.slotme.appointment.event;

import com.slotme.appointment.entity.Appointment;
import org.springframework.context.ApplicationEvent;

public class AppointmentCompletedEvent extends ApplicationEvent {

    private final Appointment appointment;

    public AppointmentCompletedEvent(Object source, Appointment appointment) {
        super(source);
        this.appointment = appointment;
    }

    public Appointment getAppointment() {
        return appointment;
    }
}
