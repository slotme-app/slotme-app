package com.slotme.appointment.event;

import com.slotme.appointment.entity.Appointment;
import org.springframework.context.ApplicationEvent;

public class AppointmentCancelledEvent extends ApplicationEvent {

    private final Appointment appointment;

    public AppointmentCancelledEvent(Object source, Appointment appointment) {
        super(source);
        this.appointment = appointment;
    }

    public Appointment getAppointment() {
        return appointment;
    }
}
