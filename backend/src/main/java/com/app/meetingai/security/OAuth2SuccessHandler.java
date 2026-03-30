package com.app.meetingai.security;

import com.app.meetingai.model.User;
import com.app.meetingai.security.OAuth2TokenService;
import com.app.meetingai.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final OAuth2TokenService oAuth2TokenService;

    public OAuth2SuccessHandler(UserService userService, OAuth2TokenService oAuth2TokenService) {
        this.userService = userService;
        this.oAuth2TokenService = oAuth2TokenService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user information
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String provider = determineProvider(request);
        
        // Get or create user
        User user = userService.getOrCreateUser(email, name, provider);
        
        // Generate JWT token
        String token = oAuth2TokenService.generateTokenForUser(user);
        
        // Redirect to frontend with token and user details
        String redirectUrl = String.format(
                "http://localhost:3000/oauth-success?token=%s&userId=%d&name=%s&email=%s",
                URLEncoder.encode(token, StandardCharsets.UTF_8),
                user.getId(),
                URLEncoder.encode(user.getName(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
        );
        
        response.sendRedirect(redirectUrl);
    }
    
    private String determineProvider(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        if (requestURI.contains("google")) {
            return "GOOGLE";
        } else if (requestURI.contains("github")) {
            return "GITHUB";
        }
        return "UNKNOWN";
    }
}
