package com.app.meetingai.service;

import com.app.meetingai.dto.AuthResponse;
import com.app.meetingai.dto.LoginRequest;
import com.app.meetingai.dto.RegisterRequest;
import com.app.meetingai.model.User;
import com.app.meetingai.repository.UserRepository;
import com.app.meetingai.security.JwtService;
import com.app.meetingai.utils.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return AuthResponse.of(token, user.getId(), user.getName(), user.getEmail());
    }
}
