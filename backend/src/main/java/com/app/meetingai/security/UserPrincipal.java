package com.app.meetingai.security;

/**
 * Principal object holding authenticated user info.
 */
public record UserPrincipal(Long userId, String email) {}
