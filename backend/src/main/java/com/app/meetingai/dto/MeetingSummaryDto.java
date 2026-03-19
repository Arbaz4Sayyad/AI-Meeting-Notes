package com.app.meetingai.dto;

import java.util.List;

public record MeetingSummaryDto(
        Long id,
        Long meetingId,
        String summary,
        List<String> keyPoints,
        List<String> decisions,
        List<String> actionItems,
        List<String> risks,
        List<String> nextSteps,
        List<String> participants
) {}
