package com.app.meetingai.controller;

import com.app.meetingai.dto.ApiResponse;
import com.app.meetingai.dto.MeetingDto;
import com.app.meetingai.dto.MeetingSummaryDto;
import com.app.meetingai.dto.CreateMeetingRequest;
import com.app.meetingai.dto.BasicCreateMeetingRequest;
import com.app.meetingai.dto.DashboardStatsDto;
import com.app.meetingai.dto.TranscriptUpdateRequest;
import com.app.meetingai.security.UserPrincipal;
import com.app.meetingai.service.MeetingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/meetings")
@Tag(name = "Meetings", description = "Meeting upload, list, transcript, and summary")
@SecurityRequirement(name = "bearerAuth")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping("/upload")
    @Operation(summary = "Upload meeting audio")
    public ResponseEntity<ApiResponse<MeetingDto>> upload(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("meetingDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate meetingDate,
            @RequestParam("startTime") String startTime,
            @RequestParam("endTime") String endTime,
            @RequestParam("attendees") List<String> attendees,
            @RequestParam("meetingType") String meetingType,
            @RequestParam("meetingLink") String meetingLink,
            @RequestParam("location") String location,
            @RequestParam("language") String language,
            @RequestParam("agendaNotes") String agendaNotes,
            @RequestParam("transcript") String transcript,
            @RequestParam("file") MultipartFile file) {
        MeetingDto meeting = meetingService.uploadMeetingWithMetadata(user, title, description, meetingDate, startTime, endTime, attendees, meetingType, meetingLink, location, language, agendaNotes, transcript, file);
        return ResponseEntity.ok(ApiResponse.success(meeting, "Meeting uploaded successfully"));
    }

    @PostMapping
    @Operation(summary = "Create meeting with transcript")
    public ResponseEntity<ApiResponse<MeetingDto>> createWithTranscript(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody CreateMeetingRequest request) {
        MeetingDto meeting = meetingService.createMeeting(user, request);
        return ResponseEntity.ok(ApiResponse.success(meeting, "Meeting created"));
    }

    @PostMapping("/basic")
    @Operation(summary = "Create basic meeting with transcript only")
    public ResponseEntity<ApiResponse<MeetingDto>> createBasicWithTranscript(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody BasicCreateMeetingRequest request) {
        MeetingDto meeting = meetingService.createMeetingWithTranscript(
                user, request.title(), request.transcript());
        return ResponseEntity.ok(ApiResponse.success(meeting, "Meeting created"));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> dashboard(
            @AuthenticationPrincipal UserPrincipal user) {
        DashboardStatsDto stats = meetingService.getDashboardStats(user);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping
    @Operation(summary = "List meetings with pagination, search, and date filter")
    public ResponseEntity<ApiResponse<List<MeetingDto>>> list(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        Page<MeetingDto> meetings = meetingService.getMeetings(user, page, size, search, from, to);
        ApiResponse.PageInfo pageInfo = new ApiResponse.PageInfo(
                page, size, meetings.getTotalElements(), meetings.getTotalPages());
        return ResponseEntity.ok(ApiResponse.success(meetings.getContent(), pageInfo));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update meeting")
    public ResponseEntity<ApiResponse<MeetingDto>> updateMeeting(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id,
            @Valid @RequestBody CreateMeetingRequest request) {
        MeetingDto meeting = meetingService.updateMeeting(user, id, request);
        return ResponseEntity.ok(ApiResponse.success(meeting, "Meeting updated"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get meeting by ID")
    public ResponseEntity<ApiResponse<MeetingDto>> get(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {
        MeetingDto meeting = meetingService.getMeeting(user, id);
        return ResponseEntity.ok(ApiResponse.success(meeting));
    }

    @PutMapping("/{id}/transcript")
    @Operation(summary = "Update meeting transcript")
    public ResponseEntity<ApiResponse<MeetingDto>> updateTranscript(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id,
            @Valid @RequestBody TranscriptUpdateRequest request) {
        MeetingDto meeting = meetingService.updateTranscript(id, request.transcript(), user);
        return ResponseEntity.ok(ApiResponse.success(meeting, "Transcript updated"));
    }

    @PostMapping("/{id}/generate-summary")
    @Operation(summary = "Generate AI meeting summary")
    public ResponseEntity<ApiResponse<MeetingSummaryDto>> generateSummary(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {
        MeetingSummaryDto summary = meetingService.generateSummary(user, id);
        return ResponseEntity.ok(ApiResponse.success(summary, "Summary generated successfully"));
    }

    @GetMapping("/{id}/summary")
    @Operation(summary = "Get meeting summary")
    public ResponseEntity<ApiResponse<MeetingSummaryDto>> getSummary(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {
        MeetingSummaryDto summary = meetingService.getSummary(user, id);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete meeting")
    public ResponseEntity<ApiResponse<Void>> deleteMeeting(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable Long id) {
        meetingService.deleteMeeting(id, user);
        return ResponseEntity.ok(ApiResponse.success(null, "Meeting deleted successfully"));
    }
}
