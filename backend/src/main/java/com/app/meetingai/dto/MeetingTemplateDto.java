package com.app.meetingai.dto;

import java.time.LocalDateTime;
import java.util.List;

public record MeetingTemplateDto(
    Long id,
    String title,
    String description,
    List<String> agendaItems,
    List<String> suggestedParticipants,
    List<String> commonActionItems,
    Boolean isPublic,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static MeetingTemplateDto from(com.app.meetingai.model.MeetingTemplate template) {
        return new MeetingTemplateDto(
            template.getId(),
            template.getTitle(),
            template.getDescription(),
            template.getAgendaItems(),
            template.getSuggestedParticipants(),
            template.getCommonActionItems(),
            template.getIsPublic(),
            template.getCreatedAt(),
            template.getUpdatedAt()
        );
    }
}
