package com.app.meetingai.repository;

import com.app.meetingai.model.FailedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface FailedJobRepository extends JpaRepository<FailedJob, Long> {
    List<FailedJob> findByStatusAndNextAttemptBefore(String status, Instant now);
    FailedJob findByMeetingIdAndJobType(Long meetingId, String jobType);
}
