package com.app.meetingai.security;

/**
 * Custom User Principal for Spring Security.
 * Using a hybrid record to support both record-style (userId()) and bean-style (getUserId()) access.
 */
public record UserPrincipal(Long userId, String email) {
    
    public Long getUserId() {
        return userId;
    }
    
    public String getEmail() {
        return email;
    }
}
