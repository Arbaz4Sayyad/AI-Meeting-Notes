package com.app.meetingai.service;

import com.app.meetingai.dto.CreateMeetingRequest;
import com.app.meetingai.dto.DashboardStatsDto;
import com.app.meetingai.dto.MeetingDto;
import com.app.meetingai.dto.MeetingSummaryDto;
import com.app.meetingai.events.AudioUploadedEvent;
import com.app.meetingai.model.Meeting;
import com.app.meetingai.model.Meeting.MeetingStatus;
import com.app.meetingai.model.MeetingSummary;
import com.app.meetingai.repository.MeetingRepository;
import com.app.meetingai.repository.MeetingSummaryRepository;
import com.app.meetingai.security.UserPrincipal;
import com.app.meetingai.utils.ApiException;
import com.app.meetingai.utils.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MeetingService {

    private static final Logger log = LoggerFactory.getLogger(MeetingService.class);

    private final MeetingRepository meetingRepository;
    private final MeetingSummaryRepository summaryRepository;
    private final FileStorageService fileStorageService;
    private final ApplicationEventPublisher eventPublisher;

    public MeetingService(MeetingRepository meetingRepository,
                          MeetingSummaryRepository summaryRepository,
                          FileStorageService fileStorageService,
                          ApplicationEventPublisher eventPublisher) {
        this.meetingRepository = meetingRepository;
        this.summaryRepository = summaryRepository;
        this.fileStorageService = fileStorageService;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Upload meeting audio with metadata and trigger async processing
     */
    public MeetingDto uploadMeetingWithMetadata(
            UserPrincipal user,
            String title,
            String description,
            LocalDate meetingDate,
            String startTime,
            String endTime,
            List<String> attendees,
            String meetingType,
            String meetingLink,
            String location,
            String language,
            String agendaNotes,
            String transcript,
            MultipartFile audioFile) {

        try {
            log.info("Starting meeting upload with metadata for user: {}, title: {}", user.getUserId(), title);

            // Create meeting entity
            Meeting meeting = new Meeting();
            meeting.setTitle(title);
            meeting.setDescription(description);
            meeting.setMeetingDate(meetingDate);
            meeting.setStartTime(LocalTime.parse(startTime));
            meeting.setEndTime(LocalTime.parse(endTime));
            meeting.setAttendees(attendees);
            meeting.setMeetingType(Meeting.MeetingType.valueOf(meetingType.toUpperCase()));
            meeting.setMeetingLink(meetingLink);
            meeting.setLocation(location);
            meeting.setAgendaNotes(agendaNotes);
            meeting.setLanguage(language != null ? language : "en");
            meeting.setTranscript(transcript);
            meeting.setUserId(user.getUserId());

            // Save meeting first
            meeting = meetingRepository.save(meeting);
            log.info("Created meeting with ID: {}", meeting.getId());

            if (audioFile != null && !audioFile.isEmpty()) {
                // Upload audio file
                String audioFilePath = fileStorageService.store(audioFile);
                meeting.setAudioFileUrl(audioFilePath);
                meeting.markAsUploaded();
                meeting = meetingRepository.save(meeting);

                log.info("Audio file saved for meeting ID: {}, path: {}", meeting.getId(), audioFilePath);

                // Publish event to trigger transcription. The listener will be @Async.
                AudioUploadedEvent event = new AudioUploadedEvent(
                    this, meeting, audioFilePath, user.getUserId().toString());
                eventPublisher.publishEvent(event);
            }

            return convertToDto(meeting);

        } catch (Exception e) {
            log.error("Failed to upload meeting with metadata", e);
            throw new ApiException("Failed to upload meeting: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create meeting with transcript directly
     */
    public MeetingDto createMeeting(UserPrincipal user, CreateMeetingRequest request) {
        Meeting meeting = new Meeting();
        meeting.setTitle(request.getTitle());
        meeting.setDescription(request.getDescription());
        meeting.setMeetingDate(request.getMeetingDate());
        meeting.setStartTime(request.getStartTime());
        meeting.setEndTime(request.getEndTime());
        meeting.setAttendees(request.getAttendees());
        meeting.setMeetingType(request.getMeetingType());
        meeting.setMeetingLink(request.getMeetingLink());
        meeting.setLocation(request.getLocation());
        meeting.setLanguage(request.getLanguage() != null ? request.getLanguage() : "en");
        meeting.setAgendaNotes(request.getAgendaNotes());
        meeting.setTranscript(request.getTranscript());
        meeting.setUserId(user.getUserId());
        
        if (meeting.getTranscript() != null && !meeting.getTranscript().isEmpty()) {
            meeting.setStatus(Meeting.MeetingStatus.TRANSCRIBED);
        }

        meeting = meetingRepository.save(meeting);
        return convertToDto(meeting);
    }

    /**
     * Create basic meeting with transcript only
     */
    public MeetingDto createMeetingWithTranscript(UserPrincipal user, String title, String transcript) {
        Meeting meeting = new Meeting();
        meeting.setTitle(title);
        meeting.setTranscript(transcript);
        meeting.setUserId(user.getUserId());
        meeting.setStatus(Meeting.MeetingStatus.TRANSCRIBED);
        
        meeting = meetingRepository.save(meeting);
        return convertToDto(meeting);
    }

    /**
     * Get dashboard statistics for user
     */
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(UserPrincipal user) {
        long totalMeetings = meetingRepository.countByUserId(user.getUserId());
        long pendingActionItems = 0; // Placeholder or fetch from DB
        
        PageRequest pageRequest = PageRequest.of(0, 5);
        List<MeetingDto> recentMeetings = meetingRepository.findByUserIdOrderByCreatedAtDesc(user.getUserId(), pageRequest)
                .map(this::convertToDto).getContent();
        
        List<MeetingDto> meetingsWithSummaries = meetingRepository.findRecentCompletedByUserId(user.getUserId(), pageRequest)
                .stream().map(this::convertToDto).toList();

        return new DashboardStatsDto(totalMeetings, pendingActionItems, recentMeetings, meetingsWithSummaries);
    }

    /**
     * Get meeting with search and filters
     */
    @Transactional(readOnly = true)
    public Page<MeetingDto> getMeetings(UserPrincipal user, int page, int size, String search, LocalDate from, LocalDate to) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Instant fromInstant = from != null ? from.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant() : Instant.EPOCH;
        Instant toInstant = to != null ? to.plusDays(1).atStartOfDay(java.time.ZoneId.systemDefault()).toInstant() : Instant.now();
        
        Page<Meeting> meetings;
        if (search != null && !search.isEmpty()) {
            meetings = meetingRepository.searchByUserIdAndTitleAndDateRange(user.getUserId(), search, fromInstant, toInstant, pageRequest);
        } else {
            meetings = meetingRepository.findByUserIdOrderByCreatedAtDesc(user.getUserId(), pageRequest);
        }
        
        return meetings.map(this::convertToDto);
    }

    /**
     * Update existing meeting
     */
    public MeetingDto updateMeeting(UserPrincipal user, Long id, CreateMeetingRequest request) {
        Meeting meeting = getMeetingById(id);
        
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        meeting.setTitle(request.getTitle());
        meeting.setDescription(request.getDescription());
        meeting.setMeetingDate(request.getMeetingDate());
        meeting.setStartTime(request.getStartTime());
        meeting.setEndTime(request.getEndTime());
        meeting.setAttendees(request.getAttendees());
        meeting.setMeetingType(request.getMeetingType());
        meeting.setMeetingLink(request.getMeetingLink());
        meeting.setLocation(request.getLocation());
        meeting.setLanguage(request.getLanguage());
        meeting.setAgendaNotes(request.getAgendaNotes());
        
        if (request.getTranscript() != null) {
            meeting.setTranscript(request.getTranscript());
        }

        meeting = meetingRepository.save(meeting);
        return convertToDto(meeting);
    }

    /**
     * Get meeting for user
     */
    @Cacheable(value = "meetings", key = "#id")
    @Transactional(readOnly = true)
    public MeetingDto getMeeting(UserPrincipal user, Long id) {
        log.info("Fetching meeting details for ID: {}", id);
        Meeting meeting = getMeetingById(id);
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        return convertToDto(meeting);
    }

    /**
     * Manual summary generation
     */
    public MeetingSummaryDto generateSummary(UserPrincipal user, Long id) {
        Meeting meeting = getMeetingById(id);
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        
        if (meeting.getTranscript() == null || meeting.getTranscript().isEmpty()) {
            throw new ApiException("Cannot generate summary: Transcript is empty", HttpStatus.BAD_REQUEST);
        }

        // Logic handled by AIProcessingService typically, but here we just return the Summary if exists 
        // or trigger processing. For brevity, we'll just check repository.
        MeetingSummary summary = summaryRepository.findByMeetingId(id)
                .orElseThrow(() -> new ApiException("Summary not generated yet/failed", HttpStatus.ACCEPTED));
        
        return convertToSummaryDto(summary);
    }

    /**
     * Get summary for meeting
     */
    @Transactional(readOnly = true)
    public MeetingSummaryDto getSummary(UserPrincipal user, Long id) {
        Meeting meeting = getMeetingById(id);
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }
        
        MeetingSummary summary = summaryRepository.findByMeetingId(id)
                .orElseThrow(() -> new ApiException("Summary not found", HttpStatus.NOT_FOUND));
        
        return convertToSummaryDto(summary);
    }

    private MeetingSummaryDto convertToSummaryDto(MeetingSummary summary) {
        return new MeetingSummaryDto(
                summary.getId(),
                summary.getMeetingId(),
                summary.getSummary(),
                summary.getKeyPoints(),
                summary.getDecisions(),
                summary.getActionItems(),
                summary.getRisks(),
                summary.getNextSteps(),
                summary.getParticipants()
        );
    }

    /**
     * Get meeting by ID with status information
     */
    @Transactional(readOnly = true)
    public Meeting getMeetingById(Long meetingId) {
        return meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ApiException("Meeting not found", HttpStatus.NOT_FOUND));
    }

    /**
     * Get meeting with processing status
     */
    @Transactional(readOnly = true)
    public MeetingDto getMeetingWithStatus(Long meetingId, UserPrincipal user) {
        Meeting meeting = getMeetingById(meetingId);
        
        // Verify ownership
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        return convertToDto(meeting);
    }

    /**
     * Get user meetings with pagination and status filtering
     */
    @Transactional(readOnly = true)
    public Page<MeetingDto> getUserMeetings(UserPrincipal user, int page, int size, String statusFilter) {
        PageRequest pageRequest = PageRequest.of(page, size);
        
        Page<Meeting> meetings;
        if (statusFilter != null && !statusFilter.isEmpty()) {
            try {
                Meeting.MeetingStatus status = Meeting.MeetingStatus.valueOf(statusFilter.toUpperCase());
                meetings = meetingRepository.findByUserIdAndStatus(user.getUserId(), status, pageRequest);
            } catch (IllegalArgumentException e) {
                throw new ApiException("Invalid status filter: " + statusFilter, HttpStatus.BAD_REQUEST);
            }
        } else {
            meetings = meetingRepository.findByUserIdOrderByCreatedAtDesc(user.getUserId(), pageRequest);
        }

        return meetings.map(this::convertToDto);
    }

    /**
     * Save meeting (used by other services)
     */
    public Meeting saveMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    /**
     * Update meeting transcript
     */
    public MeetingDto updateTranscript(Long meetingId, String transcript, UserPrincipal user) {
        Meeting meeting = getMeetingById(meetingId);
        
        // Verify ownership
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        meeting.setTranscript(transcript);
        meeting = meetingRepository.save(meeting);

        return convertToDto(meeting);
    }

    /**
     * Delete meeting
     */
    public void deleteMeeting(Long meetingId, UserPrincipal user) {
        Meeting meeting = getMeetingById(meetingId);
        
        // Verify ownership
        if (!meeting.getUserId().equals(user.getUserId())) {
            throw new ApiException("Access denied", HttpStatus.FORBIDDEN);
        }

        // Delete audio file if exists
        if (meeting.getAudioFileUrl() != null) {
            try {
                fileStorageService.delete(meeting.getAudioFileUrl());
            } catch (Exception e) {
                log.warn("Failed to delete audio file: " + meeting.getAudioFileUrl(), e);
            }
        }

        // Delete meeting summaries
        summaryRepository.deleteByMeetingId(meetingId);

        // Delete meeting
        meetingRepository.delete(meeting);
        
        log.info("Deleted meeting ID: {}", meetingId);
    }

    /**
     * Convert Meeting entity to DTO
     */
    private MeetingDto convertToDto(Meeting meeting) {
        MeetingDto dto = new MeetingDto();
        dto.setId(meeting.getId());
        dto.setTitle(meeting.getTitle());
        dto.setDescription(meeting.getDescription());
        dto.setMeetingDate(meeting.getMeetingDate());
        dto.setStartTime(meeting.getStartTime());
        dto.setEndTime(meeting.getEndTime());
        dto.setAttendees(meeting.getAttendees());
        dto.setMeetingType(meeting.getMeetingType().name());
        dto.setMeetingLink(meeting.getMeetingLink());
        dto.setLocation(meeting.getLocation());
        dto.setLanguage(meeting.getLanguage());
        dto.setAgendaNotes(meeting.getAgendaNotes());
        dto.setAudioFileUrl(meeting.getAudioFileUrl());
        dto.setTranscript(meeting.getTranscript());
        dto.setCreatedAt(meeting.getCreatedAt());
        dto.setStatus(meeting.getStatus().name());
        dto.setUploadedAt(meeting.getUploadedAt());
        dto.setTranscriptionStartedAt(meeting.getTranscriptionStartedAt());
        dto.setTranscriptionCompletedAt(meeting.getTranscriptionCompletedAt());
        dto.setAiProcessingStartedAt(meeting.getAiProcessingStartedAt());
        dto.setCompletedAt(meeting.getCompletedAt());
        dto.setErrorMessage(meeting.getErrorMessage());
        dto.setRetryCount(meeting.getRetryCount());
        dto.setProcessingDurationMs(meeting.getProcessingDurationMs());
        dto.setUserId(meeting.getUserId());
        dto.setHasSummary(summaryRepository.findByMeetingId(meeting.getId()).isPresent());
        return dto;
    }
}
