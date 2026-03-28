package com.app.meetingai.service;

import com.app.meetingai.ai.AiTranscriptionService;
import com.app.meetingai.events.AudioUploadedEvent;
import com.app.meetingai.events.ProcessingFailedEvent;
import com.app.meetingai.events.TranscriptionCompletedEvent;
import com.app.meetingai.events.TranscriptionFailedEvent;
import com.app.meetingai.model.Meeting;
import com.app.meetingai.model.Meeting.MeetingStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.concurrent.CompletableFuture;

/**
 * Service responsible for handling audio transcription asynchronously
 */
@Service
@Transactional
public class TranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(TranscriptionService.class);

    private final AiTranscriptionService aiTranscriptionService;
    private final MeetingService meetingService;
    private final ApplicationEventPublisher eventPublisher;
    private final com.app.meetingai.repository.FailedJobRepository failedJobRepository;

    public TranscriptionService(@Qualifier("aiTranscriptionService") AiTranscriptionService aiTranscriptionService,
                              MeetingService meetingService,
                              ApplicationEventPublisher eventPublisher,
                              com.app.meetingai.repository.FailedJobRepository failedJobRepository) {
        this.aiTranscriptionService = aiTranscriptionService;
        this.meetingService = meetingService;
        this.eventPublisher = eventPublisher;
        this.failedJobRepository = failedJobRepository;
    }

    /**
     * Listen for audio upload and trigger transcription
     */
    @EventListener
    @Async("transcriptionExecutor")
    public void handleAudioUploaded(AudioUploadedEvent event) {
        log.info("Received audio uploaded event: {}", event);
        transcribeAudioAsync(event.getMeeting().getId(), event.getAudioFilePath(), event.getUserId());
    }

    /**
     * Transcribe audio asynchronously and publish events
     */
    @Async("transcriptionExecutor")
    public CompletableFuture<Void> transcribeAudioAsync(Long meetingId, String audioFilePath, String userId) {
        log.info("Starting transcription for meetingId: {}, audioPath: {}, userId: {}", 
                meetingId, audioFilePath, userId);
        
        Instant startTime = Instant.now();
        
        try {
            // Mark transcription as started
            Meeting meeting = meetingService.getMeetingById(meetingId);
            meeting.markAsTranscribing();
            meetingService.saveMeeting(meeting);
            
            log.info("Marked meeting {} as TRANSCRIBING", meetingId);

            // Perform transcription
            String transcript = aiTranscriptionService.transcribe(audioFilePath);
            
            if (transcript == null || transcript.trim().isEmpty()) {
                throw new RuntimeException("Transcription returned empty result");
            }

            // Update meeting with transcript
            meeting.setTranscript(transcript);
            meeting.markAsTranscribed();
            meetingService.saveMeeting(meeting);
            
            Long processingDuration = Instant.now().toEpochMilli() - startTime.toEpochMilli();
            
            log.info("Transcription completed for meetingId: {}, duration: {}ms", 
                    meetingId, processingDuration);

            // Publish success event
            TranscriptionCompletedEvent event = new TranscriptionCompletedEvent(
                this, meeting, transcript, userId, processingDuration);
            eventPublisher.publishEvent(event);
            
            return CompletableFuture.completedFuture(null);
            
        } catch (Exception e) {
            log.error("Transcription failed for meetingId: " + meetingId, e);
            
            // Handle failure
            try {
                Meeting meeting = meetingService.getMeetingById(meetingId);
                meeting.incrementRetryCount();
                meeting.markAsFailed(e.getMessage());
                meetingService.saveMeeting(meeting);
                
                // Publish failure event
                TranscriptionFailedEvent event = new TranscriptionFailedEvent(
                    this, meeting, e.getMessage(), e, userId, meeting.getRetryCount());
                eventPublisher.publishEvent(event);
                
                // Also publish generic failed event
                ProcessingFailedEvent failedEvent = new ProcessingFailedEvent(
                    this, meeting, "TRANSCRIPTION", e.getMessage(), userId);
                eventPublisher.publishEvent(failedEvent);
                // Record in failed_jobs table for RetryScheduler
                recordFailedJob(meeting.getId(), "TRANSCRIPTION", e.getMessage());
                
            } catch (Exception saveException) {
                log.error("Failed to update meeting status after transcription failure", saveException);
            }
            
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Retry transcription for failed meetings
     */
    @Async("transcriptionExecutor")
    public CompletableFuture<Void> retryTranscriptionAsync(Long meetingId, String userId) {
        log.info("Retrying transcription for meetingId: {}, userId: {}", meetingId, userId);
        
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            
            if (!meeting.canRetry()) {
                throw new IllegalStateException("Cannot retry transcription for meetingId: " + meetingId + 
                    ", retryCount: " + meeting.getRetryCount());
            }
            
            String audioFilePath = meeting.getAudioFileUrl();
            if (audioFilePath == null) {
                throw new IllegalStateException("No audio file found for meetingId: " + meetingId);
            }
            
            return transcribeAudioAsync(meetingId, audioFilePath, userId);
            
        } catch (Exception e) {
            log.error("Failed to retry transcription for meetingId: " + meetingId, e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Check transcription status
     */
    @Transactional(readOnly = true)
    public boolean isTranscriptionInProgress(Long meetingId) {
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            return meeting.getStatus() == MeetingStatus.TRANSCRIBING;
        } catch (Exception e) {
            log.warn("Failed to check transcription status for meetingId: " + meetingId, e);
            return false;
        }
    }

    /**
     * Get transcription progress
     */
    @Transactional(readOnly = true)
    public TranscriptionProgress getTranscriptionProgress(Long meetingId) {
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            
            return new TranscriptionProgress(
                meeting.getId(),
                meeting.getStatus(),
                meeting.getTranscriptionStartedAt(),
                meeting.getTranscriptionCompletedAt(),
                meeting.getErrorMessage(),
                meeting.getRetryCount()
            );
        } catch (Exception e) {
            log.warn("Failed to get transcription progress for meetingId: " + meetingId, e);
            return new TranscriptionProgress(meetingId, MeetingStatus.CREATED, null, null, null, 0);
        }
    }

    /**
     * DTO for transcription progress
     */
    public static class TranscriptionProgress {
        private final Long meetingId;
        private final Meeting.MeetingStatus status;
        private final Instant startedAt;
        private final Instant completedAt;
        private final String errorMessage;
        private final Integer retryCount;

        public TranscriptionProgress(Long meetingId, Meeting.MeetingStatus status, Instant startedAt, 
                                    Instant completedAt, String errorMessage, Integer retryCount) {
            this.meetingId = meetingId;
            this.status = status;
            this.startedAt = startedAt;
            this.completedAt = completedAt;
            this.errorMessage = errorMessage;
            this.retryCount = retryCount;
        }

        // Getters
        public Long getMeetingId() { return meetingId; }
        public Meeting.MeetingStatus getStatus() { return status; }
        public Instant getStartedAt() { return startedAt; }
        public Instant getCompletedAt() { return completedAt; }
        public String getErrorMessage() { return errorMessage; }
        public Integer getRetryCount() { return retryCount; }
        
        public boolean isCompleted() {
            return status == MeetingStatus.TRANSCRIBED;
        }
        
        public boolean isFailed() {
            return status == MeetingStatus.FAILED;
        }
        
    }

    private void recordFailedJob(Long meetingId, String type, String error) {
        try {
            com.app.meetingai.model.FailedJob job = failedJobRepository.findByMeetingIdAndJobType(meetingId, type);
            if (job == null) {
                job = com.app.meetingai.model.FailedJob.builder()
                        .meetingId(meetingId)
                        .jobType(type)
                        .errorMessage(error)
                        .retryCount(0)
                        .status("PENDING")
                        .nextAttempt(java.time.Instant.now().plusSeconds(300))
                        .build();
            } else {
                job.setErrorMessage(error);
                job.setStatus("PENDING");
                job.setNextAttempt(java.time.Instant.now().plusSeconds(600));
            }
            failedJobRepository.save(job);
        } catch (Exception e) {
            log.error("Failed to record failed job for meeting {}", meetingId, e);
        }
    }
}
