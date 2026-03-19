package com.app.meetingai.service;

import com.app.meetingai.ai.GeminiService;
import com.app.meetingai.ai.TranscriptionService;
import com.app.meetingai.dto.*;
import com.app.meetingai.model.Meeting;
import com.app.meetingai.model.MeetingSummary;
import com.app.meetingai.repository.MeetingRepository;
import com.app.meetingai.repository.MeetingSummaryRepository;
import com.app.meetingai.security.UserPrincipal;
import com.app.meetingai.utils.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MeetingService {

    private static final Logger log = LoggerFactory.getLogger(MeetingService.class);

    private final MeetingRepository meetingRepository;
    private final MeetingSummaryRepository summaryRepository;
    private final FileStorageService fileStorageService;
    private final TranscriptionService transcriptionService;
    private final GeminiService geminiService;

    public MeetingService(MeetingRepository meetingRepository,
                          MeetingSummaryRepository summaryRepository,
                          FileStorageService fileStorageService,
                          TranscriptionService transcriptionService,
                          GeminiService geminiService) {
        this.meetingRepository = meetingRepository;
        this.summaryRepository = summaryRepository;
        this.fileStorageService = fileStorageService;
        this.transcriptionService = transcriptionService;
        this.geminiService = geminiService;
    }

    @Transactional
    public MeetingDto uploadMeeting(UserPrincipal user, String title, MultipartFile file) {
        String audioUrl = fileStorageService.store(file);
        Meeting meeting = new Meeting();
        meeting.setTitle(title != null && !title.isBlank() ? title : file.getOriginalFilename());
        meeting.setUserId(user.userId());
        meeting.setAudioFileUrl(audioUrl);
        meeting = meetingRepository.save(meeting);

        // Transcribe audio (if Speech-to-Text is configured)
        try {
            Path audioPath = fileStorageService.getAbsolutePath(audioUrl);
            if (audioPath != null && audioPath.toFile().exists()) {
                String transcript = transcriptionService.transcribe(audioPath.toString());
                meeting.setTranscript(transcript);
                meeting = meetingRepository.save(meeting);
            }
        } catch (UnsupportedOperationException e) {
            log.info("Transcription skipped - user can edit transcript manually: {}", e.getMessage());
        }

        return toDto(meeting);
    }

    @Transactional
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
            MultipartFile file) {
        Meeting meeting = new Meeting();
        meeting.setTitle(title != null && !title.isBlank() ? title : file.getOriginalFilename());
        meeting.setDescription(description);
        meeting.setMeetingDate(meetingDate);
        
        // Parse time strings to LocalTime
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime startLocalTime = startTime != null ? LocalTime.parse(startTime, timeFormatter) : null;
        LocalTime endLocalTime = endTime != null ? LocalTime.parse(endTime, timeFormatter) : null;
        
        meeting.setStartTime(startLocalTime);
        meeting.setEndTime(endLocalTime);
        meeting.setAttendees(attendees);
        
        // Parse meeting type
        Meeting.MeetingType typeEnum = null;
        if (meetingType != null) {
            try {
                typeEnum = Meeting.MeetingType.valueOf(meetingType.toUpperCase());
            } catch (IllegalArgumentException e) {
                typeEnum = Meeting.MeetingType.ONLINE; // default
            }
        }
        meeting.setMeetingType(typeEnum);
        meeting.setMeetingLink(meetingLink);
        meeting.setLocation(location);
        meeting.setLanguage(language != null ? language : "en");
        meeting.setAgendaNotes(agendaNotes);
        meeting.setUserId(user.userId());
        
        meeting = meetingRepository.save(meeting);
        
        // Handle file upload and transcription
        if (file != null && !file.isEmpty()) {
            String audioUrl = fileStorageService.store(file);
            meeting.setAudioFileUrl(audioUrl);
            meeting = meetingRepository.save(meeting);
            
            try {
                Path audioPath = fileStorageService.getAbsolutePath(audioUrl);
                if (audioPath != null && audioPath.toFile().exists()) {
                    String transcribedText = transcriptionService.transcribe(audioPath.toString());
                    meeting.setTranscript(transcribedText);
                    meeting = meetingRepository.save(meeting);
                }
            } catch (UnsupportedOperationException e) {
                log.info("Transcription skipped - user can edit transcript manually: {}", e.getMessage());
            }
        }
        
        // Handle transcript if provided
        if (transcript != null && !transcript.isBlank()) {
            meeting.setTranscript(transcript);
            meeting = meetingRepository.save(meeting);
        }
        
        return toDto(meeting);
    }

    @Transactional
    public MeetingDto createMeetingWithTranscript(UserPrincipal user, String title, String transcript) {
        Meeting meeting = new Meeting();
        meeting.setTitle(title != null && !title.isBlank() ? title : "Untitled Meeting");
        meeting.setUserId(user.userId());
        meeting.setTranscript(transcript != null ? transcript : "");
        meeting = meetingRepository.save(meeting);
        return toDto(meeting);
    }

    @Transactional
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
        meeting.setUserId(user.userId());
        
        meeting = meetingRepository.save(meeting);
        
        // Handle transcript if provided
        if (request.getTranscript() != null && !request.getTranscript().isBlank()) {
            meeting.setTranscript(request.getTranscript());
            meeting = meetingRepository.save(meeting);
        }
        
        return toDto(meeting);
    }

    @Transactional
    public MeetingDto updateMeeting(UserPrincipal user, Long id, CreateMeetingRequest request) {
        Meeting meeting = findMeetingOrThrow(id, user.userId());
        
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
        
        meeting = meetingRepository.save(meeting);
        
        // Update transcript if provided
        if (request.getTranscript() != null && !request.getTranscript().isBlank()) {
            meeting.setTranscript(request.getTranscript());
            meeting = meetingRepository.save(meeting);
        }
        
        return toDto(meeting);
    }

    public Page<MeetingDto> getMeetings(UserPrincipal user, int page, int size, String search, LocalDate from, LocalDate to) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Meeting> meetings;

        if (search != null && !search.isBlank()) {
            meetings = meetingRepository.searchByUserIdAndTitle(user.userId(), search.trim(), pageable);
        } else if (from != null && to != null) {
            Instant fromInst = from.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant toInst = to.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            meetings = meetingRepository.findByUserIdAndDateRange(user.userId(), fromInst, toInst, pageable);
        } else {
            meetings = meetingRepository.findByUserIdOrderByCreatedAtDesc(user.userId(), pageable);
        }

        return meetings.map(this::toDto);
    }

    public MeetingDto getMeeting(UserPrincipal user, Long id) {
        Meeting meeting = findMeetingOrThrow(id, user.userId());
        return toDto(meeting);
    }

    @Transactional
    public MeetingDto updateTranscript(UserPrincipal user, Long id, String transcript) {
        Meeting meeting = findMeetingOrThrow(id, user.userId());
        meeting.setTranscript(transcript != null ? transcript : "");
        meeting = meetingRepository.save(meeting);
        return toDto(meeting);
    }

    @Transactional
    public MeetingSummaryDto generateSummary(UserPrincipal user, Long meetingId) {
        Meeting meeting = findMeetingOrThrow(meetingId, user.userId());
        if (meeting.getTranscript() == null || meeting.getTranscript().isBlank()) {
            throw new ApiException("Meeting has no transcript. Add or edit transcript first.", HttpStatus.BAD_REQUEST);
        }

        Optional<MeetingSummary> existing = summaryRepository.findByMeetingId(meetingId);
        MeetingSummary summary = existing.orElseGet(() -> geminiService.generateSummary(meetingId, meeting.getTranscript()));

        if (existing.isEmpty()) {
            summary = summaryRepository.save(summary);
        }

        return toSummaryDto(summary);
    }

    public MeetingSummaryDto getSummary(UserPrincipal user, Long meetingId) {
        findMeetingOrThrow(meetingId, user.userId());
        return summaryRepository.findByMeetingId(meetingId)
                .map(this::toSummaryDto)
                .orElseThrow(() -> new ApiException("Summary not found. Generate it first.", HttpStatus.NOT_FOUND));
    }

    public DashboardStatsDto getDashboardStats(UserPrincipal user) {
        Page<Meeting> recent = meetingRepository.findByUserIdOrderByCreatedAtDesc(user.userId(), PageRequest.of(0, 5));
        List<Meeting> all = meetingRepository.findByUserIdOrderByCreatedAtDesc(user.userId(), PageRequest.of(0, 100)).getContent();

        long totalMeetings = meetingRepository.countByUserId(user.userId());
        long pendingActionItems = all.stream()
                .flatMap(m -> summaryRepository.findByMeetingId(m.getId()).stream())
                .mapToLong(s -> s.getActionItems() != null ? s.getActionItems().size() : 0L)
                .sum();

        List<MeetingDto> withSummaries = all.stream()
                .filter(m -> summaryRepository.findByMeetingId(m.getId()).isPresent())
                .limit(5)
                .map(this::toDto)
                .collect(Collectors.toList());

        return new DashboardStatsDto(
                totalMeetings,
                pendingActionItems,
                recent.getContent().stream().map(this::toDto).collect(Collectors.toList()),
                withSummaries
        );
    }

    @Transactional
    public void deleteMeeting(UserPrincipal user, Long id) {
        Meeting meeting = findMeetingOrThrow(id, user.userId());
        
        // Delete associated summaries first
        Optional<MeetingSummary> summary = summaryRepository.findByMeetingId(id);
        summary.ifPresent(summaryRepository::delete);
        
        // Delete audio file if exists
        if (meeting.getAudioFileUrl() != null) {
            try {
                Path audioPath = fileStorageService.getAbsolutePath(meeting.getAudioFileUrl());
                if (audioPath != null && audioPath.toFile().exists()) {
                    java.nio.file.Files.delete(audioPath);
                }
            } catch (Exception e) {
                log.warn("Failed to delete audio file: {}", e.getMessage());
            }
        }
        
        // Delete the meeting
        meetingRepository.delete(meeting);
        log.info("Deleted meeting {} for user {}", id, user.userId());
    }

    private Meeting findMeetingOrThrow(Long id, Long userId) {
        return meetingRepository.findById(id)
                .filter(m -> m.getUserId().equals(userId))
                .orElseThrow(() -> new ApiException("Meeting not found", HttpStatus.NOT_FOUND));
    }

    private MeetingDto toDto(Meeting m) {
        boolean hasSummary = summaryRepository.findByMeetingId(m.getId()).isPresent();
        return new MeetingDto(
                m.getId(),
                m.getTitle(),
                m.getDescription(),
                m.getMeetingDate(),
                m.getStartTime(),
                m.getEndTime(),
                m.getAttendees(),
                m.getMeetingType(),
                m.getMeetingLink(),
                m.getLocation(),
                m.getLanguage(),
                m.getAgendaNotes(),
                m.getAudioFileUrl(),
                m.getTranscript(),
                m.getCreatedAt(),
                m.getUserId(),
                hasSummary
        );
    }

    private MeetingSummaryDto toSummaryDto(MeetingSummary s) {
        return new MeetingSummaryDto(
                s.getId(), s.getMeetingId(), s.getSummary(),
                s.getKeyPoints(), s.getDecisions(), s.getActionItems(),
                s.getRisks() != null ? s.getRisks() : List.of(),
                s.getNextSteps() != null ? s.getNextSteps() : List.of(),
                s.getParticipants() != null ? s.getParticipants() : List.of()
        );
    }
}
