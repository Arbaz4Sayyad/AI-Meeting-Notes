package com.app.meetingai.dto;

import jakarta.validation.constraints.NotBlank;

public record TranscriptUpdateRequest(
        @NotBlank(message = "Transcript content is required")
        String transcript
) {}
