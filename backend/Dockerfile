FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY gradle gradle
COPY gradlew build.gradle.kts settings.gradle.kts ./
RUN ./gradlew dependencies --no-daemon
COPY src ./src
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN groupadd -r slotme && useradd -r -g slotme slotme

COPY --from=build /app/build/libs/*.jar app.jar

RUN chown slotme:slotme app.jar
USER slotme

ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:+UseStringDeduplication"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -sf http://localhost:8080/actuator/health/liveness || exit 1

ENTRYPOINT ["sh", "-c", "java --enable-preview $JAVA_OPTS -jar app.jar"]
