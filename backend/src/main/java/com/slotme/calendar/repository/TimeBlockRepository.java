package com.slotme.calendar.repository;

import com.slotme.calendar.entity.TimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface TimeBlockRepository extends JpaRepository<TimeBlock, UUID> {

    @Query("""
        SELECT tb FROM TimeBlock tb
        WHERE tb.calendarId = :calendarId
          AND tb.startAt < :endAt
          AND tb.endAt > :startAt
        """)
    List<TimeBlock> findOverlapping(UUID calendarId, Instant startAt, Instant endAt);

    List<TimeBlock> findByCalendarIdAndStartAtBetween(UUID calendarId, Instant startAt, Instant endAt);
}
