package com.app.meetingai.repository;

import com.app.meetingai.model.MeetingSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MeetingSummaryRepository extends JpaRepository<MeetingSummary, Long> {

    Optional<MeetingSummary> findByMeetingId(Long meetingId);

    @Query("SELECT COUNT(s) FROM MeetingSummary s WHERE s.meeting.userId = :userId")
    long countByMeetingUserId(@Param("userId") Long userId);

    void deleteByMeetingId(Long meetingId);
}
