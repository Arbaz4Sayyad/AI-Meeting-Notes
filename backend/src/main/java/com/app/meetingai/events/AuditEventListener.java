package com.app.meetingai.events;

import com.app.meetingai.model.AuditLog;
import com.app.meetingai.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuditEventListener {

    private final AuditLogRepository auditLogRepository;

    @EventListener
    @Async("notificationExecutor")
    public void handleAudioUploaded(AudioUploadedEvent event) {
        saveAuditLog(event.getMeeting().getId(), "AUDIO_UPLOADED", "Audio file uploaded", event.getUserId());
    }

    @EventListener
    @Async("notificationExecutor")
    public void handleTranscriptionCompleted(TranscriptionCompletedEvent event) {
        saveAuditLog(event.getMeeting().getId(), "TRANSCRIPTION_COMPLETED", "Transcription finished", event.getUserId());
    }

    @EventListener
    @Async("notificationExecutor")
    public void handleAIProcessingCompleted(AIProcessingCompletedEvent event) {
        saveAuditLog(event.getMeeting().getId(), "AI_PROCESSING_COMPLETED", "AI insights generated", event.getUserId());
    }

    @EventListener
    @Async("notificationExecutor")
    public void handleProcessingFailed(ProcessingFailedEvent event) {
        saveAuditLog(event.getMeeting().getId(), "PROCESSING_FAILED", 
                "Failed at stage: " + event.getStage() + ". Error: " + event.getErrorMessage(), 
                event.getUserId());
    }

    private void saveAuditLog(Long meetingId, String type, String details, String userId) {
        try {
            AuditLog logEntry = AuditLog.builder()
                    .meetingId(meetingId)
                    .eventType(type)
                    .details(details)
                    .userId(userId)
                    .build();
            auditLogRepository.save(logEntry);
            log.debug("Audit log saved: {} for meeting {}", type, meetingId);
        } catch (Exception e) {
            log.error("Failed to save audit log for meeting {}", meetingId, e);
        }
    }
}
