package com.app.meetingai.dto;

import java.util.List;

public record CreateTemplateRequest(
    String title,
    String description,
    List<String> agendaItems,
    List<String> suggestedParticipants,
    List<String> commonActionItems,
    Boolean isPublic
) {}
