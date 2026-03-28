package com.app.meetingai.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "failed_jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FailedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long meetingId;
    private String jobType; // TRANSCRIPTION, AI_PROCESSING
    private String errorMessage;
    private int retryCount;
    private Instant lastAttempt;
    private Instant nextAttempt;
    private String status; // PENDING, RETRYING, GIVEN_UP

    @PrePersist
    public void prePersist() {
        if (lastAttempt == null) lastAttempt = Instant.now();
        if (status == null) status = "PENDING";
    }
}
