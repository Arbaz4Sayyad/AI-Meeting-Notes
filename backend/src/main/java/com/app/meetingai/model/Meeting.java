package com.app.meetingai.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "meeting_date")
    private LocalDate meetingDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @ElementCollection
    @Column(name = "attendee")
    @CollectionTable(name = "meeting_attendees", joinColumns = @JoinColumn(name = "meeting_id"))
    private List<String> attendees;

    @Column(name = "meeting_type")
    @Enumerated(EnumType.STRING)
    private MeetingType meetingType = MeetingType.ONLINE;

    @Column(name = "meeting_link")
    private String meetingLink;

    private String location;

    private String language = "en";

    @Column(name = "agenda_notes", columnDefinition = "CLOB")
    private String agendaNotes;

    @Column(name = "audio_file_url")
    private String audioFileUrl;

    @Column(columnDefinition = "TEXT")
    private String transcript;

    // NEW: Meeting lifecycle status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingStatus status = MeetingStatus.CREATED;

    // NEW: Processing timestamps
    @Column(name = "uploaded_at")
    private Instant uploadedAt;

    @Column(name = "transcription_started_at")
    private Instant transcriptionStartedAt;

    @Column(name = "transcription_completed_at")
    private Instant transcriptionCompletedAt;

    @Column(name = "ai_processing_started_at")
    private Instant aiProcessingStartedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    // NEW: Error handling
    @Column(name = "error_message", columnDefinition = "CLOB")
    private String errorMessage;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "processing_duration_ms")
    private Long processingDurationMs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // NEW: Status transition methods
    public void markAsUploaded() {
        this.status = MeetingStatus.UPLOADED;
        this.uploadedAt = Instant.now();
    }

    public void markAsTranscribing() {
        this.status = MeetingStatus.TRANSCRIBING;
        this.transcriptionStartedAt = Instant.now();
    }

    public void markAsTranscribed() {
        this.status = MeetingStatus.TRANSCRIBED;
        this.transcriptionCompletedAt = Instant.now();
    }

    public void markAsAiProcessing() {
        this.status = MeetingStatus.PROCESSING_AI;
        this.aiProcessingStartedAt = Instant.now();
    }

    public void markAsCompleted() {
        this.status = MeetingStatus.COMPLETED;
        this.completedAt = Instant.now();
        if (uploadedAt != null) {
            this.processingDurationMs = completedAt.toEpochMilli() - uploadedAt.toEpochMilli();
        }
    }

    public void markAsFailed(String errorMessage) {
        this.status = MeetingStatus.FAILED;
        this.errorMessage = errorMessage;
    }

    public void incrementRetryCount() {
        this.retryCount = (this.retryCount == null) ? 1 : this.retryCount + 1;
    }

    public boolean canRetry() {
        return retryCount < 3 && status == MeetingStatus.FAILED;
    }

    // NEW: Status validation methods
    public boolean isProcessing() {
        return status == MeetingStatus.TRANSCRIBING || status == MeetingStatus.PROCESSING_AI;
    }

    public boolean isCompleted() {
        return status == MeetingStatus.COMPLETED;
    }

    public boolean isFailed() {
        return status == MeetingStatus.FAILED;
    }

    public boolean isTerminal() {
        return status == MeetingStatus.COMPLETED || status == MeetingStatus.FAILED;
    }

    // Constructors
    public Meeting() {
    }

    public Meeting(String title, Long userId) {
        this.title = title;
        this.userId = userId;
    }

    // Getters and Setters (existing ones + new fields)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public List<String> getAttendees() {
        return attendees;
    }

    public void setAttendees(List<String> attendees) {
        this.attendees = attendees;
    }

    public MeetingType getMeetingType() {
        return meetingType;
    }

    public void setMeetingType(MeetingType meetingType) {
        this.meetingType = meetingType;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getAgendaNotes() {
        return agendaNotes;
    }

    public void setAgendaNotes(String agendaNotes) {
        this.agendaNotes = agendaNotes;
    }

    public String getAudioFileUrl() {
        return audioFileUrl;
    }

    public void setAudioFileUrl(String audioFileUrl) {
        this.audioFileUrl = audioFileUrl;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public MeetingStatus getStatus() {
        return status;
    }

    public void setStatus(MeetingStatus status) {
        this.status = status;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Instant getTranscriptionStartedAt() {
        return transcriptionStartedAt;
    }

    public void setTranscriptionStartedAt(Instant transcriptionStartedAt) {
        this.transcriptionStartedAt = transcriptionStartedAt;
    }

    public Instant getTranscriptionCompletedAt() {
        return transcriptionCompletedAt;
    }

    public void setTranscriptionCompletedAt(Instant transcriptionCompletedAt) {
        this.transcriptionCompletedAt = transcriptionCompletedAt;
    }

    public Instant getAiProcessingStartedAt() {
        return aiProcessingStartedAt;
    }

    public void setAiProcessingStartedAt(Instant aiProcessingStartedAt) {
        this.aiProcessingStartedAt = aiProcessingStartedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public Long getProcessingDurationMs() {
        return processingDurationMs;
    }

    public void setProcessingDurationMs(Long processingDurationMs) {
        this.processingDurationMs = processingDurationMs;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // NEW: Meeting Status Enum
    public enum MeetingStatus {
        CREATED,           // Initial state when meeting is created
        UPLOADED,          // Audio file uploaded successfully
        TRANSCRIBING,      // Transcription in progress
        TRANSCRIBED,       // Transcription completed
        PROCESSING_AI,     // AI processing in progress
        COMPLETED,         // All processing completed successfully
        FAILED             // Processing failed
    }

    public enum MeetingType {
        ONLINE, OFFLINE
    }
}
