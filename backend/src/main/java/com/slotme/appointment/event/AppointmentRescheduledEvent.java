package com.slotme.appointment.event;

import com.slotme.appointment.entity.Appointment;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

public class AppointmentRescheduledEvent extends ApplicationEvent {

    private final Appointment appointment;
    private final Instant previousStartAt;

    public AppointmentRescheduledEvent(Object source, Appointment appointment, Instant previousStartAt) {
        super(source);
        this.appointment = appointment;
        this.previousStartAt = previousStartAt;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public Instant getPreviousStartAt() {
        return previousStartAt;
    }
}
