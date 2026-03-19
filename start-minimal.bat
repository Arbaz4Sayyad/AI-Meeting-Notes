@echo off
echo Starting Meeting AI with minimal resources...
echo.

REM Set minimal JVM settings
set MAVEN_OPTS=-Xmx256m -Xms128m
set JAVA_OPTS=-Xmx256m -Xms128m

echo Backend: Starting with minimal memory...
cd backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx256m -Xms128m" -Dspring-boot.run.arguments="--spring.profiles.active=h2"

pause
