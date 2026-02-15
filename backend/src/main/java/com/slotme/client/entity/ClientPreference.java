package com.slotme.client.entity;

import com.slotme.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "client_preferences")
@Getter
@Setter
@NoArgsConstructor
public class ClientPreference extends BaseEntity {

    @Column(name = "client_id", nullable = false, unique = true)
    private UUID clientId;

    @Column(name = "preferred_master_id")
    private UUID preferredMasterId;

    @Column(name = "preferred_day")
    private Short preferredDay;

    @Column(name = "preferred_time")
    private LocalTime preferredTime;

    @Column(name = "preferred_channel", length = 20)
    private String preferredChannel;

    @Column(length = 10)
    private String language = "en";

    private String notes;
}
