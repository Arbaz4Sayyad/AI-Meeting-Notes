package com.app.meetingai.events;

import com.app.meetingai.model.Meeting;
import org.springframework.context.ApplicationEvent;

import java.time.Instant;

/**
 * Event fired when audio file is successfully uploaded for a meeting
 */
public class AudioUploadedEvent extends ApplicationEvent {

    private final Meeting meeting;
    private final String audioFilePath;
    private final Instant eventTimestamp;
    private final String userId;

    public AudioUploadedEvent(Object source, Meeting meeting, String audioFilePath, String userId) {
        super(source);
        this.meeting = meeting;
        this.audioFilePath = audioFilePath;
        this.userId = userId;
        this.eventTimestamp = Instant.now();
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public String getAudioFilePath() {
        return audioFilePath;
    }

    public Instant getEventTimestamp() {
        return eventTimestamp;
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return "AudioUploadedEvent{" +
                "meetingId=" + meeting.getId() +
                ", audioFilePath='" + audioFilePath + '\'' +
                ", eventTimestamp=" + eventTimestamp +
                ", userId='" + userId + '\'' +
                '}';
    }
}
