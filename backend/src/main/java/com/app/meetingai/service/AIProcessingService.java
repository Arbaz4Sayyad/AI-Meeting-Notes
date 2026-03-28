package com.app.meetingai.service;

import com.app.meetingai.ai.GeminiService;
import com.app.meetingai.events.AIProcessingCompletedEvent;
import com.app.meetingai.events.MeetingProcessingCompletedEvent;
import com.app.meetingai.events.ProcessingFailedEvent;
import com.app.meetingai.events.TranscriptionCompletedEvent;
import com.app.meetingai.model.Meeting;
import com.app.meetingai.model.Meeting.MeetingStatus;
import com.app.meetingai.model.MeetingSummary;
import com.app.meetingai.repository.FailedJobRepository;
import com.app.meetingai.repository.MeetingSummaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.concurrent.CompletableFuture;

/**
 * Service responsible for AI processing (summarization, action items, etc.)
 */
@Service
@Transactional
public class AIProcessingService {

    private static final Logger log = LoggerFactory.getLogger(AIProcessingService.class);

    private final GeminiService geminiService;
    private final MeetingService meetingService;
    private final MeetingSummaryRepository summaryRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final FailedJobRepository failedJobRepository;

    public AIProcessingService(GeminiService geminiService,
                              MeetingService meetingService,
                              MeetingSummaryRepository summaryRepository,
                              ApplicationEventPublisher eventPublisher,
                              FailedJobRepository failedJobRepository) {
        this.geminiService = geminiService;
        this.meetingService = meetingService;
        this.summaryRepository = summaryRepository;
        this.eventPublisher = eventPublisher;
        this.failedJobRepository = failedJobRepository;
    }

    /**
     * Listen for transcription completion and trigger AI processing
     */
    @EventListener
    @Async("aiProcessingExecutor")
    public void handleTranscriptionCompleted(TranscriptionCompletedEvent event) {
        log.info("Received transcription completed event: {}", event);
        processMeetingAsync(event.getMeeting().getId(), event.getUserId());
    }

    /**
     * Process meeting transcript with AI asynchronously
     */
    @Async("aiProcessingExecutor")
    public CompletableFuture<Void> processMeetingAsync(Long meetingId, String userId) {
        log.info("Starting AI processing for meetingId: {}, userId: {}", meetingId, userId);
        
        Instant startTime = Instant.now();
        
        try {
            // Get meeting with transcript
            Meeting meeting = meetingService.getMeetingById(meetingId);
            
            if (meeting.getTranscript() == null || meeting.getTranscript().trim().isEmpty()) {
                throw new IllegalStateException("No transcript available for meetingId: " + meetingId);
            }

            // Mark AI processing as started
            meeting.markAsAiProcessing();
            meetingService.saveMeeting(meeting);
            
            log.info("Marked meeting {} as PROCESSING_AI", meetingId);

            // Generate AI summary
            MeetingSummary summary = geminiService.generateSummary(meetingId, meeting.getTranscript());
            summary.setCreatedAt(Instant.now());
            
            summary = summaryRepository.save(summary);
            
            // Mark meeting as completed
            meeting.markAsCompleted();
            meetingService.saveMeeting(meeting);
            
            Long totalProcessingDuration = Instant.now().toEpochMilli() - startTime.toEpochMilli();
            
            log.info("AI processing completed for meetingId: {}, summaryId: {}, duration: {}ms", 
                    meetingId, summary.getId(), totalProcessingDuration);

            // Publish AI processing completed event
            AIProcessingCompletedEvent aiEvent = new AIProcessingCompletedEvent(
                this, meeting, summary, userId, totalProcessingDuration);
            eventPublisher.publishEvent(aiEvent);
            
            // Publish final meeting processing completed event
            MeetingProcessingCompletedEvent finalEvent = new MeetingProcessingCompletedEvent(
                this, meeting, userId, totalProcessingDuration);
            eventPublisher.publishEvent(finalEvent);
            
            return CompletableFuture.completedFuture(null);
            
        } catch (Exception e) {
            log.error("AI processing failed for meetingId: " + meetingId, e);
            
            // Handle failure
            try {
                Meeting meeting = meetingService.getMeetingById(meetingId);
                meeting.incrementRetryCount();
                meeting.markAsFailed("AI processing failed: " + e.getMessage());
                meetingService.saveMeeting(meeting);
                
                // Publish generic failed event
                ProcessingFailedEvent failedEvent = new ProcessingFailedEvent(
                    this, meeting, "AI_PROCESSING", e.getMessage(), userId);
                eventPublisher.publishEvent(failedEvent);
                recordFailedJob(meeting.getId(), "AI_PROCESSING", e.getMessage());
            } catch (Exception saveException) {
                log.error("Failed to update meeting status after AI processing failure", saveException);
            }
            
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Re-process meeting with AI (for retries or updates)
     */
    @Async("aiProcessingExecutor")
    public CompletableFuture<Void> reprocessMeetingAsync(Long meetingId, String userId) {
        log.info("Re-processing meeting with AI for meetingId: {}, userId: {}", meetingId, userId);
        
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            
            if (!meeting.canRetry()) {
                throw new IllegalStateException("Cannot retry AI processing for meetingId: " + meetingId + 
                    ", retryCount: " + meeting.getRetryCount());
            }
            
            // Reset status to TRANSCRIBED to allow AI processing
            meeting.setStatus(MeetingStatus.TRANSCRIBED);
            meetingService.saveMeeting(meeting);
            
            return processMeetingAsync(meetingId, userId);
            
        } catch (Exception e) {
            log.error("Failed to re-process meeting with AI for meetingId: " + meetingId, e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Check AI processing status
     */
    @Transactional(readOnly = true)
    public boolean isAIProcessingInProgress(Long meetingId) {
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            return meeting.getStatus() == MeetingStatus.PROCESSING_AI;
        } catch (Exception e) {
            log.warn("Failed to check AI processing status for meetingId: " + meetingId, e);
            return false;
        }
    }

    /**
     * Get AI processing progress
     */
    @Transactional(readOnly = true)
    public AIProcessingProgress getAIProcessingProgress(Long meetingId) {
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            
            return new AIProcessingProgress(
                meeting.getId(),
                meeting.getStatus(),
                meeting.getAiProcessingStartedAt(),
                meeting.getCompletedAt(),
                meeting.getErrorMessage(),
                meeting.getRetryCount()
            );
        } catch (Exception e) {
            log.warn("Failed to get AI processing progress for meetingId: " + meetingId, e);
            return new AIProcessingProgress(meetingId, MeetingStatus.CREATED, null, null, null, 0);
        }
    }

    /**
     * Generate summary for existing transcript (manual trigger)
     */
    @Async("aiProcessingExecutor")
    public CompletableFuture<MeetingSummary> generateSummaryAsync(Long meetingId, String userId) {
        log.info("Manual summary generation for meetingId: {}, userId: {}", meetingId, userId);
        
        try {
            Meeting meeting = meetingService.getMeetingById(meetingId);
            
            if (meeting.getTranscript() == null || meeting.getTranscript().trim().isEmpty()) {
                throw new IllegalStateException("No transcript available for meetingId: " + meetingId);
            }

            // Generate AI summary
            MeetingSummary summary = geminiService.generateSummary(meetingId, meeting.getTranscript());
            summary.setCreatedAt(Instant.now());
            
            summary = summaryRepository.save(summary);
            
            log.info("Manual summary generated for meetingId: {}, summaryId: {}", meetingId, summary.getId());
            
            return CompletableFuture.completedFuture(summary);
            
        } catch (Exception e) {
            log.error("Failed to generate manual summary for meetingId: " + meetingId, e);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * DTO for AI processing progress
     */
    public static class AIProcessingProgress {
        private final Long meetingId;
        private final Meeting.MeetingStatus status;
        private final Instant startedAt;
        private final Instant completedAt;
        private final String errorMessage;
        private final Integer retryCount;

        public AIProcessingProgress(Long meetingId, Meeting.MeetingStatus status, Instant startedAt, 
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
            return status == MeetingStatus.COMPLETED;
        }
        
        public boolean isFailed() {
            return status == MeetingStatus.FAILED;
        }
        
        public boolean isInProgress() {
            return status == MeetingStatus.PROCESSING_AI;
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
