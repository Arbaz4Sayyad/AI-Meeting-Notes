package com.app.meetingai.service;

import com.app.meetingai.dto.CreateTemplateRequest;
import com.app.meetingai.dto.MeetingTemplateDto;
import com.app.meetingai.dto.UpdateTemplateRequest;
import com.app.meetingai.model.MeetingTemplate;
import com.app.meetingai.repository.MeetingTemplateRepository;
import com.app.meetingai.security.UserPrincipal;
import com.app.meetingai.utils.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MeetingTemplateService {

    private static final Logger log = LoggerFactory.getLogger(MeetingTemplateService.class);

    private final MeetingTemplateRepository templateRepository;

    public MeetingTemplateService(MeetingTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public MeetingTemplateDto createTemplate(UserPrincipal user, CreateTemplateRequest request) {
        log.info("Creating new template: {} for user: {}", request.title(), user.userId());
        
        MeetingTemplate template = new MeetingTemplate();
        template.setTitle(request.title());
        template.setDescription(request.description());
        template.setAgendaItems(request.agendaItems());
        template.setSuggestedParticipants(request.suggestedParticipants());
        template.setCommonActionItems(request.commonActionItems());
        template.setUserId(user.userId());
        template.setIsPublic(request.isPublic() != null ? request.isPublic() : false);
        
        template = templateRepository.save(template);
        log.info("Template created with ID: {}", template.getId());
        
        return MeetingTemplateDto.from(template);
    }

    public Page<MeetingTemplateDto> getTemplates(UserPrincipal user, int page, int size, boolean includePublic) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MeetingTemplate> templates;
        
        if (includePublic) {
            templates = templateRepository.findUserAndPublicTemplates(user.userId(), pageable)
                    .map(t -> t);
        } else {
            templates = templateRepository.findByUserIdOrderByCreatedAtDesc(user.userId(), pageable);
        }
        
        return templates.map(MeetingTemplateDto::from);
    }

    public MeetingTemplateDto getTemplate(UserPrincipal user, Long id) {
        MeetingTemplate template = findTemplateOrThrow(id);
        
        // Check if user owns the template or if it's public
        if (!template.getUserId().equals(user.userId()) && !template.getIsPublic()) {
            throw new ApiException("Template not found or access denied", HttpStatus.NOT_FOUND);
        }
        
        return MeetingTemplateDto.from(template);
    }

    public MeetingTemplateDto updateTemplate(UserPrincipal user, Long id, UpdateTemplateRequest request) {
        MeetingTemplate template = findTemplateOrThrow(id);
        
        // Check if user owns the template
        if (!template.getUserId().equals(user.userId())) {
            throw new ApiException("You can only edit your own templates", HttpStatus.FORBIDDEN);
        }
        
        log.info("Updating template: {} for user: {}", id, user.userId());
        
        if (request.title() != null) template.setTitle(request.title());
        if (request.description() != null) template.setDescription(request.description());
        if (request.agendaItems() != null) template.setAgendaItems(request.agendaItems());
        if (request.suggestedParticipants() != null) template.setSuggestedParticipants(request.suggestedParticipants());
        if (request.commonActionItems() != null) template.setCommonActionItems(request.commonActionItems());
        if (request.isPublic() != null) template.setIsPublic(request.isPublic());
        
        template = templateRepository.save(template);
        log.info("Template updated: {}", id);
        
        return MeetingTemplateDto.from(template);
    }

    public void deleteTemplate(UserPrincipal user, Long id) {
        MeetingTemplate template = findTemplateOrThrow(id);
        
        // Check if user owns the template
        if (!template.getUserId().equals(user.userId())) {
            throw new ApiException("You can only delete your own templates", HttpStatus.FORBIDDEN);
        }
        
        log.info("Deleting template: {} for user: {}", id, user.userId());
        templateRepository.delete(template);
    }

    public List<MeetingTemplateDto> getPublicTemplates() {
        Pageable pageable = PageRequest.of(0, 100); // Limit to 100 public templates
        Page<MeetingTemplate> templates = templateRepository.findByIsPublicOrderByCreatedAtDesc(true, pageable);
        return templates.stream()
                .map(MeetingTemplateDto::from)
                .collect(Collectors.toList());
    }

    public List<MeetingTemplateDto> searchTemplates(UserPrincipal user, String query) {
        List<MeetingTemplate> templates = templateRepository.findUserAndPublicTemplatesOrderedByTitle(user.userId());
        
        if (query != null && !query.trim().isEmpty()) {
            String searchTerm = query.toLowerCase().trim();
            return templates.stream()
                    .filter(t -> t.getTitle().toLowerCase().contains(searchTerm) ||
                               t.getDescription().toLowerCase().contains(searchTerm))
                    .map(MeetingTemplateDto::from)
                    .collect(Collectors.toList());
        }
        
        return templates.stream()
                .map(MeetingTemplateDto::from)
                .collect(Collectors.toList());
    }

    public MeetingTemplateDto duplicateTemplate(UserPrincipal user, Long id) {
        MeetingTemplate original = findTemplateOrThrow(id);
        
        // Check if user can access the original template
        if (!original.getUserId().equals(user.userId()) && !original.getIsPublic()) {
            throw new ApiException("Template not found or access denied", HttpStatus.NOT_FOUND);
        }
        
        log.info("Duplicating template: {} for user: {}", id, user.userId());
        
        MeetingTemplate duplicate = new MeetingTemplate();
        duplicate.setTitle(original.getTitle() + " (Copy)");
        duplicate.setDescription(original.getDescription());
        duplicate.setAgendaItems(original.getAgendaItems());
        duplicate.setSuggestedParticipants(original.getSuggestedParticipants());
        duplicate.setCommonActionItems(original.getCommonActionItems());
        duplicate.setUserId(user.userId());
        duplicate.setIsPublic(false); // Copies are private by default
        
        duplicate = templateRepository.save(duplicate);
        log.info("Template duplicated with new ID: {}", duplicate.getId());
        
        return MeetingTemplateDto.from(duplicate);
    }

    private MeetingTemplate findTemplateOrThrow(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new ApiException("Template not found", HttpStatus.NOT_FOUND));
    }

    public long getTemplateCount(UserPrincipal user) {
        return templateRepository.countByUserId(user.userId());
    }

    public long getPublicTemplateCount() {
        return templateRepository.countPublicTemplates();
    }
}
