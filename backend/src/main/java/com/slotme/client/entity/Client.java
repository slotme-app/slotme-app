package com.slotme.client.entity;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
public class Client extends TenantAwareEntity {

    @Column(name = "salon_id", nullable = false)
    private UUID salonId;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(nullable = false, length = 20)
    private String phone;

    private String email;

    private String notes;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "tags", columnDefinition = "text[]")
    private String[] tags;

    @Column(nullable = false, length = 30)
    private String source = "manual";

    @Column(name = "last_visit_at")
    private Instant lastVisitAt;

    @Column(name = "total_visits", nullable = false)
    private int totalVisits = 0;

    @Column(name = "total_spent", nullable = false)
    private java.math.BigDecimal totalSpent = java.math.BigDecimal.ZERO;

    @Column(name = "preferred_master_id")
    private UUID preferredMasterId;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
