package com.app.meetingai.events;

import com.app.meetingai.model.Meeting;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

/**
 * Event fired when transcription fails for a meeting
 */
public class TranscriptionFailedEvent extends ApplicationEvent {

    private final Meeting meeting;
    private final String errorMessage;
    private final Exception exception;
    private final Instant eventTimestamp;
    private final String userId;
    private final Integer retryCount;

    public TranscriptionFailedEvent(Object source, Meeting meeting, String errorMessage, 
                                   Exception exception, String userId, Integer retryCount) {
        super(source);
        this.meeting = meeting;
        this.errorMessage = errorMessage;
        this.exception = exception;
        this.userId = userId;
        this.retryCount = retryCount;
        this.eventTimestamp = Instant.now();
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Exception getException() {
        return exception;
    }

    public Instant getEventTimestamp() {
        return eventTimestamp;
    }

    public String getUserId() {
        return userId;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public boolean canRetry() {
        return retryCount < 3;
    }

    @Override
    public String toString() {
        return "TranscriptionFailedEvent{" +
                "meetingId=" + meeting.getId() +
                ", errorMessage='" + errorMessage + '\'' +
                ", eventTimestamp=" + eventTimestamp +
                ", userId='" + userId + '\'' +
                ", retryCount=" + retryCount +
                '}';
    }
}
