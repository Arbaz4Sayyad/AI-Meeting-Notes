package com.app.meetingai.dto;

import com.app.meetingai.model.Meeting;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record MeetingDto(
        Long id,
        String title,
        String description,
        LocalDate meetingDate,
        LocalTime startTime,
        LocalTime endTime,
        List<String> attendees,
        Meeting.MeetingType meetingType,
        String meetingLink,
        String location,
        String language,
        String agendaNotes,
        String audioFileUrl,
        String transcript,
        Instant createdAt,
        Long userId,
        boolean hasSummary
) {}
