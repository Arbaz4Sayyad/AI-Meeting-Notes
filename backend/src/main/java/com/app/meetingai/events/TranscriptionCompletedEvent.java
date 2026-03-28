package com.app.meetingai.events;

import com.app.meetingai.model.Meeting;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

/**
 * Event fired when transcription is completed for a meeting
 */
public class TranscriptionCompletedEvent extends ApplicationEvent {

    private final Meeting meeting;
    private final String transcript;
    private final Instant eventTimestamp;
    private final String userId;
    private final Long processingDurationMs;

    public TranscriptionCompletedEvent(Object source, Meeting meeting, String transcript, 
                                     String userId, Long processingDurationMs) {
        super(source);
        this.meeting = meeting;
        this.transcript = transcript;
        this.userId = userId;
        this.processingDurationMs = processingDurationMs;
        this.eventTimestamp = Instant.now();
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public String getTranscript() {
        return transcript;
    }

    public Instant getEventTimestamp() {
        return eventTimestamp;
    }

    public String getUserId() {
        return userId;
    }

    public Long getProcessingDurationMs() {
        return processingDurationMs;
    }

    @Override
    public String toString() {
        return "TranscriptionCompletedEvent{" +
                "meetingId=" + meeting.getId() +
                ", transcriptLength=" + (transcript != null ? transcript.length() : 0) +
                ", eventTimestamp=" + eventTimestamp +
                ", userId='" + userId + '\'' +
                ", processingDurationMs=" + processingDurationMs +
                '}';
    }
}
