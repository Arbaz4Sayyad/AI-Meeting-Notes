package com.app.meetingai.ai;

/**
 * Interface for AI transcription (e.g. OpenAI Whisper or Google Cloud Speech-to-Text).
 */
public interface AiTranscriptionService {

    String transcribe(String audioFilePath);
}
