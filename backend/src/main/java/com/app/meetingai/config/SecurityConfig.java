package com.app.meetingai.config;

import com.app.meetingai.security.JwtAuthenticationFilter;
import com.app.meetingai.security.OAuth2SuccessHandler;
import com.app.meetingai.security.OAuth2TokenService;
import com.app.meetingai.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for application
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(UserService userService, 
                        JwtAuthenticationFilter jwtAuthenticationFilter, 
                        OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.userService = userService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Permit authentication endpoints
                .requestMatchers("/api/auth/**")
                .permitAll()
                // Permit OAuth2 endpoints
                .requestMatchers("/oauth2/authorization/**", "/login/oauth2/code/**")
                .permitAll()
                // Permit API documentation
                .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                .permitAll()
                // Permit health check
                .requestMatchers("/api/health")
                .permitAll()
                // Permit file uploads
                .requestMatchers("/uploads/**")
                .permitAll()
                // All other requests need authentication
                .anyRequest()
                .authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
