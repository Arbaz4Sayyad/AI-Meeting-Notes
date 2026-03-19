# Meeting AI - Deployment Guide

## Quick Start (Local with Docker)

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Open http://localhost - the app runs on port 80.

4. Register a user and upload a meeting (audio or transcript).

---

## AWS EC2 Deployment

### 1. Launch EC2 Instance

- **AMI**: Ubuntu 22.04 LTS
- **Instance type**: t3.small or larger
- **Security group**: Allow inbound ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 2. Install Dependencies

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
# Log out and back in for docker group
```

### 3. Clone and Configure

```bash
git clone <your-repo> /opt/meeting-ai
cd /opt/meeting-ai
cp .env.example .env
nano .env  # Set GEMINI_API_KEY, JWT_SECRET, strong DB password
```

### 4. Build and Run

```bash
docker-compose up -d
```

### 5. SSL with Let's Encrypt (Nginx Reverse Proxy)

1. Install Nginx and Certbot:
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

2. Create `/etc/nginx/sites-available/meeting-ai`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:80;  # or frontend container port
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Enable site and get SSL:
   ```bash
   sudo ln -s /etc/nginx/sites-available/meeting-ai /etc/nginx/sites-enabled/
   sudo certbot --nginx -d your-domain.com
   ```

For production, run the app behind Nginx on a non-80 port and proxy.

### 6. Production docker-compose Override

Create `docker-compose.prod.yml`:

```yaml
services:
  backend:
    environment:
      JWT_SECRET: ${JWT_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    restart: unless-stopped
  frontend:
    restart: unless-stopped
  postgres:
    restart: unless-stopped
```

Run: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GEMINI_API_KEY | Yes | Google Gemini API key for summary generation |
| JWT_SECRET | Yes (prod) | Min 32 chars for JWT signing |
| DB_URL | No | JDBC URL (default in docker-compose) |
| DB_USER | No | Database user |
| DB_PASSWORD | No | Database password |
| GCP_PROJECT_ID | No | For Speech-to-Text; omit to use transcript-only |
| GCP_CREDENTIALS_PATH | No | Path to GCP service account JSON |

---

## Local Development (Without Docker)

### Backend

```bash
cd backend
# Set env vars or use .env
mvn spring-boot:run
```

Requires:
- JDK 17+
- PostgreSQL (create DB `meeting_ai`)
- GEMINI_API_KEY in env

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000 with API proxy to backend.
