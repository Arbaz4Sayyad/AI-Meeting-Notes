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

    @Query("SELECT m FROM Meeting m WHERE m.userId = :userId AND " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "m.createdAt >= :from AND m.createdAt <= :to ORDER BY m.createdAt DESC")
    Page<Meeting> searchByUserIdAndTitleAndDateRange(@Param("userId") Long userId, @Param("search") String search, @Param("from") Instant from, @Param("to") Instant to, Pageable pageable);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, Meeting.MeetingStatus status);
    
    long countByUserIdAndStatusIn(Long userId, List<Meeting.MeetingStatus> statuses);

    long countByUserIdAndCreatedAtAfter(Long userId, Instant createdAt);

    Page<Meeting> findByUserIdAndStatus(Long userId, Meeting.MeetingStatus status, Pageable pageable);

    @Query("SELECT m FROM Meeting m WHERE m.userId = :userId AND m.status = 'COMPLETED' ORDER BY m.createdAt DESC")
    List<Meeting> findRecentCompletedByUserId(@Param("userId") Long userId, Pageable pageable);
}
