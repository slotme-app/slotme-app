package com.slotme.master.repository;

import com.slotme.master.entity.MasterService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MasterServiceRepository extends JpaRepository<MasterService, UUID> {

    List<MasterService> findByMasterId(UUID masterId);

    List<MasterService> findByServiceId(UUID serviceId);

    Optional<MasterService> findByMasterIdAndServiceId(UUID masterId, UUID serviceId);

    void deleteByMasterIdAndServiceId(UUID masterId, UUID serviceId);
}
