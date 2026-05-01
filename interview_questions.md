# Interview Preparation: AI Meeting Notes Generator
## Role: Senior Backend Engineer (Focus: 2+ YOE Practical Application)

---

### **System Architecture & Design**

#### **Q1. Walk me through the high-level data flow when a user uploads a meeting recording.**
**Answer:** The system follows an asynchronous processing pipeline. First, the client uploads the audio file via a REST API to the **Spring Boot** backend, which stores it in a managed upload directory. Instead of processing it immediately, the backend publishes an **Internal Application Event**. A listener component, marked with **`@Async`**, picks up this event and initiates the multi-step AI pipeline: **Whisper/Google STT** for transcription, followed by **Google Gemini** for summarization and action item extraction. Finally, the results are persisted in **PostgreSQL**, and the user can see the updated status on their dashboard.

#### **Q2. Why did you choose an internal event-driven architecture over a distributed message queue like Kafka?**
**Answer:** For the current scale and requirements, using **Spring Application Events** with `@Async` provided the right balance of performance and simplicity. It decoupled the API response from the heavy AI processing without the overhead of managing a Kafka cluster or RabbitMQ. However, I designed the service layer to be "Event Agnostic." If we need to scale horizontally or handle massive traffic spikes, we can easily swap the internal publisher with a **Kafka** producer with minimal code changes.

#### **Q3. How do you ensure the system is resilient if the server restarts during an AI task?**
**Answer:** We maintain state in **PostgreSQL**. Every meeting job has a status: `PENDING`, `PROCESSING`, `COMPLETED`, or `FAILED`. If the server crashes, the task in memory is lost. However, on startup, I can run a "Recovery Job" that scans for tasks stuck in the `PROCESSING` state for too long and either re-queues them or marks them as failed so the user can retry. This ensures data consistency even without a persistent message queue.

---

### **Database & Persistence**

#### **Q4. Why did you choose PostgreSQL over a NoSQL database like MongoDB for storing transcripts?**
**Answer:** While transcripts are unstructured text, the core of this application is relational: Users own Meetings, which have Summaries, Action Items, and Analytics. **PostgreSQL** offers the best of both worlds. I use standard relational tables for structured metadata and can use **JSONB** or large text columns for transcripts. This gives me ACID compliance for user data while maintaining the flexibility to store complex AI outputs in a single record.

#### **Q5. How do you handle searching through thousands of meeting notes efficiently?**
**Answer:** Currently, I use PostgreSQL's indexing capabilities. For the meeting metadata (titles, dates), I use standard **B-Tree indexes**. For searching content *within* transcripts and summaries, I leverage **PostgreSQL Full-Text Search (FTS)** with GIN indexes. This is significantly faster than a `LIKE` query. As a future improvement, I’ve planned for **Vector Database integration (RAG)** to enable semantic search across the archive.

---

### **AI Integration & Async Processing**

#### **Q6. How do you handle failures when calling external AI APIs like Gemini or Whisper?**
**Answer:** I implemented a **Retry Mechanism** with exponential backoff for transient failures (like network timeouts or 5xx errors). For permanent failures (like file format issues), the system catches the exception, logs it with a **Correlation ID**, and updates the meeting status to `FAILED`. I also implemented a **Fallback Strategy**: if the primary STT provider fails, the system can attempt a secondary provider before giving up.

#### **Q7. The README mentions a "Processing Latency" of under 45 seconds. How did you optimize for this?**
**Answer:** The primary optimization is the **Asynchronous Pipeline**. By returning a `202 Accepted` immediately, the user isn't waiting on the connection. Internally, I use a dedicated **ThreadPoolTaskExecutor** for `@Async` tasks to prevent the AI processing from starving the main web server threads. We also use efficient audio chunking and optimized prompts for Gemini to get structured JSON outputs directly, reducing post-processing time.

#### **Q8. How do you handle the high latency of AI summarization without blocking the UI?**
**Answer:** The UI is built to be "Async-aware." When a user creates a meeting, they get an immediate success message. The frontend then uses a combination of **polling** (or could be upgraded to WebSockets) to check the meeting's status. Once the status in PostgreSQL changes to `COMPLETED`, the UI dynamically updates to show the generated summary and action items.

---

### **Security & Authentication**

#### **Q9. How is security implemented in this project?**
**Answer:** We use **JWT (JSON Web Tokens)** for stateless authentication and **OAuth2** for Google and GitHub logins. Spring Security protects all API endpoints. When a user logs in, they receive a JWT. For every subsequent request, the client sends this token in the `Authorization` header. This allows our backend to be horizontal-scalable since we don't need to share session state across server instances.

#### **Q10. How do you protect against sensitive meeting data being leaked?**
**Answer:** Data protection is handled at multiple levels. 1. **Authentication**: Strict JWT validation. 2. **Authorization**: Every database query is scoped to the `owner_id`, ensuring User A cannot access User B's transcripts even if they guess the `meeting_id`. 3. **API Security**: Using **Enterprise-grade AI endpoints** (via Google Vertex AI/Gemini) ensures that the data sent for summarization is not used for training base models.

---

### **Performance & Scalability**

#### **Q11. If we suddenly have 1,000 concurrent uploads, how will your system behave?**
**Answer:** Currently, it will be limited by the **Thread Pool** size and the **AI API quotas**. Since we use `@Async`, the web server will stay responsive, but the background tasks will queue up in the `TaskExecutor`'s internal queue. To handle this at scale, I would: 1. Move the upload storage to **AWS S3**. 2. Replace Spring Events with **Kafka** to distribute the load across multiple worker microservices. 3. Implement **Rate Limiting** at the API Gateway level.

#### **Q12. What was the most critical "Engineering Decision" you made in this project?**
**Answer:** Choosing to build an **Asynchronous Pipeline** from day one. In a meeting notes app, the AI processing takes anywhere from 10 to 60 seconds. A synchronous design would have led to a terrible user experience and server-side timeouts. By committing to an async architecture (using Spring Events and `@Async`), I ensured the application remains responsive and professional under load.

#### **Q13. How do you handle "Large File" uploads specifically in a Spring Boot environment?**
**Answer:** I configured **Multipart properties** in Spring to allow files up to a specific limit (e.g., 50MB). To avoid memory issues, I use **Streaming I/O** to write the incoming bytes directly to the disk/volume rather than loading the entire file into a byte array in memory. This keeps the JVM heap usage low even during large uploads.

---

### **Clean Architecture & Code Quality**

#### **Q14. How did you apply Clean Architecture principles here?**
**Answer:** I separated the concerns into layers: **Web (Controllers)**, **Service (Business Logic)**, and **Persistence (Repositories)**. For AI integrations, I used the **Adapter Pattern**. There is an `AIService` interface, and specific implementations like `GeminiAIService`. This makes the code highly testable (I can mock the AI) and allows us to switch AI providers (e.g., to GPT-4) without touching the core business logic.

#### **Q15. How do you ensure the system is easy to monitor and debug?**
**Answer:** I use **Structured Logging** with SLF4J. Every background task logs its progress with the `meeting_id`. I also use a **Global Exception Handler** (`@ControllerAdvice`) to return consistent error responses to the frontend. For production, I’d integrate with **Spring Boot Actuator** and **Prometheus/Grafana** to monitor thread pool usage and API latency in real-time.

---

### **Practical / Scenario Based**

#### **Q16. A user complains their summary was never generated. How do you find out why?**
**Answer:** First, I check the database for that meeting's status. If it's `FAILED`, I look at the logs for the corresponding `meeting_id`. If the status is `PROCESSING` for too long, it might mean the thread died. I’d use a **Correlation ID** to trace the request from the upload log to the AI processing log to see if it was an API timeout, an authentication error with Gemini, or a file processing issue.

#### **Q17. How would you add "Real-time Transcription" (streaming) in the future?**
**Answer:** This would require a move from REST to **WebSockets**. Instead of a single upload, the frontend would stream audio chunks. On the backend, we’d use a **WebSocket Handler** to pipe those chunks directly to a streaming STT API. We’d then push the partial transcripts back to the user in real-time using the same socket connection.

#### **Q18. How do you handle database migrations in this project?**
**Answer:** I use **Flyway** (or Liquibase). Every change to the schema is stored as a versioned SQL script in `src/main/resources/db/migration`. This ensures that every environment (Dev, QA, Prod) has the exact same database structure and makes it easy to roll back if a change causes issues.

#### **Q19. Why use JWT instead of standard Session/Cookies?**
**Answer:** JWT is **stateless**. This is crucial for scalability. With Sessions, if I have two server instances, I need a shared session store (like Redis) or "Sticky Sessions." With JWT, any server instance can validate the token using the secret key, making it much easier to scale the backend horizontally in a Docker/Kubernetes environment.

#### **Q20. How do you manage your AI API secrets?**
**Answer:** I never hardcode keys. I use **Environment Variables** (managed via `.env` files locally or Secret Managers in the cloud). In Spring, I inject them using the `@Value` annotation or `ConfigurationProperties`. This prevents sensitive keys from being committed to version control.
