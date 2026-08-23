# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache maven
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN adduser -D appuser
RUN mkdir -p /app/uploads && chown appuser:appuser /app/uploads
USER appuser

COPY --from=build /app/target/meeting-ai-backend-*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xmx384m", "-Xms128m", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
