package com.app.meetingai.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "meeting_summaries")
public class MeetingSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_id", nullable = false, unique = true)
    private Long meetingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", insertable = false, updatable = false)
    private Meeting meeting;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "key_points", columnDefinition = "jsonb")
    private List<String> keyPoints;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> decisions;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "action_items", columnDefinition = "jsonb")
    private List<String> actionItems;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "risks", columnDefinition = "jsonb")
    private List<String> risks;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "next_steps", columnDefinition = "jsonb")
    private List<String> nextSteps;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "participants", columnDefinition = "jsonb")
    private List<String> participants;

    // Constructors
    public MeetingSummary() {
    }

    public MeetingSummary(Long meetingId, String summary) {
        this.meetingId = meetingId;
        this.summary = summary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(Long meetingId) {
        this.meetingId = meetingId;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(List<String> keyPoints) {
        this.keyPoints = keyPoints;
    }

    public List<String> getDecisions() {
        return decisions;
    }

    public void setDecisions(List<String> decisions) {
        this.decisions = decisions;
    }

    public List<String> getActionItems() {
        return actionItems;
    }

    public void setActionItems(List<String> actionItems) {
        this.actionItems = actionItems;
    }

    public List<String> getRisks() {
        return risks;
    }

    public void setRisks(List<String> risks) {
        this.risks = risks;
    }

    public List<String> getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(List<String> nextSteps) {
        this.nextSteps = nextSteps;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }
}
