# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache maven
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN adduser -D appuser
RUN mkdir -p /app/uploads && chown appuser:appuser /app/uploads
USER appuser

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
