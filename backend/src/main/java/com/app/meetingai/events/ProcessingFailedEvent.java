package com.app.meetingai.events;

import com.app.meetingai.model.Meeting;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

/**
 * Generic event fired when meeting processing fails at any stage
 */
public class ProcessingFailedEvent extends ApplicationEvent {

    private final Meeting meeting;
    private final String stage;
    private final String errorMessage;
    private final String userId;
    private final Instant eventTimestamp;

    public ProcessingFailedEvent(Object source, Meeting meeting, String stage, String errorMessage, String userId) {
        super(source);
        this.meeting = meeting;
        this.stage = stage;
        this.errorMessage = errorMessage;
        this.userId = userId;
        this.eventTimestamp = Instant.now();
    }

    public Meeting getMeeting() { return meeting; }
    public String getStage() { return stage; }
    public String getErrorMessage() { return errorMessage; }
    public String getUserId() { return userId; }
    public Instant getEventTimestamp() { return eventTimestamp; }

    @Override
    public String toString() {
        return "ProcessingFailedEvent{" +
                "meetingId=" + meeting.getId() +
                ", stage='" + stage + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
}
