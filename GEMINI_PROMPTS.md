# Gemini Prompts for Meeting AI

## Summary Generation Prompt

The application sends the transcript to Gemini with this structure:

```
Analyze the following meeting transcript and return a JSON object with exactly these keys:
- "summary": A concise meeting summary (2-3 paragraphs)
- "keyPoints": Array of key discussion points (strings)
- "decisions": Array of decisions made (strings)
- "actionItems": Array of action items with responsible person if mentioned, e.g. "Task - Assigned to: John" (strings)
- "followUpTasks": Array of follow-up tasks (strings)

Return ONLY valid JSON, no markdown or extra text.

Transcript:
{transcript}
```

## Configuration

- **Model**: `gemini-1.5-pro` (default for summaries)
- **Temperature**: 0.3
- **Max tokens**: 4096
- **Response format**: JSON (via `responseMimeType: "application/json"`)

## Fast Model

For faster processing, you can switch to `gemini-1.5-flash` in `application.properties`:

```properties
app.gemini.model.summary=gemini-1.5-flash
```
