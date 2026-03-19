package com.app.meetingai.repository;

import com.app.meetingai.model.Meeting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Page<Meeting> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT m FROM Meeting m WHERE m.userId = :userId AND LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) ORDER BY m.createdAt DESC")
    Page<Meeting> searchByUserIdAndTitle(@Param("userId") Long userId, @Param("search") String search, Pageable pageable);

    @Query("SELECT m FROM Meeting m WHERE m.userId = :userId AND m.createdAt >= :from AND m.createdAt <= :to ORDER BY m.createdAt DESC")
    Page<Meeting> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("from") Instant from, @Param("to") Instant to, Pageable pageable);

    long countByUserId(Long userId);

    long countByUserIdAndCreatedAtAfter(Long userId, Instant after);
}
