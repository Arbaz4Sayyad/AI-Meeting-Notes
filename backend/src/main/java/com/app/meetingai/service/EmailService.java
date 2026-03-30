package com.app.meetingai.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@meetingai.com}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset Your Password - Meeting AI";
        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;'>" +
                "<h2 style='color: #2D3748;'>Password Reset Request</h2>" +
                "<p>Hello,</p>" +
                "<p>You requested to reset your password for your Meeting AI account. Click the button below to set a new password:</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + resetUrl + "' style='background-color: #4A5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Reset Password</a>" +
                "</div>" +
                "<p>This link will expire in 1 hour.</p>" +
                "<p>If you didn't request this, you can safely ignore this email.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='color: #718096; font-size: 12px;'>Meeting AI Team</p>" +
                "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}", toEmail, e);
            // In development, we still want to see the link in the console even if mail sending fails
            log.info("DEVELOPMENT RESET LINK: {}", resetUrl);
        } catch (Exception e) {
            log.error("Mail server not configured correctly. Logging reset link instead.");
            log.info("DEVELOPMENT RESET LINK: {}", resetUrl);
        }
    }
}
