package com.app.meetingai;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class PasswordHashTest {

    @Test
    void testBcryptHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String validHash = "$2a$10$xjVJYiYxbkw7RDWAgDlw5e2.xDqQ8LcIlXkut6yBEWp6VsV9gJsL6";
        assertTrue(encoder.matches("password123", validHash));
    }
}
