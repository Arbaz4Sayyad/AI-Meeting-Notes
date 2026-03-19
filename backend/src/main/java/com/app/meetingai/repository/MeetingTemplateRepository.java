package com.app.meetingai.repository;

import com.app.meetingai.model.MeetingTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingTemplateRepository extends JpaRepository<MeetingTemplate, Long> {
    
    Page<MeetingTemplate> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    Page<MeetingTemplate> findByIsPublicOrderByCreatedAtDesc(Boolean isPublic, Pageable pageable);
    
    @Query("SELECT t FROM MeetingTemplate t WHERE t.userId = ?1 OR t.isPublic = true ORDER BY t.createdAt DESC")
    Page<MeetingTemplate> findUserAndPublicTemplates(Long userId, Pageable pageable);
    
    @Query("SELECT t FROM MeetingTemplate t WHERE t.userId = ?1 OR t.isPublic = true ORDER BY t.title")
    List<MeetingTemplate> findUserAndPublicTemplatesOrderedByTitle(Long userId);
    
    @Query("SELECT COUNT(t) FROM MeetingTemplate t WHERE t.userId = ?1")
    long countByUserId(Long userId);
    
    @Query("SELECT COUNT(t) FROM MeetingTemplate t WHERE t.isPublic = true")
    long countPublicTemplates();
}
