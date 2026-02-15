package com.slotme.appointment.entity;

public final class AppointmentStatus {
    public static final String CONFIRMED = "confirmed";
    public static final String COMPLETED = "completed";
    public static final String CANCELLED_BY_CLIENT = "cancelled_by_client";
    public static final String CANCELLED_BY_MASTER = "cancelled_by_master";
    public static final String NO_SHOW = "no_show";
    public static final String RESCHEDULED = "rescheduled";

    private AppointmentStatus() {}
}
