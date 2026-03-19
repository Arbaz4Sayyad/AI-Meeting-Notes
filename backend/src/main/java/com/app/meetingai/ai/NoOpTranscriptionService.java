package com.app.meetingai.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

/**
 * Fallback when Google Speech-to-Text is not configured.
 * Users must provide transcript manually or configure GCP credentials.
 */
@Service
@ConditionalOnMissingBean(TranscriptionService.class)
public class NoOpTranscriptionService implements TranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(NoOpTranscriptionService.class);

    @Override
    public String transcribe(String audioFilePath) {
        log.warn("Transcription requested but Google Speech-to-Text is not configured. Set GCP_PROJECT_ID and credentials.");
        throw new UnsupportedOperationException(
                "Speech-to-Text is not configured. Please set GCP_PROJECT_ID and GCP_CREDENTIALS_PATH, or provide transcript manually.");
    }
}
