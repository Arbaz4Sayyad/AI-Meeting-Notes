# 🚀 100% Free Cloud Deployment Guide for AI Meeting Notes

This guide provides step-by-step instructions to deploy your full-stack **AI Meeting Notes** project completely **FREE** with no credit card required.

---

## 🏗️ Free Hosting Architecture

| Component | Service | Free Tier Features | Cost |
| :--- | :--- | :--- | :--- |
| **Database** | [Neon.tech](https://neon.tech) | Serverless PostgreSQL (0.5 GB storage, autoscaling) | **$0 / month** |
| **Backend (API)** | [Render.com](https://render.com) | Docker Web Service (512 MB RAM, free SSL) | **$0 / month** |
| **Frontend (UI)** | [Vercel](https://vercel.com) | React/Vite SPA Hosting, Global CDN, SSL | **$0 / month** |
| **AI Processing** | [Google AI Studio](https://aistudio.google.com) | Gemini 2.5 Flash API (15 RPM / 1M TPM free tier) | **$0 / month** |

---

## 📋 Prerequisites Checklist

1. Your code pushed to a **GitHub repository** (e.g., `https://github.com/your-username/AI-Meeting-Notes`).
2. Free accounts on:
   - [GitHub](https://github.com)
   - [Neon.tech](https://neon.tech)
   - [Google AI Studio](https://aistudio.google.com)
   - [Render.com](https://render.com)
   - [Vercel](https://vercel.com)

---

## 🗄️ Step 1: Create Free PostgreSQL Database on Neon.tech

1. Go to [Neon.tech](https://neon.tech) and Sign Up / Log In with GitHub.
2. Click **Create Project**:
   - **Project name**: `ai-meeting-notes`
   - **Postgres version**: `16` (or latest)
   - **Region**: Choose closest to you (e.g. `US East (Ohio)` or `EU Frankfurt`)
3. On your Neon Dashboard, copy your connection details:
   - Click the **Connection Details** dropdown.
   - Select **Connection string** -> choose **Java / JDBC** format (or copy standard URI):
     ```
     jdbc:postgresql://ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Note down:
     - **Database URL (`DB_URL`)**: `jdbc:postgresql://<host>/neondb?sslmode=require`
     - **Database Username (`DB_USER`)**: `neondb_owner` (or your user)
     - **Database Password (`DB_PASSWORD`)**: `<your-password>`

> 💡 **Note**: Spring Boot automatically creates/updates all database tables on first boot using `spring.jpa.hibernate.ddl-auto=update`.

---

## 🔑 Step 2: Get Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com).
2. Sign in with your Google account.
3. Click **"Get API key"** -> **"Create API key"**.
4. Copy your API Key (e.g. `AIzaSy...`). Save this as `GEMINI_API_KEY`.

---

## ⚙️ Step 3: Deploy Backend on Render.com

1. Go to [Render.com Dashboard](https://dashboard.render.com/) and Log in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select **"Build and deploy from a Git repository"** and choose your `AI-Meeting-Notes` repo.
4. Configure your Web Service:
   - **Name**: `meeting-ai-backend`
   - **Region**: Same region as your Neon database (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (Render will detect `backend/Dockerfile`)
   - **Instance Type**: **Free** (512 MB RAM)
5. Scroll down to **Environment Variables** and add the following:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:postgresql://<host>/neondb?sslmode=require` | From Neon.tech |
| `DB_USER` | `<neon-user>` | From Neon.tech |
| `DB_PASSWORD` | `<neon-password>` | From Neon.tech |
| `JWT_SECRET` | `MySuperSecretJwtKeyMeetingNotesApp2026Minimum32Chars!` | Secret key (min 32 chars) |
| `GEMINI_API_KEY` | `AIzaSy...` | From Google AI Studio |
| `FRONTEND_URL` | `https://your-app.vercel.app` (update after Step 4) | Frontend URL |
| `UPLOAD_DIR` | `/app/uploads` | Local upload directory in container |

6. Click **Create Web Service**.
7. Wait ~2-3 minutes for the build and container startup to complete.
8. Once live, Render gives you a public URL (e.g., `https://meeting-ai-backend.onrender.com`).
   - Test by opening: `https://meeting-ai-backend.onrender.com/swagger-ui.html`

---

## 🌐 Step 4: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and Log in with GitHub.
2. Click **"Add New..."** -> **"Project"**.
3. Import your `AI-Meeting-Notes` repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://meeting-ai-backend.onrender.com` (Your Render backend URL from Step 3, without trailing slash) |

6. Click **Deploy**.
7. Vercel will build and deploy your site in ~30 seconds, giving you a URL like `https://ai-meeting-notes.vercel.app`.

---

## 🔄 Step 5: Final Link-Up

1. Return to **Render.com** -> your `meeting-ai-backend` Web Service -> **Environment**.
2. Update the `FRONTEND_URL` variable to your actual Vercel URL:
   ```
   FRONTEND_URL = https://ai-meeting-notes.vercel.app
   ```
3. Click **Save Changes** (Render will automatically redeploy).

---

## ✨ Optional: Free Keep-Alive for Render (Prevent Sleep)

Render's free tier spins down after 15 minutes of inactivity. To keep it warm and fast for users:
1. Go to [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com) (both 100% free).
2. Create a free monitor/cron job to send a GET request every **10 minutes** to:
   ```
   https://meeting-ai-backend.onrender.com/api-docs
   ```
3. Your backend will stay active with zero cold start delay!

---

## 🧪 Verification Checklist

- [ ] **Open Frontend**: Visit `https://your-frontend.vercel.app`
- [ ] **Register Account**: Create a new user account
- [ ] **Login**: Log into your dashboard
- [ ] **Create / Upload Meeting**: Upload an audio file or paste a meeting transcript
- [ ] **Generate AI Summary**: Verify Gemini generates structured summaries, action items, and key points!
