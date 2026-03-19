package com.app.meetingai.dto;

import jakarta.validation.constraints.NotBlank;

public record BasicCreateMeetingRequest(
        @NotBlank(message = "Title is required")
        String title,
        
        String transcript
) {}
