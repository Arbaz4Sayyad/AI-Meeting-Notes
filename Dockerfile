# Universal Dockerfile for Render / Cloud Deployments
# Supports build context at either repository root OR backend/ subfolder
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache maven

# Copy workspace
COPY . .

# Detect if we are at root or inside backend folder and build
RUN if [ -f "pom.xml" ]; then \
      mvn package -DskipTests -B && cp target/*.jar app.jar; \
    elif [ -f "backend/pom.xml" ]; then \
      cd backend && mvn package -DskipTests -B && cp target/*.jar /app/app.jar; \
    else \
      echo "Error: pom.xml not found" && exit 1; \
    fi

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN adduser -D appuser
RUN mkdir -p /app/uploads && chown appuser:appuser /app/uploads
USER appuser

COPY --from=build /app/app.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xmx384m", "-Xms128m", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
