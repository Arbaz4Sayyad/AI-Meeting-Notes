# Senior Backend Engineer Interview Preparation (2+ YOE)
## Project: AI Meeting Notes Generator

---

### **Section 1: System Design & Architecture**

#### **Q1. Walk me through the high-level architecture of your AI Meeting Notes system.**
**Answer:** The system is built on a **Modular Monolith** architecture using **Spring Boot 3**. It uses an **Asynchronous Event-Driven** approach to handle long-running AI tasks. When a user uploads audio, the REST controller saves the file to **GCS/Local Storage** and publishes a `MeetingUploadedEvent` via Spring’s `ApplicationEventPublisher`. 
Dedicated `@Async` listeners then pick up the task to perform:
1. **Transcription** (Google Cloud Speech-to-Text).
2. **Summarization** (Google Gemini via WebClient).
3. **Notification** (WebSockets/Email).
By returning a `202 Accepted` immediately, we decouple the heavy processing from the user’s request-response cycle, ensuring high availability.

#### **Q2. Why did you choose a Monolith instead of Microservices?**
**Answer:** At this stage (2+ YOE perspective), a Monolith is faster to develop, easier to deploy, and avoids the complexity of distributed transactions and service discovery. Since the team is small, the overhead of managing multiple repositories and CI/CD pipelines wouldn't justify the benefits. However, I’ve maintained **Logical Separation** (Package-by-Feature); for example, the AI processing logic is isolated from user management. If the AI component becomes a bottleneck, we can extract it into a separate microservice and replace the internal event publisher with **Kafka** with minimal friction.

#### **Q3. How would you scale this system to handle 10x the current traffic (e.g., 10k concurrent uploads)?**
**Answer:** I would implement a three-tier scaling strategy:
1. **Ingestion Layer:** Move audio uploads directly to **AWS S3/GCS using Pre-signed URLs**. This offloads the heavy byte-streaming from the Spring Boot JVM to the cloud provider.
2. **Processing Layer:** Replace the internal `@Async` thread pool with a distributed message queue like **Kafka**. We’d have multiple "Worker" instances consuming from a `meeting-processing` topic, allowing us to scale the compute-heavy workers independently of the web server.
3. **Database Layer:** Implement **Read Replicas** for PostgreSQL to handle dashboard queries and use **Redis** for caching frequently accessed meeting summaries.

---

### **Section 2: REST API & Communication**

#### **Q4. How do you handle large file uploads in Spring Boot without causing OutOfMemory (OOM) errors?**
**Answer:** I avoid loading the entire file into memory (e.g., using `byte[]`). Instead, I use **MultipartFile's input stream** and pipe it directly to the storage destination (disk or cloud) using `Files.copy()` or `BufferedOutputStream`. I also configure the `spring.servlet.multipart.max-file-size` to 50MB and set a `max-request-size` to prevent malicious large payloads from starving the server's heap.

#### **Q5. The summary generation takes 30 seconds. How do you keep the UI updated without making the user refresh?**
**Answer:** I implemented a **Status Polling** mechanism as the MVP, but the "Senior" approach I’ve integrated is **WebSockets (STOMP)**. When the backend completes a summary, it pushes a `MeetingStatusChanged` message to a user-specific topic (e.g., `/topic/user/{userId}`). The frontend listens to this and updates the UI in real-time. If the socket disconnects, the UI falls back to a GET request on component mount to sync the state.

#### **Q6. How do you design your APIs to be idempotent?**
**Answer:** For meeting creation, I use a **Client-Generated Correlation ID (X-Request-ID)**. If a client retries a request due to a network timeout, the backend checks if a meeting with that ID already exists in the database. If it does, we return the existing record with a `200 OK` (or `409 Conflict` depending on business logic) instead of creating a duplicate and triggering the AI pipeline twice, which saves costs.

---

### **Section 3: Database Design (PostgreSQL)**

#### **Q7. Why did you use PostgreSQL and how do you store the AI-generated "Action Items"?**
**Answer:** PostgreSQL is ideal because it offers **ACID compliance** for user data and excellent support for **JSONB** for unstructured AI data. I store "Action Items" and "Key Points" in a `meeting_summaries` table as JSONB. This allows me to query specific items inside the JSON (e.g., finding all meetings where "Client Approval" is an action item) using GIN indexes, without the overhead of creating complex relational mapping for highly dynamic AI outputs.

#### **Q8. How do you handle the "N+1 Problem" when fetching a list of meetings with their summaries?**
**Answer:** I use **JPA Entity Graphs** or **Join Fetch** in the repository layer. Instead of fetching the meeting and then firing a separate query for each summary, I perform a single SQL `JOIN`. For the dashboard, I also use **Projections (DTOs)** to select only the necessary columns (`id`, `title`, `status`) rather than fetching the entire `transcript` (which could be several MBs), significantly reducing memory and network overhead.

#### **Q9. How do you optimize a query searching for meetings by date range and status for a specific user?**
**Answer:** I would create a **Composite Index** on `(user_id, created_at, status)`. The order matters: `user_id` is first for high cardinality, `created_at` for the range scan, and `status` to filter the results. This allows PostgreSQL to perform an "Index Only Scan" in many cases, keeping the query execution time under 10ms even with millions of rows.

---

### **Section 4: Async Processing & Concurrency**

#### **Q10. What are the risks of using Spring’s `@Async` and how do you mitigate them?**
**Answer:** The primary risk is **Task Loss**. Since `@Async` uses an in-memory queue, if the server restarts, all pending tasks are lost. I mitigate this by maintaining a **State Machine** in the DB. When an upload starts, the status is `CREATED`. Only after successful persistence do we trigger the `@Async` task. I also have a **"Ghost Task" Recovery Job** (using `@Scheduled`) that runs every hour to find meetings stuck in `PROCESSING` and re-queues them.

#### **Q11. How do you handle "Backpressure" if the AI service is slower than the incoming uploads?**
**Answer:** I configure a custom `ThreadPoolTaskExecutor` with a **Bounded Queue** and a **Discard Policy** (or `CallerRunsPolicy`). If the queue fills up, we return a `429 Too Many Requests` or `503 Service Unavailable` to the user. This protects the JVM from crashing due to memory exhaustion from an infinite task queue and forces the client to implement retries.

#### **Q12. What is the difference between "Optimistic" and "Pesticmatic" locking, and where would you use them here?**
**Answer:** I use **Optimistic Locking** (`@Version` in JPA) for meeting metadata. If two users edit the meeting title at once, the first one wins and the second gets an `ObjectOptimisticLockingFailureException`. **Pessimistic Locking** is overkill here and would kill performance. However, for "Job Processing", I use a `select for update` (Pessimistic) on the `failed_jobs` table when a background worker picks up a retry, ensuring no two workers process the same failure simultaneously.

---

### **Section 5: Caching & Redis**

#### **Q13. Where is Redis most useful in this project?**
**Answer:** Two main areas:
1. **API Rate Limiting:** Storing the `Bucket4j` tokens. Using Redis ensures that if we have 3 backend instances, they all share the same rate limit state for a user.
2. **Result Caching:** Meeting summaries are "Read-Heavy". Once generated, they never change. I cache the `MeetingSummaryDTO` in Redis with the `meetingId` as the key. This reduces DB load and cuts response time for the dashboard from ~200ms to ~10ms.

#### **Q14. How do you handle Cache Invalidation?**
**Answer:** Since summaries are immutable unless a user "re-generates" them, I use a **Write-Through** or **Manual Eviction** strategy. When the `reprocessMeeting()` service is called, the first thing it does is call `@CacheEvict(key = "#meetingId")`. This ensures the stale summary is removed before the new AI processing starts.

---

### **Section 6: AI Integration & Error Handling**

#### **Q15. How do you handle 429 (Rate Limit) errors from the Google Gemini API?**
**Answer:** I use the **Circuit Breaker pattern** (via Resilience4j). If the AI service returns too many 429s, the circuit opens, and we immediately fail subsequent requests with a "Service Busy" message instead of wasting resources. For transient 5xx errors, I implemented **Exponential Backoff** retries (e.g., 2s, 4s, 8s delay) to give the AI service time to recover.

#### **Q16. How do you process a 2-hour long meeting transcript that exceeds the LLM's token limit?**
**Answer:** I use a **Map-Reduce** approach. I chunk the transcript into 15-minute segments, generate a "Mini-Summary" for each chunk in parallel, and then feed those mini-summaries into a final "Master Summary" prompt. This preserves the context of the entire meeting while staying within the model's window.

#### **Q17. How do you handle "Hallucinations" (AI making up facts)?**
**Answer:** From a backend perspective, I use **Strict Prompt Engineering** (setting `temperature=0` for deterministic output) and **Schema Validation**. I force the LLM to return a structured JSON (using Gemini's `response_mime_type: application/json`). I then validate this JSON against a Java POJO. If the JSON is malformed or missing key fields, the backend rejects the output and triggers a retry with a "Refining" prompt.

---

### **Section 7: Security & Security**

#### **Q18. How do you secure the JWT and handle token revocation?**
**Answer:** I store the JWT in an **HttpOnly, Secure, SameSite=Strict Cookie** to prevent XSS attacks. Since JWT is stateless, "Logout" is tricky. I implement a **Blacklist strategy** in Redis. When a user logs out, their token is stored in Redis with a TTL equal to the token's remaining life. Every request checks this blacklist during the `OncePerRequestFilter` execution.

#### **Q19. How do you ensure User A cannot see User B's meeting by just guessing the ID?**
**Answer:** I implement **Resource-Level Authorization**. In the service layer, every query is structured as `repo.findByIdAndUserId(meetingId, currentUserId)`. Even if an attacker knows a valid `meetingId`, the query will return `null` if they are not the owner. I also use **UUIDs** (or HashIDs) for public-facing URLs instead of sequential `Long` IDs to prevent ID enumeration attacks.

#### **Q20. What is CSRF and do you need to worry about it in this project?**
**Answer:** Since I use **Stateless JWTs** and have disabled Sessions, standard CSRF isn't a direct threat *if* I don't use Cookies. However, because I use Cookies for JWT storage, I **must enable CSRF protection**. I use Spring Security's `CookieCsrfTokenRepository` to require a `X-XSRF-TOKEN` header on all mutating requests (POST/PUT/DELETE), which the frontend reads from a cookie that is NOT HttpOnly.

---

### **Section 8: Performance & Monitoring**

#### **Q21. How do you find the bottleneck in a slow API?**
**Answer:** I use **Distributed Tracing** with **Micrometer Tracing** (formerly Sleuth). I inject a `traceId` into the logs. I can then use **Zipkin** or **Jaeger** to see a waterfall diagram of the request: how long was spent in the controller, how long in the DB, and how long waiting for the AI API. Usually, the bottleneck is either an unindexed query or a slow external API call.

#### **Q22. What metrics would you monitor in production for this specific app?**
**Answer:** 
1. **AI Failure Rate:** % of jobs that end in `FAILED` status.
2. **Thread Pool Saturation:** Queue size of the `aiProcessingExecutor`.
3. **P99 Latency of Transcription:** To track if the Google Cloud STT is degrading.
4. **DB Connection Pool:** To ensure we aren't leaking connections during long async tasks.

---

### **Section 9: Testing & CI/CD**

#### **Q23. How do you test the AI integration without spending money on API calls?**
**Answer:** I use the **Adapter Pattern**. I have an `AIService` interface. For unit tests, I use **Mockito** to mock the interface. For integration tests, I use **WireMock** to simulate the Gemini HTTP response. This allows me to test how my code handles timeouts, malformed JSON, and rate limits without ever hitting the real AI endpoint.

#### **Q24. How do you ensure database migrations are safe?**
**Answer:** I use **Flyway**. Migrations are versioned SQL scripts. In CI/CD, we run a "Dry Run" against a staging DB. I follow the **"Expand and Contract"** pattern for breaking changes: first, add the new column, deploy the code that supports both, then in a later release, remove the old column. This allows for zero-downtime deployments.

---

### **Section 10: Real-World Scenarios**

#### **Q25. Tell me about a difficult bug you solved in this project.**
**Answer:** I encountered a **Database Connection Leak**. During heavy AI processing, the `@Async` tasks were holding onto DB connections while waiting for the Gemini API response (which took 20s). This exhausted the `HikariCP` pool, and the main web server crashed. 
**Solution:** I refactored the code to use **Fine-Grained Transactions**. Instead of marking the whole `@Async` method as `@Transactional`, I only used transactions for the short "Save" operations and made the AI API call *outside* the transaction scope. This freed up the DB connection to the pool while the worker was waiting for the network response.

#### **Q26. If the AI summarization logic changes, how do you re-process 1,000 old meetings?**
**Answer:** I built a **Migration Utility** (Batch Job). It’s a specialized service that iterates through the `meetings` table in chunks (to avoid OOM), checks for a specific "Prompt Version" in the metadata, and triggers the `reprocessMeetingAsync()` method for each. I would run this during low-traffic hours and monitor the AI API quotas to ensure I don't get throttled.

#### **Q27. How do you handle "Zombie" files (audio files uploaded but DB entry failed)?**
**Answer:** I use a **S3/GCS Lifecycle Policy** or a custom **Cleanup Job**. If I use local storage, a cron job runs weekly to compare files in the `uploads` folder with `audio_file_url` entries in the DB. Any file older than 24 hours without a DB reference is deleted to save space.

#### **Q28. Why use Java 17/21 features for this backend?**
**Answer:** Java 17/21 provides **Records** (perfect for DTOs and AI JSON responses) and **Text Blocks** (which make writing long AI prompts in-code much cleaner). If using Java 21, I’d leverage **Virtual Threads (Project Loom)** for the AI API calls. Instead of a fixed thread pool, Virtual Threads would allow us to handle thousands of concurrent AI waits with almost zero memory overhead.

#### **Q29. How do you handle "Partial Completion"? (e.g., Transcription succeeded but Summary failed)**
**Answer:** The state machine handles this. We have statuses like `TRANSCRIBED` and `SUMMARIZED`. If it fails at the summary stage, the meeting stays at `TRANSCRIBED`. When the user hits "Retry", the system checks the current status and skips the (expensive) transcription step, jumping directly to the AI summary.

#### **Q30. What’s the most important lesson you learned building this?**
**Answer:** **Design for Failure.** In an AI-driven app, the "Happy Path" is rare. External APIs will fail, audio quality will be bad, and LLMs will return garbage. Building a robust **Retry & Error Tracking** system (using the `failed_jobs` table) was more important than the actual AI logic itself. It’s what makes the app feel "Production Grade" rather than just a hobby project.

---

### **Section 11: Practical Experience — Code-Backed Answers**

#### **Q31. What is the heaviest API you built — how many requests did it handle per day?**
**Answer:** The heaviest endpoint in this system is `POST /api/meetings/upload`. It's a multipart form that accepts an audio file (up to 50MB), meeting metadata — title, attendees, agenda, language, timestamps — and optionally a pre-typed transcript. It is heavy in two ways: **payload size** and **computational cost**.

On the payload side, I configured Spring's multipart handling to stream the incoming bytes directly to disk rather than buffering the entire file in the JVM heap, keeping memory usage flat regardless of file size.

On the compute side, a single upload triggers a full async pipeline: the file is saved, a `Spring ApplicationEvent` is fired, a dedicated `transcriptionExecutor` thread pool picks it up, calls **Google Cloud Speech-to-Text**, and then fires a second event that routes to an `aiProcessingExecutor` pool which calls **Gemini** for summarization.

The API itself responds immediately with `200 OK` — the user is not blocked waiting for any of that. Because of this async design, the endpoint can handle a large number of concurrent uploads while staying responsive. The thread pools are configured with a `QueueCapacity` of 100, meaning up to 100 processing jobs can be queued behind the active threads before backpressure kicks in. A **Bucket4j** rate limiter caps AI-heavy requests at **5 per minute per user**, protecting both the backend thread pools and the external AI API quotas.

**Code references:** `AsyncConfig.java` (thread pool sizes: corePool=2, maxPool=5, queue=100), `MeetingController.java` (`/upload` endpoint), `MeetingService.java` (event publish after file save), `RateLimiterService.java` (5 req/min per user).

---

#### **Q32. Before your DB optimisations, what were the slow query times in your logs? After?**
**Answer:** The key performance concern was queries that filter meetings by user. Without indexes, any query filtering by `user_id` is a full table scan on the `meetings` table — cost grows linearly with data.

I identified two specific patterns that would degrade at scale:
1. **Dashboard load** — `findByUserIdOrderByCreatedAtDesc` runs on every page load for every authenticated user.
2. **Search with date range** — `searchByUserIdAndTitleAndDateRange` does a `LOWER(title) LIKE` search plus an `Instant` range filter — two unindexed conditions on a hot table.

My DB optimisations were:
- `CREATE INDEX idx_meetings_user_id ON meetings(user_id)` — turns the dashboard query from an O(n) table scan to an index seek. On a 10k-row table this difference is roughly **~200ms → ~2ms**.
- `CREATE INDEX idx_meetings_created_at ON meetings(created_at)` — accelerates the date-range filtering in the search query.
- `CREATE INDEX idx_meeting_summaries_meeting_id ON meeting_summaries(meeting_id)` — the `convertToDto` method calls `summaryRepository.findByMeetingId()` for every meeting in a list, so this index prevents N+1-style scan overhead per list item.

I also applied `@Transactional(readOnly = true)` on all read methods, which tells the JPA provider and PostgreSQL driver to skip dirty-checking and optimise for read-only access.

**Known follow-up:** `convertToDto` still fires a `summaryRepository.findByMeetingId()` per meeting inside a list — a classic N+1 problem. The fix is to batch-load summaries for all meeting IDs in a single query.

**Code references:** `database-schema.sql` (3 indexes, lines 62–64), `MeetingRepository.java` (LIKE + date-range JPQL), `MeetingService.java` (`@Transactional(readOnly = true)` on read methods).

---

#### **Q33. Did any of your Kafka consumers ever fall behind? What was the lag, and what did you do?**
**Answer:** This project deliberately does **not** use Kafka — and that was the right trade-off. I used **Spring Application Events with `@Async`** as the messaging layer. For a single-instance backend where throughput is naturally bounded by external AI API rate limits, running a Kafka cluster would add operational overhead without adding real value.

The `@Async` executor queues are effectively my "consumer lag" equivalent. Each thread pool has a `QueueCapacity` of 100. If AI processing falls behind — for example, if Gemini latency spikes — jobs pile up in that in-memory queue. I handle this with:

1. **RetryScheduler** — a `@Scheduled` job that runs every 60 seconds, queries a `failed_jobs` table, and re-publishes events for any jobs that failed. It implements backoff: first retry at 5 min, second at 10 min, gives up after 3 attempts.
2. **Meeting status tracking** — every meeting has a `status` field (`CREATED` → `TRANSCRIBING` → `TRANSCRIBED` → `PROCESSING_AI` → `COMPLETED` / `FAILED`) with timestamps at each transition. Jobs stuck in `PROCESSING_AI` for more than X minutes are my observable "consumer lag" metric.
3. **Swap-friendly design** — `TranscriptionService` and `AIProcessingService` are `@EventListener`s. If traffic scaled past what `@Async` can handle, I'd replace the `eventPublisher.publishEvent()` calls with a Kafka producer and add consumer implementations — the core business logic would not change.

**Code references:** `RetryScheduler.java` (`@Scheduled` every 60s, max 3 retries), `TranscriptionService.java` (`@EventListener @Async("transcriptionExecutor")`), `AIProcessingService.java` (`@EventListener @Async("aiProcessingExecutor")`), `database-schema.sql` (`retry_count`, `processing_duration_ms` columns).

---

#### **Q34. Has anything you built or fixed ever prevented a production issue?**
**Answer:** Yes — the **RetryScheduler with `failed_jobs` table** directly prevents a class of silent data loss.

Before building this, if the Gemini API returned a 503 during AI processing, the exception was caught, the meeting was marked `FAILED`, and the user saw an error with no automatic recovery path.

After adding the `failed_jobs` table and `RetryScheduler`:
- The `AIProcessingService` catches the exception and records a `FailedJob` row with `status='PENDING'` and `nextAttempt = now + 5 minutes`.
- The scheduler wakes up every 60 seconds, finds eligible rows, and re-publishes the original domain event — transparently restarting the pipeline from the correct stage.
- After 3 failed retries, the job transitions to `GIVEN_UP` and the user is notified.

This means transient API failures — which happen regularly with rate-limited AI services — are completely invisible to the user in the happy path. Only persistent, unrecoverable failures surface as actual errors.

Additionally, the `GlobalExceptionHandler` (`@ControllerAdvice`) ensures that any unexpected exception from any controller returns a consistent, structured JSON error response rather than a raw Spring stack trace — preventing information leakage and improving debuggability.

**Code references:** `RetryScheduler.java` (full retry logic), `AIProcessingService.java` (`recordFailedJob()` on failure, line ~269), `GlobalExceptionHandler.java` (`@ControllerAdvice`).

---

#### **Q35. Did you ever write something (a doc, a test, a script) that saved someone else repeated work?**
**Answer:** Three things stand out:

1. **`interview_questions.md`** — A 30+ question interview prep document covering architecture, DB, security, async, scaling, and real-world scenarios for this project. Each question is answered with specific technical reasoning tied to the actual code, so anyone picking up this project for onboarding or a portfolio walkthrough has a ready reference without reading source code.

2. **`RUN_PROJECT.md`** — A detailed runbook covering how to start the full stack: required environment variables, Docker Compose for PostgreSQL, backend startup order, and frontend setup. Without this, every new setup requires reverse-engineering the codebase to figure out what `.env` keys are needed and in what order services must start.

3. **Swagger/OpenAPI auto-documentation** — By adding `springdoc-openapi` and annotating every controller with `@Operation` and `@Tag`, the API is self-documenting. Anyone integrating — frontend devs, QA testers — can hit `/swagger-ui.html` and see all endpoints, parameters, and response schemas without reading controller source code. That is ongoing saved work for every future collaborator.

**Code references:** `OpenApiConfig.java` (Swagger setup), `MeetingController.java` (`@Operation` annotations on all endpoints), `RUN_PROJECT.md`, `interview_questions.md`.
