package com.app.meetingai.controller;

import com.app.meetingai.dto.ApiResponse;
import com.app.meetingai.dto.CreateTemplateRequest;
import com.app.meetingai.dto.MeetingTemplateDto;
import com.app.meetingai.dto.UpdateTemplateRequest;
import com.app.meetingai.security.UserPrincipal;
import com.app.meetingai.service.MeetingTemplateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/templates")
public class MeetingTemplateController {

    private final MeetingTemplateService templateService;

    public MeetingTemplateController(MeetingTemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MeetingTemplateDto>> createTemplate(
            @Valid @RequestBody CreateTemplateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        
        MeetingTemplateDto template = templateService.createTemplate(user, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.success(template, "Template created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MeetingTemplateDto>>> getTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean includePublic,
            @AuthenticationPrincipal UserPrincipal user) {
        
        Page<MeetingTemplateDto> templates = templateService.getTemplates(user, page, size, includePublic);
        return ResponseEntity.ok(ApiResponse.success(templates, "Templates retrieved successfully"));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<java.util.List<MeetingTemplateDto>>> getPublicTemplates() {
        java.util.List<MeetingTemplateDto> templates = templateService.getPublicTemplates();
        return ResponseEntity.ok(ApiResponse.success(templates, "Public templates retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<java.util.List<MeetingTemplateDto>>> searchTemplates(
            @RequestParam String query,
            @AuthenticationPrincipal UserPrincipal user) {
        
        java.util.List<MeetingTemplateDto> templates = templateService.searchTemplates(user, query);
        return ResponseEntity.ok(ApiResponse.success(templates, "Search completed"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MeetingTemplateDto>> getTemplate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        
        MeetingTemplateDto template = templateService.getTemplate(user, id);
        return ResponseEntity.ok(ApiResponse.success(template, "Template retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MeetingTemplateDto>> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTemplateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        
        MeetingTemplateDto template = templateService.updateTemplate(user, id, request);
        return ResponseEntity.ok(ApiResponse.success(template, "Template updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        
        templateService.deleteTemplate(user, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Template deleted successfully"));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ApiResponse<MeetingTemplateDto>> duplicateTemplate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        
        MeetingTemplateDto template = templateService.duplicateTemplate(user, id);
        return ResponseEntity.status(201)
                .body(ApiResponse.success(template, "Template duplicated successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getTemplateStats(
            @AuthenticationPrincipal UserPrincipal user) {
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("userTemplateCount", templateService.getTemplateCount(user));
        stats.put("publicTemplateCount", templateService.getPublicTemplateCount());
        
        return ResponseEntity.ok(ApiResponse.success(stats, "Template statistics retrieved"));
    }
}
