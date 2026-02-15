package com.slotme.calendar.entity;

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
@Table(name = "time_blocks")
@Getter
@Setter
@NoArgsConstructor
public class TimeBlock extends BaseEntity {

    @Column(name = "calendar_id", nullable = false)
    private UUID calendarId;

    @Column(name = "block_type", nullable = false, length = 30)
    private String blockType;

    private String title;

    @Column(name = "start_at", nullable = false)
    private Instant startAt;

    @Column(name = "end_at", nullable = false)
    private Instant endAt;

    @Column(name = "is_recurring", nullable = false)
    private boolean recurring = false;

    @Column(name = "recurrence_rule")
    private String recurrenceRule;
}
