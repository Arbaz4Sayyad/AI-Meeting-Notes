package com.app.meetingai.events;

import com.app.meetingai.model.Meeting;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

/**
 * Event fired when all processing is completed for a meeting
 */
public class MeetingProcessingCompletedEvent extends ApplicationEvent {

    private final Meeting meeting;
    private final Instant eventTimestamp;
    private final String userId;
    private final Long totalProcessingDurationMs;

    public MeetingProcessingCompletedEvent(Object source, Meeting meeting, 
                                          String userId, Long totalProcessingDurationMs) {
        super(source);
        this.meeting = meeting;
        this.userId = userId;
        this.totalProcessingDurationMs = totalProcessingDurationMs;
        this.eventTimestamp = Instant.now();
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public Instant getEventTimestamp() {
        return eventTimestamp;
    }

    public String getUserId() {
        return userId;
    }

    public Long getTotalProcessingDurationMs() {
        return totalProcessingDurationMs;
    }

    @Override
    public String toString() {
        return "MeetingProcessingCompletedEvent{" +
                "meetingId=" + meeting.getId() +
                ", title='" + meeting.getTitle() + '\'' +
                ", eventTimestamp=" + eventTimestamp +
                ", userId='" + userId + '\'' +
                ", totalProcessingDurationMs=" + totalProcessingDurationMs +
                '}';
    }
}
