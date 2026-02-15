package com.slotme.calendar.repository;

import com.slotme.calendar.entity.AvailabilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AvailabilityRuleRepository extends JpaRepository<AvailabilityRule, UUID> {

    List<AvailabilityRule> findByCalendarId(UUID calendarId);

    @Query("""
        SELECT ar FROM AvailabilityRule ar
        WHERE ar.calendarId = :calendarId
          AND ar.dayOfWeek = :dayOfWeek
          AND (ar.validFrom IS NULL OR ar.validFrom <= :date)
          AND (ar.validUntil IS NULL OR ar.validUntil >= :date)
        """)
    List<AvailabilityRule> findActiveRules(UUID calendarId, short dayOfWeek, LocalDate date);

    void deleteByCalendarId(UUID calendarId);
}
