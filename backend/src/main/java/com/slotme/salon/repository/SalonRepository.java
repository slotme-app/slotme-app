package com.slotme.salon.repository;

import com.slotme.salon.entity.Salon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalonRepository extends JpaRepository<Salon, UUID> {

    List<Salon> findByTenantId(UUID tenantId);

    Optional<Salon> findByTenantIdAndSlug(UUID tenantId, String slug);

    boolean existsByTenantIdAndSlug(UUID tenantId, String slug);
}
