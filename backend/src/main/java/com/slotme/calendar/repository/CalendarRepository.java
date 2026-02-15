package com.slotme.calendar.repository;

import com.slotme.calendar.entity.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, UUID> {

    Optional<Calendar> findByMasterId(UUID masterId);
}
