package com.app.meetingai.ai;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Google Cloud Speech-to-Text implementation for audio transcription.
 * Requires GCP_PROJECT_ID and valid credentials (GCP_CREDENTIALS_PATH or GOOGLE_APPLICATION_CREDENTIALS).
 */
@Service
@ConditionalOnExpression("'${app.google.cloud.project-id:}'.length() > 0")
@ConditionalOnMissingBean(TranscriptionService.class)
public class GoogleSpeechToTextService implements TranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(GoogleSpeechToTextService.class);

    public GoogleSpeechToTextService(@Value("${app.google.cloud.project-id}") String projectId) {
        log.info("Google Speech-to-Text enabled for project: {}", projectId);
    }

    @Override
    public String transcribe(String audioFilePath) {
        return transcribeFromFile(Path.of(audioFilePath));
    }

    /**
     * Transcribe from file path with automatic encoding detection.
     * Supports MP3, WAV, M4A.
     */
    public String transcribeFromFile(Path audioPath) {
        String fileName = audioPath.getFileName().toString();
        int dot = fileName.lastIndexOf('.');
        String extension = dot > 0 ? fileName.substring(dot + 1).toLowerCase() : "";
        RecognitionConfig.AudioEncoding encoding;
        if ("mp3".equals(extension) || "m4a".equals(extension)) {
            encoding = RecognitionConfig.AudioEncoding.MP3;
        } else {
            encoding = RecognitionConfig.AudioEncoding.LINEAR16;
        }

        try (SpeechClient speechClient = SpeechClient.create()) {
            byte[] audioBytes = Files.readAllBytes(audioPath);
            ByteString audio = ByteString.copyFrom(audioBytes);

            var configBuilder = RecognitionConfig.newBuilder()
                    .setEncoding(encoding)
                    .setLanguageCode("en-US")
                    .setEnableAutomaticPunctuation(true)
                    .setModel("latest_long");

            if (encoding == RecognitionConfig.AudioEncoding.LINEAR16) {
                configBuilder.setSampleRateHertz(16000);
            }

            RecognitionConfig config = configBuilder.build();
            RecognitionAudio recognitionAudio = RecognitionAudio.newBuilder().setContent(audio).build();
            RecognizeResponse response = speechClient.recognize(config, recognitionAudio);

            return response.getResultsList().stream()
                    .map(SpeechRecognitionResult::getAlternativesList)
                    .flatMap(List::stream)
                    .map(SpeechRecognitionAlternative::getTranscript)
                    .collect(Collectors.joining(" "));
        } catch (Exception e) {
            log.error("Speech-to-Text failed: {}", e.getMessage());
            throw new RuntimeException("Transcription failed: " + e.getMessage(), e);
        }
    }
}
