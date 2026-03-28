package com.app.meetingai.controller;

import com.app.meetingai.dto.ApiResponse;
import com.app.meetingai.model.MeetingSummary;
import com.app.meetingai.repository.MeetingRepository;
import com.app.meetingai.repository.MeetingSummaryRepository;
import com.app.meetingai.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summaries")
@Tag(name = "Summaries", description = "Meeting summary management")
@SecurityRequirement(name = "bearerAuth")
public class SummaryController {

    private final MeetingRepository meetingRepository;
    private final MeetingSummaryRepository summaryRepository;

    public SummaryController(MeetingRepository meetingRepository,
                            MeetingSummaryRepository summaryRepository) {
        this.meetingRepository = meetingRepository;
        this.summaryRepository = summaryRepository;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete meeting summary")
    public ResponseEntity<ApiResponse<Void>> deleteSummary(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {
        
        MeetingSummary summary = summaryRepository.findById(id)
                .orElseThrow(() -> new com.app.meetingai.utils.ApiException("Summary not found", 
                        org.springframework.http.HttpStatus.NOT_FOUND));
        
        // Verify the summary belongs to a meeting owned by the user
        meetingRepository.findById(summary.getMeetingId())
                .filter(m -> m.getUserId().equals(user.getUserId()))
                .orElseThrow(() -> new com.app.meetingai.utils.ApiException("Access denied", 
                        org.springframework.http.HttpStatus.FORBIDDEN));
        
        summaryRepository.delete(summary);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Summary deleted successfully"));
    }
}
