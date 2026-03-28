package com.app.meetingai.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

/**
 * Manual transcription service fallback when Google Speech-to-Text is not configured.
 * This service throws UnsupportedOperationException to indicate manual transcription is required.
 */
@Service("aiTranscriptionService")
@Primary
public class ManualTranscriptionService implements AiTranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(ManualTranscriptionService.class);

    @Override
    public String transcribe(String audioFileUrl) {
        log.info("Auto-transcription not available. Please provide transcript manually.");
        throw new UnsupportedOperationException("Speech-to-Text not configured. Please provide transcript manually.");
    }
}
