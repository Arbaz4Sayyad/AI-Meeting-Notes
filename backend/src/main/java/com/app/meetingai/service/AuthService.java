package com.app.meetingai.service;

import com.app.meetingai.dto.AuthResponse;
import com.app.meetingai.dto.LoginRequest;
import com.app.meetingai.dto.RegisterRequest;
import com.app.meetingai.model.User;
import com.app.meetingai.repository.PasswordResetTokenRepository;
import com.app.meetingai.repository.UserRepository;
import com.app.meetingai.security.JwtService;
import com.app.meetingai.service.EmailService;
import com.app.meetingai.utils.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, 
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found with email: " + email, HttpStatus.NOT_FOUND));

        // Delete any existing token for this user
        passwordResetTokenRepository.findByUser(user).ifPresent(passwordResetTokenRepository::delete);

        // Generate a random token
        String token = java.util.UUID.randomUUID().toString();
        com.app.meetingai.model.PasswordResetToken resetToken = new com.app.meetingai.model.PasswordResetToken(
                token, 
                user, 
                java.time.Instant.now().plus(1, java.time.temporal.ChronoUnit.HOURS)
        );

        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        com.app.meetingai.model.PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ApiException("Invalid or expired password reset token", HttpStatus.BAD_REQUEST));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new ApiException("Password reset token has expired", HttpStatus.BAD_REQUEST);
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete token after successful reset
        passwordResetTokenRepository.delete(resetToken);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider("LOCAL");
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail());
    }
    
    public String generateTokenForUser(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail());
    }
}
