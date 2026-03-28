package com.app.meetingai.dto;

import com.app.meetingai.model.Meeting;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class MeetingDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate meetingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> attendees;
    private String meetingType;
    private String meetingLink;
    private String location;
    private String language;
    private String agendaNotes;
    private String audioFileUrl;
    private String transcript;
    private Instant createdAt;
    private String status;
    private Instant uploadedAt;
    private Instant transcriptionStartedAt;
    private Instant transcriptionCompletedAt;
    private Instant aiProcessingStartedAt;
    private Instant completedAt;
    private String errorMessage;
    private Integer retryCount;
    private Long processingDurationMs;
    private Long userId;
    private boolean hasSummary;

    public MeetingDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDate meetingDate) { this.meetingDate = meetingDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public List<String> getAttendees() { return attendees; }
    public void setAttendees(List<String> attendees) { this.attendees = attendees; }
    public String getMeetingType() { return meetingType; }
    public void setMeetingType(String meetingType) { this.meetingType = meetingType; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getAgendaNotes() { return agendaNotes; }
    public void setAgendaNotes(String agendaNotes) { this.agendaNotes = agendaNotes; }
    public String getAudioFileUrl() { return audioFileUrl; }
    public void setAudioFileUrl(String audioFileUrl) { this.audioFileUrl = audioFileUrl; }
    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
    public Instant getTranscriptionStartedAt() { return transcriptionStartedAt; }
    public void setTranscriptionStartedAt(Instant transcriptionStartedAt) { this.transcriptionStartedAt = transcriptionStartedAt; }
    public Instant getTranscriptionCompletedAt() { return transcriptionCompletedAt; }
    public void setTranscriptionCompletedAt(Instant transcriptionCompletedAt) { this.transcriptionCompletedAt = transcriptionCompletedAt; }
    public Instant getAiProcessingStartedAt() { return aiProcessingStartedAt; }
    public void setAiProcessingStartedAt(Instant aiProcessingStartedAt) { this.aiProcessingStartedAt = aiProcessingStartedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }
    public Long getProcessingDurationMs() { return processingDurationMs; }
    public void setProcessingDurationMs(Long processingDurationMs) { this.processingDurationMs = processingDurationMs; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public boolean isHasSummary() { return hasSummary; }
    public void setHasSummary(boolean hasSummary) { this.hasSummary = hasSummary; }
}
