package com.app.meetingai.security;

import com.app.meetingai.model.User;
import com.app.meetingai.security.JwtService;
import org.springframework.stereotype.Component;

@Component
public class OAuth2TokenService {

    private final JwtService jwtService;

    public OAuth2TokenService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public String generateTokenForUser(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail());
    }
}
