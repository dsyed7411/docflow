# Stage 1: Build Java 21 Spring Boot Application with memory constraints
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
ENV MAVEN_OPTS="-Xmx384m -Xms128m"
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx384m", "-jar", "app.jar"]
