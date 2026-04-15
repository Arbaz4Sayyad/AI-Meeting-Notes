# 🤖 AI Meeting Notes — Asynchronous AI Processing System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2+-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

> ⚡ Processes meeting audio into structured insights in under a minute using a **scalable asynchronous AI pipeline**.

---

## 🚀 Overview

**AI Meeting Notes** is a **distributed, asynchronous processing system** that converts raw meeting recordings into structured insights such as **decisions, action items, and risks**.

The system is designed to handle **high-latency AI operations efficiently** while maintaining **low API response times** and a smooth user experience.

---

## 📊 Executive Summary

| Metric             | Value                  |
| ------------------ | ---------------------- |
| Note-taking effort | ↓ ~70%                 |
| Processing latency | < 45s (15-min meeting) |
| API response time  | ~200–500ms             |
| Processing model   | Asynchronous           |

---

## 🎯 Problem Statement

Meeting data is:

* Unstructured
* Time-consuming to process
* Hard to track for decisions & accountability

---

## 💡 Solution

This system transforms meeting data into structured outputs using:

* AI-powered transcription
* Intelligent summarization
* Asynchronous event-driven processing

👉 Result: **Faster decision-making & improved execution tracking**

---

## 🏗️ High-Level Architecture

![Architecture](./screenshots/architecture.png)

---

## 🔄 Processing Flow (System Design)

1. **Upload Request** → Audio/transcript via REST API
2. **Event Trigger** → Internal async event published
3. **Transcription Service** → Whisper / Google STT
4. **AI Processing** → Gemini summarization
5. **Persistence Layer** → Stored in PostgreSQL
6. **Response Retrieval** → Client polls or fetches result

---

## 🧠 System Design Decisions

### 1. Asynchronous Processing (`@Async`)

* Prevents blocking API calls
* Handles long-running AI tasks efficiently

👉 Result: **Better UX + scalable processing**

---

### 2. Event-Driven Architecture

* Services communicate via internal events
* Decouples processing pipeline

👉 Benefit:

* Independent scaling of components
* Easier fault isolation

---

### 3. Multi-Provider AI Fallback

* Whisper + Google STT
* Gemini for summarization

👉 Benefit:

* Improved reliability
* Reduced dependency on single provider

---

### 4. PostgreSQL (Strong Consistency)

* Ensures reliable storage of structured outputs

👉 Trade-off:

* Less flexible vs NoSQL
* But guarantees ACID properties

---

## ⚙️ Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Backend  | Spring Boot (Java 17) |
| Frontend | React 18 + Vite       |
| Database | PostgreSQL            |
| Auth     | JWT + OAuth2          |
| AI       | Gemini + Whisper      |
| Infra    | Docker Compose        |

---

## ⚡ Core Capabilities

* Asynchronous AI processing pipeline
* Decision & action item extraction
* Multi-provider transcription fallback
* Secure authentication (JWT + OAuth2)
* Responsive UI with validation

---

## 📈 Performance & Scalability

* 🎧 Transcription latency: ~30–60s
* ⚡ AI summary generation: <15s
* 🚀 API response time: ~200–500ms
* 🔄 Non-blocking async pipeline

### Scaling Strategy

* Stateless backend → horizontal scaling
* Async workers → parallel processing
* Event-driven pipeline → load buffering

---

## 🛡️ Reliability & Fault Handling

* Retry mechanism for AI/API failures
* Fallback between transcription providers
* Manual transcript fallback
* Input validation & error handling

---

## ⚠️ Trade-offs

* Increased architectural complexity
* Eventual consistency in processing
* Dependency on external AI services

---

## 🧪 Testing Strategy

* Unit Testing: JUnit, Mockito
* Integration Testing: Testcontainers
* Frontend Testing: Vitest

---

## 🚀 Quick Start

```bash
git clone https://github.com/Arbaz4Sayyad/AI-Meeting-Notes.git
cd AI-Meeting-Notes

cp .env.example .env
docker-compose up -d --build
```

**Access:**

* Frontend: http://localhost:3000
* Backend: http://localhost:8080
* API Docs: http://localhost:8080/swagger-ui.html

---

## 📊 API Documentation

Interactive API documentation available at:

👉 `/swagger-ui.html`

---

## 📸 Screenshots

| Dashboard                        | Summary                                 | Transcript                              | Create Meeting                        |
| -------------------------------- | --------------------------------------- | --------------------------------------- | ------------------------------------- |
| ![](./screenshots/dashboard.png) | ![](./screenshots/generate_summary.png) | ![](./screenshots/audio_transcript.png) | ![](./screenshots/create_meeting.png) |

| Analytics                        | Summary Details                        | Landing Page                        | Auth                                |
| -------------------------------- | -------------------------------------- | ----------------------------------- | ----------------------------------- |
| ![](./screenshots/analytics.png) | ![](./screenshots/summary_details.png) | ![](./screenshots/landing_Page.png) | ![](./screenshots/google_oauth.png) |

---

## 🗺️ Future Improvements

* Vector DB + RAG for search across meetings
* Real-time transcription (WebSockets)
* Multi-model AI fallback (Gemini, GPT, Claude)
* Mobile application

---

## 📌 Key Learnings

* Designing async systems for high-latency tasks
* Handling external AI dependencies
* Building scalable event-driven pipelines

---

## 👨‍💻 Author

**Arbaz Sayyad**
Full Stack Software Engineer
Java • Spring Boot • React • Distributed Systems

* 🔗 https://www.linkedin.com/in/arbaz-sayyad/
* 💻 https://github.com/Arbaz4Sayyad

---

⭐ If you found this project useful, consider giving it a star!
