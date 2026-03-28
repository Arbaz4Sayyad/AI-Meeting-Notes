package com.app.meetingai.events;

import com.app.meetingai.model.Meeting;
import com.app.meetingai.model.MeetingSummary;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

/**
 * Event fired when AI processing is completed for a meeting
 */
public class AIProcessingCompletedEvent extends ApplicationEvent {

    private final Meeting meeting;
    private final MeetingSummary meetingSummary;
    private final Instant eventTimestamp;
    private final String userId;
    private final Long totalProcessingDurationMs;

    public AIProcessingCompletedEvent(Object source, Meeting meeting, MeetingSummary meetingSummary, 
                                       String userId, Long totalProcessingDurationMs) {
        super(source);
        this.meeting = meeting;
        this.meetingSummary = meetingSummary;
        this.userId = userId;
        this.totalProcessingDurationMs = totalProcessingDurationMs;
        this.eventTimestamp = Instant.now();
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public MeetingSummary getMeetingSummary() {
        return meetingSummary;
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
        return "AIProcessingCompletedEvent{" +
                "meetingId=" + meeting.getId() +
                ", summaryId=" + (meetingSummary != null ? meetingSummary.getId() : null) +
                ", eventTimestamp=" + eventTimestamp +
                ", userId='" + userId + '\'' +
                ", totalProcessingDurationMs=" + totalProcessingDurationMs +
                '}';
    }
}
