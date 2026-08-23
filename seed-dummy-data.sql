-- ============================================================================
-- Meeting AI: Complete Database Initialization & Seed Script
-- Run this in your Neon / PostgreSQL SQL Editor to create tables & sample data
-- ============================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    provider VARCHAR(50) NOT NULL DEFAULT 'local',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meetings (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_date DATE,
    start_time TIME,
    end_time TIME,
    attendees TEXT[],
    meeting_type VARCHAR(20) DEFAULT 'ONLINE',
    meeting_link VARCHAR(500),
    location VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en',
    agenda_notes TEXT,
    audio_file_url VARCHAR(500),
    transcript TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    uploaded_at TIMESTAMP WITH TIME ZONE,
    transcription_started_at TIMESTAMP WITH TIME ZONE,
    transcription_completed_at TIMESTAMP WITH TIME ZONE,
    ai_processing_started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    processing_duration_ms BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meeting_summaries (
    id BIGSERIAL PRIMARY KEY,
    meeting_id BIGINT NOT NULL UNIQUE REFERENCES meetings(id) ON DELETE CASCADE,
    summary TEXT,
    key_points JSONB,
    decisions JSONB,
    action_items JSONB,
    risks JSONB,
    next_steps JSONB,
    participants JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at);
CREATE INDEX IF NOT EXISTS idx_meeting_summaries_meeting_id ON meeting_summaries(meeting_id);

-- 2. Insert Demo User (demo@meetingai.com / password123)
-- BCrypt hashed password for "password123"
INSERT INTO users (id, name, email, password, provider, created_at)
VALUES (
    1, 
    'Arbaz Sayyad', 
    'demo@meetingai.com', 
    '$2a$10$wN1Qy2J71kE3K11/1qfKxeh5oG1.1zVq81NfQ4z8qLp3K5z/Q7R9a', 
    'local', 
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Demo Meetings
INSERT INTO meetings (
    id, user_id, title, description, meeting_date, start_time, end_time, 
    attendees, meeting_type, meeting_link, location, language, agenda_notes,
    audio_file_url, transcript, status, uploaded_at, transcription_started_at,
    transcription_completed_at, ai_processing_started_at, completed_at, processing_duration_ms, created_at
) VALUES 
(
    1, 1, 
    'Q3 Architecture & Cloud Deployment Review', 
    'Review cloud migration strategy, Neon PostgreSQL connection pooling, and Render container deployment.',
    CURRENT_DATE, '10:00:00', '10:45:00',
    ARRAY['arbaz@meetingai.com', 'sarah.chen@techcorp.io', 'marcus.vance@techcorp.io', 'elena.rostova@techcorp.io'],
    'ONLINE', 'https://meet.google.com/xyz-arch-sync', NULL, 'en',
    '1. Cloud architecture review\n2. Neon serverless DB migration\n3. Render free tier container JVM memory tuning\n4. Frontend SPA client rewrites',
    '/uploads/q3_architecture_review.mp3',
    'Arbaz: Welcome everyone. Today we need to finalize our cloud deployment strategy. Sarah, how did the Neon PostgreSQL benchmark look?
Sarah: The serverless PostgreSQL connection string works seamlessly. We verified SSL mode require and sub-30ms query latency from US East.
Marcus: What about the Spring Boot container on Render free tier?
Arbaz: We tuned the JVM parameters to -Xmx384m and -Xms128m with container support enabled. This guarantees it stays safely under the 512MB RAM cap without triggering out-of-memory errors.
Elena: On the frontend side, we added vercel.json and _redirects so React Router client-side refreshes will not 404.
Arbaz: Excellent. Let us configure the CORS origin patterns in Spring Security to allow the production Vercel domain with credentials.
Sarah: I will take the database verification task and prepare the staging credentials by Thursday.
Marcus: I will review the Docker multi-stage build logs and verify container healthchecks.',
    'COMPLETED',
    NOW() - INTERVAL '45 minutes',
    NOW() - INTERVAL '44 minutes',
    NOW() - INTERVAL '43 minutes',
    NOW() - INTERVAL '43 minutes',
    NOW() - INTERVAL '42 minutes',
    38000,
    NOW() - INTERVAL '45 minutes'
),
(
    2, 1,
    'Weekly Sprint Planning & Story Point Estimation',
    'Sprint 24 backlog grooming, priority estimation, and team capacity allocation.',
    CURRENT_DATE - INTERVAL '1 day', '14:00:00', '15:00:00',
    ARRAY['arbaz@meetingai.com', 'david.kim@techcorp.io', 'priya.sharma@techcorp.io'],
    'ONLINE', 'https://meet.google.com/spr-plan-24', NULL, 'en',
    '1. Retrospective action items\n2. Jira sprint backlog estimation\n3. WebSocket live transcription POC',
    '/uploads/sprint_planning_24.mp3',
    'Arbaz: Let us start the Sprint 24 planning. We have 38 story points committed for this iteration.
David: The highest priority item is adding WebSocket real-time progress indicators during speech transcription.
Priya: I have already stubbed out the STOMP endpoint in Spring Boot at /ws. We need frontend subscription hooks in React.
Arbaz: Great. Let us assign 5 points to the WebSocket feature and 3 points to the meeting templates library.
David: I will implement the client-side task checklist toggles with optimistic state updates.
Priya: I will write integration tests with Testcontainers to verify asynchronous event dispatching.',
    'COMPLETED',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '1 minute',
    NOW() - INTERVAL '1 day' + INTERVAL '2 minutes',
    NOW() - INTERVAL '1 day' + INTERVAL '2 minutes',
    NOW() - INTERVAL '1 day' + INTERVAL '3 minutes',
    42000,
    NOW() - INTERVAL '1 day'
),
(
    3, 1,
    'Incident Post-Mortem: DB Connection Pool Exhaustion',
    'Blameless post-mortem analysis following connection spike during batch audio processing.',
    CURRENT_DATE - INTERVAL '3 days', '11:00:00', '12:00:00',
    ARRAY['arbaz@meetingai.com', 'devops-lead@techcorp.io', 'sre-oncall@techcorp.io'],
    'OFFLINE', NULL, 'War Room B - Building 2', 'en',
    '1. Incident timeline & customer impact\n2. HikariCP connection pool settings\n3. Async worker thread pool capping\n4. Preventive remediation',
    NULL,
    'Arbaz: Thanks for joining the post-mortem. On Friday at 16:20 UTC, concurrent uploads caused HikariCP connection pool exhaustion.
SRE: The root cause was unbounded @Async thread pool execution opening database sessions faster than PostgreSQL could serve them.
DevOps: We need to set maximumPoolSize=10 in HikariCP and configure ThreadPoolTaskExecutor with a queue capacity of 50 and 4 core threads.
Arbaz: We should also add Prometheus micrometer metrics to track database pool utilization in real time.
DevOps: I will deploy the updated application.properties pool configuration today.',
    'COMPLETED',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    15000,
    NOW() - INTERVAL '3 days'
),
(
    4, 1,
    'Product Discovery: Real-Time Audio Streaming',
    'Exploring WebRTC vs WebSocket chunk streaming for live meeting transcription.',
    CURRENT_DATE - INTERVAL '5 days', '16:00:00', '16:30:00',
    ARRAY['arbaz@meetingai.com', 'product-lead@techcorp.io'],
    'ONLINE', 'https://meet.google.com/webrtc-discovery', NULL, 'en',
    '1. User feedback on 45s latency\n2. Chunked audio streaming architecture\n3. Whisper live streaming API trade-offs',
    '/uploads/audio_streaming_discovery.mp3',
    'Product Lead: Users love the structured action items, but for 60-minute meetings, they want live transcription as people speak.
Arbaz: We can stream 5-second PCM audio chunks over WebSocket to a background buffer service.
Product Lead: What are the cost trade-offs?
Arbaz: Gemini 2.5 Flash token costs remain minimal, and streaming chunks incrementally will lower perceived latency to under 3 seconds.',
    'COMPLETED',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days',
    28000,
    NOW() - INTERVAL '5 days'
),
(
    5, 1,
    '1-on-1 Engineering Growth & Q4 Roadmap',
    'Quarterly career discussion, mentorship goals, and distributed systems architecture focus.',
    CURRENT_DATE + INTERVAL '1 day', '15:00:00', '15:45:00',
    ARRAY['arbaz@meetingai.com', 'engineering-director@techcorp.io'],
    'ONLINE', 'https://meet.google.com/1on1-growth-sync', NULL, 'en',
    '1. System design milestones accomplished\n2. Leadership & technical mentorship\n3. Q4 engineering goals',
    NULL,
    'Agenda items prepared: Review event-driven processing implementation, Spring Boot reactive patterns, and cross-team developer tooling impact.',
    'CREATED',
    NULL, NULL, NULL, NULL, NULL, NULL,
    NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Structured AI Meeting Summaries
INSERT INTO meeting_summaries (
    id, meeting_id, summary, key_points, decisions, action_items, risks, next_steps, participants, created_at
) VALUES
(
    1, 1,
    'The engineering team conducted a comprehensive architecture review to finalize deployment across free cloud infrastructure. The database layer is confirmed on serverless PostgreSQL (Neon) with sub-30ms latency. The Spring Boot backend is tuned with 384MB maximum JVM heap to operate reliably within 512MB RAM containers on Render. Frontend SPA routing has been secured against 404s via Vercel rewrites.',
    '[
        "Neon Serverless PostgreSQL connection benchmark passed with sub-30ms latency",
        "Spring Boot JVM memory configured with -Xmx384m and -Xms128m for container stability",
        "React SPA client-side routing secured with vercel.json and public/_redirects",
        "CORS policy updated to allow production frontend origins with credentials"
    ]'::jsonb,
    '[
        "Adopt Neon serverless PostgreSQL for primary persistence layer",
        "Deploy backend container to Render with container-aware JVM flags",
        "Deploy Vite React SPA to Vercel global edge network"
    ]'::jsonb,
    '[
        "Verify Neon database JDBC connection string in staging - Sarah Chen - High - Thursday",
        "Review Docker multi-stage build logs and verify healthchecks - Marcus Vance - Medium - Friday",
        "Configure production CORS allowed origin patterns in SecurityConfig - Arbaz Sayyad - High - Tomorrow"
    ]'::jsonb,
    '[
        "Free tier spin-down on Render requires keepalive ping every 10 minutes to prevent cold starts"
    ]'::jsonb,
    '[
        "Complete end-to-end integration test of file upload pipeline in production environment",
        "Connect UptimeRobot or cron-job.org monitor to keep backend warm"
    ]'::jsonb,
    '["Arbaz Sayyad", "Sarah Chen", "Marcus Vance", "Elena Rostova"]'::jsonb,
    NOW() - INTERVAL '42 minutes'
),
(
    2, 2,
    'Sprint 24 planning session finalized with 38 story points committed. Priority is focused on real-time WebSocket progress updates during audio transcription and expanding the reusable meeting templates library.',
    '[
        "38 story points committed across core engineering team",
        "WebSocket STOMP endpoint stubbed at /ws for live transcription progress",
        "Meeting template library expanded with engineering and incident post-mortem formats",
        "Client task checklists upgraded with optimistic state synchronization"
    ]'::jsonb,
    '[
        "Allocate 5 story points to WebSocket live transcription POC",
        "Allocate 3 story points to meeting templates library",
        "Use Testcontainers for automated async event integration testing"
    ]'::jsonb,
    '[
        "Implement client-side task checklist toggles with optimistic state updates - David Kim - High - Wednesday",
        "Write integration tests with Testcontainers for async event dispatching - Priya Sharma - Medium - Thursday",
        "Wire frontend STOMP client to /ws endpoint - Arbaz Sayyad - High - Friday"
    ]'::jsonb,
    '[
        "WebSocket fallback to polling required if client is behind restrictive corporate proxy"
    ]'::jsonb,
    '[
        "Review PR for optimistic task updates on Wednesday standup",
        "Benchmark Testcontainers execution time in GitHub Actions CI pipeline"
    ]'::jsonb,
    '["Arbaz Sayyad", "David Kim", "Priya Sharma"]'::jsonb,
    NOW() - INTERVAL '1 day'
),
(
    3, 3,
    'Blameless incident post-mortem analyzing the connection pool exhaustion event during concurrent audio uploads. Root cause identified as unbounded worker thread execution. Remediation involves capping HikariCP and thread pool capacity.',
    '[
        "Unbounded @Async thread pool spawned excessive concurrent database connections",
        "HikariCP pool timed out under sudden spike of 20 concurrent audio uploads",
        "Zero customer data loss occurred due to event retry mechanism"
    ]'::jsonb,
    '[
        "Cap HikariCP maximumPoolSize to 10 connections",
        "Configure ThreadPoolTaskExecutor with core size 4, max size 8, and queue capacity 50",
        "Add Prometheus connection pool saturation metrics"
    ]'::jsonb,
    '[
        "Deploy updated HikariCP pool configuration to production - DevOps Lead - High - Today",
        "Configure Micrometer metrics for database pool saturation alerts - SRE Oncall - Medium - Tomorrow",
        "Document async thread pool sizing formula in engineering wiki - Arbaz Sayyad - Low - Friday"
    ]'::jsonb,
    '[
        "Large backlog of audio files will queue gracefully but increase processing latency up to 2 minutes"
    ]'::jsonb,
    '[
        "Perform synthetic load test with 50 concurrent file uploads after config deployment",
        "Set up PagerDuty alert on connection pool wait duration > 5000ms"
    ]'::jsonb,
    '["Arbaz Sayyad", "DevOps Lead", "SRE Oncall"]'::jsonb,
    NOW() - INTERVAL '3 days'
),
(
    4, 4,
    'Exploratory product discovery on real-time audio chunk streaming. Agreed on streaming 5-second PCM chunks over WebSocket to reduce perceived transcription latency from 45 seconds to under 3 seconds.',
    '[
        "Chunked 5-second audio buffers allow continuous transcription during ongoing meetings",
        "Gemini 2.5 Flash token efficiency makes incremental prompts cost-effective",
        "Perceived latency drops from 45s down to < 3s"
    ]'::jsonb,
    '[
        "Build prototype with WebSocket chunk streaming for Q4 roadmap",
        "Retain asynchronous full-audio upload for legacy recordings and offline files"
    ]'::jsonb,
    '[
        "Draft WebSocket audio streaming technical specification - Arbaz Sayyad - High - Next Week",
        "Conduct user interviews on real-time transcript editing UI - Product Lead - Medium - In 2 Weeks"
    ]'::jsonb,
    '[
        "Network packet loss over unstable cellular connections could cause dropped speech segments"
    ]'::jsonb,
    '[
        "Review prototype architecture with principal architect in October"
    ]'::jsonb,
    '["Arbaz Sayyad", "Product Lead"]'::jsonb,
    NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Reset primary key sequence counters
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('meetings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM meetings));
SELECT setval('meeting_summaries_id_seq', (SELECT COALESCE(MAX(id), 1) FROM meeting_summaries));
