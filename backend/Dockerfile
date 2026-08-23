# Universal Dockerfile for Root or Subfolder context
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache maven

# Copy files
COPY . .

# Detect if we are in root or backend subfolder and compile
RUN if [ -d "backend" ]; then cd backend; fi && \
    mvn clean package -DskipTests -B && \
    cp target/meeting-ai-backend-*.jar /app/app.jar

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN adduser -D appuser
RUN mkdir -p /app/uploads && chown appuser:appuser /app/uploads
USER appuser

COPY --from=build /app/app.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xmx384m", "-Xms128m", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
