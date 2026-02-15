package com.slotme.calendar.entity;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "calendars")
@Getter
@Setter
@NoArgsConstructor
public class Calendar extends TenantAwareEntity {

    @Column(name = "master_id", nullable = false, unique = true)
    private UUID masterId;

    @Column(nullable = false, length = 100)
    private String name = "Primary";

    @Column(nullable = false, length = 50)
    private String timezone = "UTC";
}
