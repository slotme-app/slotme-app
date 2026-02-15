package com.slotme.service.repository;

import com.slotme.service.entity.SalonService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SalonServiceRepository extends JpaRepository<SalonService, UUID> {

    List<SalonService> findBySalonIdOrderBySortOrder(UUID salonId);

    List<SalonService> findBySalonIdAndCategoryIdOrderBySortOrder(UUID salonId, UUID categoryId);

    List<SalonService> findBySalonIdAndActiveTrue(UUID salonId);
}
