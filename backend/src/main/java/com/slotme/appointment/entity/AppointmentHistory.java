package com.slotme.appointment.entity;

import com.slotme.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "appointment_history")
@Getter
@Setter
@NoArgsConstructor
public class AppointmentHistory extends BaseEntity {

    @Column(name = "appointment_id", nullable = false)
    private UUID appointmentId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "old_status", length = 30)
    private String oldStatus;

    @Column(name = "new_status", nullable = false, length = 30)
    private String newStatus;

    @Column(name = "old_start_at")
    private Instant oldStartAt;

    @Column(name = "new_start_at")
    private Instant newStartAt;

    @Column(name = "changed_by")
    private UUID changedBy;

    @Column(name = "change_source", nullable = false, length = 30)
    private String changeSource;

    private String notes;
}
