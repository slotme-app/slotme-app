package com.slotme.salon.entity;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "salons")
@Getter
@Setter
@NoArgsConstructor
public class Salon extends TenantAwareEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    private String description;

    private String phone;

    private String email;

    private String address;

    private String city;

    @Column(length = 2)
    private String country;

    @Column(nullable = false)
    private String timezone = "UTC";

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(name = "logo_url")
    private String logoUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> settings = Map.of();

    @Column(nullable = false)
    private String status = "active";
}
