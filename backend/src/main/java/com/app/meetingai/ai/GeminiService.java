package com.app.meetingai.ai;

import com.app.meetingai.model.MeetingSummary;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service to generate meeting summaries using Google Gemini API.
 */
@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String summaryModel;

    public GeminiService(
            WebClient.Builder webClientBuilder,
            ObjectMapper objectMapper,
            @Value("${app.gemini.api-key}") String apiKey,
            @Value("${app.gemini.model.summary:gemini-pro}") String summaryModel) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.summaryModel = summaryModel;
        
        // Debug logging
        log.info("GeminiService initialized - API Key present: {}, Key length: {}, Model: {}", 
                apiKey != null && !apiKey.isBlank(), 
                apiKey != null ? apiKey.length() : 0, 
                summaryModel);
    }

    public MeetingSummary generateSummary(Long meetingId, String transcript) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new com.app.meetingai.utils.ApiException("GEMINI_API_KEY is not configured", org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE);
        }

        String prompt = buildPrompt(transcript);
        String url = String.format(GEMINI_API_URL, summaryModel, apiKey);
        
        log.info("Gemini API call - Model: {}, URL: {}", summaryModel, url);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "maxOutputTokens", 4096,
                        "responseMimeType", "application/json"
                )
        );

        try {
            log.info("Calling Gemini API with model: {}", summaryModel);
            String response = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseResponse(meetingId, response);
        } catch (Exception e) {
            log.error("Gemini API error: {}", e.getMessage(), e);
            String errorMessage = "Failed to generate summary";
            
            if (e.getMessage().contains("404")) {
                errorMessage = "Gemini model not found or API key invalid. Please check GEMINI_API_KEY configuration.";
            } else if (e.getMessage().contains("403") || e.getMessage().contains("401")) {
                errorMessage = "Gemini API authentication failed. Please check your API key.";
            } else if (e.getMessage().contains("429")) {
                errorMessage = "Gemini API rate limit exceeded. Please try again later.";
            } else if (e.getMessage().contains("500")) {
                errorMessage = "Gemini API server error. Please try again later.";
            }
            
            // Fallback: Create a basic summary without AI
            log.warn("Falling back to basic summary generation due to Gemini API failure");
            return createFallbackSummary(meetingId, transcript);
        }
    }

    private String buildPrompt(String transcript) {
        return """
                You are an advanced AI Meeting Assistant used in enterprise applications.

                Your task is to analyze the meeting transcript and generate a structured, professional output.

                IMPORTANT RULES:
                - Do NOT be vague
                - Do NOT say "discussion happened"
                - Extract real meaning from conversation
                - Be specific, actionable, and concise
                - Use professional language

                OUTPUT FORMAT:

                1. MEETING SUMMARY (3-5 sentences)
                - Clearly explain what the meeting was about
                - Mention decisions taken
                - Mention important context

                2. KEY DISCUSSION POINTS
                - Bullet points
                - Capture actual topics discussed
                - Include technical details if present

                3. DECISIONS MADE
                - List all confirmed decisions
                - Be precise

                4. ACTION ITEMS (CRITICAL)
                - Each action must have:
                  - Task (what needs to be done)
                  - Owner (who is responsible - extract from context or "Unassigned")
                  - Priority (High/Medium/Low based on urgency and importance)
                  - Due Date (if mentioned, otherwise "Not specified")
                - Format: "Task - Owner - Priority - Due Date"
                - Look for phrases like: "I will", "Let's", "Can you", "We need to", "Assign to", "Follow up"

                5. RISKS / BLOCKERS (if any)
                - Mention issues, limitations, or concerns
                - Look for obstacles, challenges, dependencies

                6. NEXT STEPS
                - What should happen after this meeting
                - Future meetings, follow-ups, deliverables

                7. PARTICIPANTS & ROLES
                - List key participants mentioned
                - Their roles or responsibilities if evident

                Return ONLY valid JSON with these exact keys:
                {
                  "summary": "MEETING SUMMARY section content",
                  "keyPoints": ["KEY DISCUSSION POINTS as array items"],
                  "decisions": ["DECISIONS MADE as array items"],
                  "actionItems": ["ACTION ITEMS as formatted array items"],
                  "risks": ["RISKS/BLOCKERS as array items (empty array if none)"],
                  "nextSteps": ["NEXT STEPS as array items"],
                  "participants": ["PARTICIPANTS as array items"]
                }

                ---
                
                TRANSCRIPT:
                %s
                """.formatted(transcript);
    }

    private MeetingSummary parseResponse(Long meetingId, String responseBody) {
        MeetingSummary summary = new MeetingSummary();
        summary.setMeetingId(meetingId);

        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isEmpty()) {
                throw new RuntimeException("No response from Gemini");
            }
            String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            // Remove markdown code block if present
            text = text.replaceAll("^```json\\s*|\\s*```$", "").trim();
            JsonNode data = objectMapper.readTree(text);

            summary.setSummary(data.path("summary").asText(""));
            summary.setKeyPoints(toList(data.path("keyPoints")));
            summary.setDecisions(toList(data.path("decisions")));
            summary.setActionItems(toList(data.path("actionItems")));
            summary.setRisks(toList(data.path("risks")));
            summary.setNextSteps(toList(data.path("nextSteps")));
            summary.setParticipants(toList(data.path("participants")));
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse AI response", e);
        }
        return summary;
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node.isArray()) {
            node.forEach(n -> list.add(n.asText()));
        }
        return list;
    }
    
    private MeetingSummary createFallbackSummary(Long meetingId, String transcript) {
        log.info("Creating fallback summary for meeting ID: {}", meetingId);
        
        MeetingSummary summary = new MeetingSummary();
        summary.setMeetingId(meetingId);
        
        // Basic summary generation without AI
        String[] sentences = transcript.split("\\. ");
        String summaryText = sentences.length > 3 
                ? String.join(". ", java.util.Arrays.copyOf(sentences, 3)) + "."
                : transcript;
        
        summary.setSummary(summaryText + " (Generated without AI due to API limitations)");
        summary.setKeyPoints(java.util.Arrays.asList("Meeting discussion took place", "Participants exchanged information"));
        summary.setDecisions(new java.util.ArrayList<>());
        summary.setActionItems(new java.util.ArrayList<>());
        summary.setRisks(new java.util.ArrayList<>());
        summary.setNextSteps(new java.util.ArrayList<>());
        
        return summary;
    }
}
