# 🚀 Meeting AI - Running Guide

## System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 2GB free
- **Java**: JDK 17+
- **Node.js**: 16+
- **Maven**: 3.6+
- **Database**: PostgreSQL (or H2 for development)

## 📋 Quick Start Steps

### 1. Backend Setup
```bash
# Navigate to backend
cd e:\ai-meeting-notes\backend

# Set reduced memory for low-resource systems
set MAVEN_OPTS=-Xmx512m -Xms256m

# Compile the project
mvn clean compile -DskipTests

# Run with H2 database (no PostgreSQL needed)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"
```

### 2. Frontend Setup
```bash
# Navigate to frontend
cd e:\ai-meeting-notes\frontend

# Install dependencies (if space allows)
npm install --production

# Or use yarn (more space efficient)
yarn install --production

# Start development server
npm run dev
```

### 3. Alternative: Docker Setup
```bash
# Use Docker (more memory efficient)
cd e:\ai-meeting-notes

# Build and run with docker-compose
docker-compose up -d

# Check logs
docker-compose logs -f
```

## 🔧 Troubleshooting

### Memory Issues
```bash
# Reduce JVM memory
export MAVEN_OPTS="-Xmx256m -Xms128m"

# Or use smaller heap
java -Xmx256m -jar target/meeting-ai-backend-0.0.1-SNAPSHOT.jar
```

### Disk Space Issues
```bash
# Clean npm cache
npm cache clean --force

# Clean Maven cache
mvn clean

# Use production builds only
npm run build
```

### Database Setup
```bash
# Use H2 (embedded) for development
# No setup required - it runs in-memory

# Or use PostgreSQL
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:14
```

## 🌐 Access Points

Once running, access the application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

## 📱 Features Available

### ✅ Working Features
1. **User Authentication** - Login/Register
2. **Meeting Upload** - Audio file processing
3. **AI Summaries** - Gemini-powered meeting insights
4. **Action Items** - Smart task extraction
5. **Analytics Dashboard** - Meeting metrics
6. **Meeting Templates** - Reusable structures
7. **Enhanced UI** - Modern, responsive design

### 🔧 Configuration Files
- **Backend**: `backend/src/main/resources/application.properties`
- **Frontend**: `frontend/.env`
- **Database**: `database-schema.sql`

## 🚨 Common Issues & Solutions

### Issue: "Out of Memory"
**Solution**: Reduce JVM heap size
```bash
set MAVEN_OPTS=-Xmx256m -Xms128m
```

### Issue: "No space left on device"
**Solution**: Clean caches and use production builds
```bash
npm cache clean --force
mvn clean
```

### Issue: "Port already in use"
**Solution**: Change ports in configuration
```bash
# Backend: application.properties
server.port=8081

# Frontend: package.json
"dev": "vite --port 3001"
```

## 🎯 Quick Test

1. **Start Backend**: `mvn spring-boot:run`
2. **Start Frontend**: `npm run dev`
3. **Open Browser**: http://localhost:3000
4. **Register Account**: Create test user
5. **Upload Meeting**: Test with audio file
6. **Generate Summary**: Test AI features

## 📞 Support

If issues persist:
1. Check system resources (RAM, disk space)
2. Review logs in `backend/logs/`
3. Verify environment variables
4. Try minimal configuration first

---

**Note**: This project requires significant system resources. Consider using a cloud IDE or VM if local resources are limited.
