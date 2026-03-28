package com.app.meetingai.scheduler;

import com.app.meetingai.events.AudioUploadedEvent;
import com.app.meetingai.events.TranscriptionCompletedEvent;
import com.app.meetingai.model.FailedJob;
import com.app.meetingai.model.Meeting;
import com.app.meetingai.repository.FailedJobRepository;
import com.app.meetingai.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class RetryScheduler {

    private final FailedJobRepository failedJobRepository;
    private final MeetingRepository meetingRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(fixedDelay = 60000) // Run every minute
    public void retryFailedJobs() {
        List<FailedJob> jobsToRetry = failedJobRepository.findByStatusAndNextAttemptBefore("PENDING", Instant.now());
        
        if (jobsToRetry.isEmpty()) return;
        
        log.info("Found {} failed jobs to retry", jobsToRetry.size());
        
        for (FailedJob job : jobsToRetry) {
            try {
                processRetry(job);
            } catch (Exception e) {
                log.error("Failed to retry job {}", job.getId(), e);
            }
        }
    }

    private void processRetry(FailedJob job) {
        Meeting meeting = meetingRepository.findById(job.getMeetingId()).orElse(null);
        if (meeting == null) {
            job.setStatus("GIVEN_UP");
            failedJobRepository.save(job);
            return;
        }

        log.info("Retrying job type {} for meeting {}", job.getJobType(), meeting.getId());
        job.setRetryCount(job.getRetryCount() + 1);
        job.setLastAttempt(Instant.now());
        
        if (job.getRetryCount() > 3) {
            job.setStatus("GIVEN_UP");
            log.warn("Max retries reached for job {}. Giving up.", job.getId());
        } else {
            // Re-publish the original event that triggers the logic
            if ("TRANSCRIPTION".equals(job.getJobType())) {
                eventPublisher.publishEvent(new AudioUploadedEvent(this, meeting, meeting.getAudioFileUrl(), meeting.getUserId().toString()));
            } else if ("AI_PROCESSING".equals(job.getJobType())) {
                eventPublisher.publishEvent(new TranscriptionCompletedEvent(this, meeting, meeting.getTranscript(), 
                        meeting.getUserId().toString(), 0L));
            }
            
            // Set next attempt (exponential backoff could go here)
            job.setNextAttempt(Instant.now().plusSeconds(300)); // 5 mins later
        }
        
        failedJobRepository.save(job);
    }
}
