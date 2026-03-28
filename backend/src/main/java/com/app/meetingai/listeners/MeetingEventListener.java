package com.app.meetingai.listeners;

import com.app.meetingai.events.AudioUploadedEvent;
import com.app.meetingai.events.MeetingProcessingCompletedEvent;
import com.app.meetingai.service.TranscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Event listener for meeting-related events
 */
@Component
public class MeetingEventListener {

    private static final Logger log = LoggerFactory.getLogger(MeetingEventListener.class);

    private final TranscriptionService transcriptionService;

    public MeetingEventListener(TranscriptionService transcriptionService) {
        this.transcriptionService = transcriptionService;
    }

    /**
     * Listen for audio upload events and trigger transcription
     */
    @EventListener
    @Async("transcriptionExecutor")
    @TransactionalEventListener
    public void handleAudioUploaded(AudioUploadedEvent event) {
        log.info("Received audio uploaded event: {}", event);
        
        try {
            // Start transcription asynchronously
            transcriptionService.transcribeAudioAsync(
                event.getMeeting().getId(),
                event.getAudioFilePath(),
                event.getUserId()
            );
            
            log.info("Triggered transcription for meetingId: {}", event.getMeeting().getId());
            
        } catch (Exception e) {
            log.error("Failed to handle audio uploaded event for meetingId: " + event.getMeeting().getId(), e);
        }
    }

    /**
     * Listen for meeting processing completion events
     */
    @EventListener
    @Async("notificationExecutor")
    public void handleMeetingProcessingCompleted(MeetingProcessingCompletedEvent event) {
        log.info("Meeting processing completed: {}", event);
        
        // Could trigger additional cleanup, analytics, or reporting here
        try {
            // Update user statistics
            // updateMeetingStatistics(event.getUserId());
            
            // Trigger any post-processing workflows
            // triggerPostProcessingWorkflows(event.getMeeting());
            
            log.info("Post-processing completed for meetingId: {}", event.getMeeting().getId());
            
        } catch (Exception e) {
            log.error("Failed to handle meeting processing completion for meetingId: " + event.getMeeting().getId(), e);
        }
    }
}
