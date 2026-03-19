package com.app.meetingai.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.file.Path;
import java.util.Base64;
import java.util.Map;

/**
 * OpenAI Whisper implementation for audio transcription.
 * Requires OPENAI_API_KEY.
 */
@Service
@ConditionalOnExpression("'${app.openai.api-key:}'.length() > 0")
public class WhisperTranscriptionService implements TranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(WhisperTranscriptionService.class);
    private static final String WHISPER_API_URL = "https://api.openai.com/v1/audio/transcriptions";

    private final WebClient webClient;
    private final String apiKey;

    public WhisperTranscriptionService(
            WebClient.Builder webClientBuilder,
            @Value("${app.openai.api-key}") String apiKey) {
        this.webClient = webClientBuilder.build();
        this.apiKey = apiKey;
        log.info("Whisper transcription service initialized");
    }

    @Override
    public String transcribe(String audioFilePath) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new UnsupportedOperationException("OpenAI API key not configured");
        }

        try {
            Path audioPath = Path.of(audioFilePath);
            if (!audioPath.toFile().exists()) {
                throw new RuntimeException("Audio file not found: " + audioFilePath);
            }

            // Read file as byte array
            byte[] audioBytes = java.nio.file.Files.readAllBytes(audioPath);
            String fileName = audioPath.getFileName().toString();
            
            // Create multipart form data
            String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
            
            StringBuilder formData = new StringBuilder();
            formData.append("--").append(boundary).append("\r\n");
            formData.append("Content-Disposition: form-data; name=\"file\"; filename=\"").append(fileName).append("\"\r\n");
            formData.append("Content-Type: audio/mpeg\r\n\r\n");
            
            byte[] filePart = formData.toString().getBytes();
            formData.setLength(0);
            formData.append("\r\n--").append(boundary).append("\r\n");
            formData.append("Content-Disposition: form-data; name=\"model\"\r\n\r\n");
            formData.append("whisper-1");
            formData.append("\r\n--").append(boundary).append("\r\n");
            formData.append("Content-Disposition: form-data; name=\"language\"\r\n\r\n");
            formData.append("en");
            formData.append("\r\n--").append(boundary).append("--\r\n");
            
            byte[] endPart = formData.toString().getBytes();
            
            // Combine all parts
            java.io.ByteArrayOutputStream requestBody = new java.io.ByteArrayOutputStream();
            requestBody.write(filePart);
            requestBody.write(audioBytes);
            requestBody.write(endPart);
            
            String response = webClient.post()
                    .uri(WHISPER_API_URL)
                    .contentType(MediaType.parseMediaType("multipart/form-data; boundary=" + boundary))
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody.toByteArray())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // Parse JSON response to extract transcript
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> responseMap = mapper.readValue(response, Map.class);
            String transcript = (String) responseMap.get("text");
            
            if (transcript == null || transcript.isBlank()) {
                log.warn("Whisper returned empty transcript");
                return "";
            }
            
            log.info("Successfully transcribed audio file: {}", audioFilePath);
            return transcript.trim();
            
        } catch (Exception e) {
            log.error("Whisper transcription failed: {}", e.getMessage(), e);
            throw new RuntimeException("Transcription failed: " + e.getMessage(), e);
        }
    }
}
