package com.slotme.client.repository;

import com.slotme.client.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {

    Page<Client> findBySalonId(UUID salonId, Pageable pageable);

    Optional<Client> findBySalonIdAndPhone(UUID salonId, String phone);

    @Query("""
        SELECT c FROM Client c
        WHERE c.salonId = :salonId
          AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
            OR c.phone LIKE CONCAT('%', :query, '%')
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')))
        """)
    Page<Client> search(UUID salonId, String query, Pageable pageable);
}
