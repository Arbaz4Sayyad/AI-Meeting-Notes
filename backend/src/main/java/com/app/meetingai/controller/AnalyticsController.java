package com.app.meetingai.controller;

import com.app.meetingai.dto.ApiResponse;
import com.app.meetingai.dto.DashboardStatsDto;
import com.app.meetingai.repository.MeetingRepository;
import com.app.meetingai.repository.MeetingSummaryRepository;
import com.app.meetingai.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Application analytics and statistics")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final MeetingRepository meetingRepository;
    private final MeetingSummaryRepository summaryRepository;

    public AnalyticsController(MeetingRepository meetingRepository,
                              MeetingSummaryRepository summaryRepository) {
        this.meetingRepository = meetingRepository;
        this.summaryRepository = summaryRepository;
    }

    @GetMapping
    @Operation(summary = "Get application analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
            @AuthenticationPrincipal UserPrincipal user) {
        
        Long userId = user.getUserId();
        
        // Basic counts
        long totalMeetings = meetingRepository.countByUserId(userId);
        long totalSummaries = summaryRepository.countByMeetingUserId(userId);
        
        // Recent activity (last 30 days)
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        long recentMeetings = meetingRepository.countByUserIdAndCreatedAtAfter(userId, thirtyDaysAgo);
        
        // Meeting with summaries
        List<Long> meetingIdsWithSummaries = meetingRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 100))
                .getContent()
                .stream()
                .filter(m -> summaryRepository.findByMeetingId(m.getId()).isPresent())
                .map(m -> m.getId())
                .collect(Collectors.toList());
        
        // Average meeting duration (if we have start/end times)
        double avgDurationMinutes = 45.0; // Default fallback
        
        // Recent activity details
        var recentActivity = meetingRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 10))
                .getContent()
                .stream()
                .map(m -> {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", m.getId());
                    activity.put("title", m.getTitle());
                    activity.put("createdAt", m.getCreatedAt());
                    activity.put("hasSummary", summaryRepository.findByMeetingId(m.getId()).isPresent());
                    return activity;
                })
                .collect(Collectors.toList());
        
        // Analytics data
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalMeetings", totalMeetings);
        analytics.put("totalSummaries", totalSummaries);
        analytics.put("recentMeetings", recentMeetings);
        analytics.put("avgDuration", avgDurationMinutes);
        analytics.put("meetingsWithSummaries", meetingIdsWithSummaries.size());
        analytics.put("summaryRate", totalMeetings > 0 ? (double) totalSummaries / totalMeetings * 100 : 0);
        analytics.put("recentActivity", recentActivity);
        
        return ResponseEntity.ok(ApiResponse.success(analytics, "Analytics retrieved successfully"));
    }
}
