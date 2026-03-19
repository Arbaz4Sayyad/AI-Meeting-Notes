package com.app.meetingai.dto;

import java.util.List;

public record DashboardStatsDto(
        long totalMeetings,
        long pendingActionItems,
        List<MeetingDto> recentMeetings,
        List<MeetingDto> meetingsWithSummaries
) {}
