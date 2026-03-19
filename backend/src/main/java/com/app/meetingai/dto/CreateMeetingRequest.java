package com.app.meetingai.dto;

import com.app.meetingai.model.Meeting;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Email;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class CreateMeetingRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Meeting date is required")
    private LocalDate meetingDate;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    private LocalTime endTime;
    
    private List<String> attendees;
    
    @NotNull(message = "Meeting type is required")
    private Meeting.MeetingType meetingType;
    
    private String meetingLink;
    
    private String location;
    
    private String language;
    
    private String agendaNotes;
    
    private String transcript;
    
    private Boolean generateTranscript;

    // Constructors
    public CreateMeetingRequest() {}

    // Getters and Setters
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

    public Meeting.MeetingType getMeetingType() {
        return meetingType;
    }

    public void setMeetingType(Meeting.MeetingType meetingType) {
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

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public Boolean getGenerateTranscript() {
        return generateTranscript;
    }

    public void setGenerateTranscript(Boolean generateTranscript) {
        this.generateTranscript = generateTranscript;
    }
}
