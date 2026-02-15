package com.slotme.appointment.repository;

import com.slotme.appointment.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query(value = "SELECT * FROM appointments a WHERE a.salon_id = :salonId" +
           " AND (CAST(:masterId AS uuid) IS NULL OR a.master_id = :masterId)" +
           " AND (CAST(:clientId AS uuid) IS NULL OR a.client_id = :clientId)" +
           " AND (CAST(:status AS text) IS NULL OR a.status = :status)" +
           " AND (CAST(:dateFrom AS timestamptz) IS NULL OR a.start_at >= :dateFrom)" +
           " AND (CAST(:dateTo AS timestamptz) IS NULL OR a.start_at <= :dateTo)",
           countQuery = "SELECT count(*) FROM appointments a WHERE a.salon_id = :salonId" +
           " AND (CAST(:masterId AS uuid) IS NULL OR a.master_id = :masterId)" +
           " AND (CAST(:clientId AS uuid) IS NULL OR a.client_id = :clientId)" +
           " AND (CAST(:status AS text) IS NULL OR a.status = :status)" +
           " AND (CAST(:dateFrom AS timestamptz) IS NULL OR a.start_at >= :dateFrom)" +
           " AND (CAST(:dateTo AS timestamptz) IS NULL OR a.start_at <= :dateTo)",
           nativeQuery = true)
    Page<Appointment> findFiltered(@Param("salonId") UUID salonId,
                                   @Param("masterId") UUID masterId,
                                   @Param("clientId") UUID clientId,
                                   @Param("status") String status,
                                   @Param("dateFrom") Instant dateFrom,
                                   @Param("dateTo") Instant dateTo,
                                   Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.masterId = :masterId" +
           " AND a.status = 'confirmed'" +
           " AND a.startAt < :endAt AND a.endAt > :startAt")
    List<Appointment> findConflicting(@Param("masterId") UUID masterId,
                                      @Param("startAt") Instant startAt,
                                      @Param("endAt") Instant endAt);

    @Query("SELECT a FROM Appointment a WHERE a.masterId = :masterId" +
           " AND a.status = 'confirmed'" +
           " AND a.startAt < :endAt AND a.endAt > :startAt" +
           " AND a.id <> :excludeId")
    List<Appointment> findConflictingExcluding(@Param("masterId") UUID masterId,
                                               @Param("startAt") Instant startAt,
                                               @Param("endAt") Instant endAt,
                                               @Param("excludeId") UUID excludeId);

    List<Appointment> findByClientIdOrderByStartAtDesc(UUID clientId);

    @Query("SELECT a FROM Appointment a WHERE a.status = 'confirmed'" +
           " AND a.startAt >= :from AND a.startAt < :to")
    List<Appointment> findConfirmedBetween(@Param("from") Instant from, @Param("to") Instant to);
}
