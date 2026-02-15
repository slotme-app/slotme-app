package com.slotme.master.entity;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "masters")
@Getter
@Setter
@NoArgsConstructor
public class Master extends TenantAwareEntity {

    @Column(name = "salon_id", nullable = false)
    private UUID salonId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    private String bio;

    private String specialization;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;
}
