package com.slotme.master.repository;

import com.slotme.master.entity.Master;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MasterRepository extends JpaRepository<Master, UUID> {

    List<Master> findBySalonIdOrderBySortOrder(UUID salonId);

    List<Master> findBySalonIdAndActiveTrue(UUID salonId);

    Optional<Master> findByUserId(UUID userId);
}
