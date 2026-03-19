-- Meeting AI Database Schema
-- PostgreSQL - JPA/Hibernate will create tables with ddl-auto=update
-- This file documents the schema for reference

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meetings (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_date DATE,
    start_time TIME,
    end_time TIME,
    attendees TEXT[], -- Array of email addresses
    meeting_type VARCHAR(20) DEFAULT 'ONLINE', -- ONLINE or OFFLINE
    meeting_link VARCHAR(500),
    location VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en',
    agenda_notes TEXT,
    audio_file_url VARCHAR(500),
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL REFERENCES users(id)
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
    participants JSONB
);

CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_created_at ON meetings(created_at);
CREATE INDEX idx_meeting_summaries_meeting_id ON meeting_summaries(meeting_id);
