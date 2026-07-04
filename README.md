# Online Blogging Platform - Microservices Backend

This is a modern Full Stack Web Application backend built with Spring Boot 3.4.1 and Java 21.

## Architecture

The system consists of 7 microservices and 1 API Gateway:

1. **API Gateway (`:8080`)**: Routes traffic, handles CORS, and validates JWT tokens globally.
2. **Auth Service (`:8081`)**: Handles Registration, Login, and JWT generation (Stateless). Uses MongoDB.
3. **User Service (`:8082`)**: Manages public User Profiles. Uses MongoDB.
4. **Post Service (`:8083`)**: Manages Blog Posts, drafts, and publishing. Uses MongoDB.
5. **Comment Service (`:8084`)**: Manages comments and nested replies. Uses MongoDB.
6. **Engagement Service (`:8085`)**: Manages Likes and Bookmarks. Uses MongoDB.
7. **Notification Service (`:8086`)**: Real-time notifications. Uses MongoDB.
8. **Social Graph Service (`:8087`)**: Follow/Unfollow system. **Uses Neo4j exclusively.**

## Prerequisites

- **Java 21**
- **Docker & Docker Compose** (for databases)

## How to Run Locally

### 1. Start the Databases
To spin up MongoDB and Neo4j, simply run:
```bash
docker-compose up -d
```
- MongoDB will be available on `localhost:27017`
- Neo4j will be available on `localhost:7687` (Username: `neo4j`, Password: `password`)

### 2. Run the Microservices
You can run each microservice from its respective directory:
```bash
cd auth-service && ./mvnw spring-boot:run
cd user-service && ./mvnw spring-boot:run
# ... repeat for all services
```

*Note: Since they use different ports (8081-8087), you can run them all simultaneously. Make sure to run `api-gateway` (8080) last.*

### 3. API Communication
All frontend requests should be routed through the **API Gateway** on `http://localhost:8080`.

Example: To register, send a `POST` request to `http://localhost:8080/auth/register`. The gateway will forward this to the Auth Service on port 8081.

## Phase Implementation Summary
- **Phase 0**: Dependency Standardization (Java 21, Spring Boot 3.4.1, Lombok).
- **Phase 1**: Auth Service completed with JJWT, BCrypt, and `GlobalExceptionHandler`.
- **Phase 2**: User Service completed with profile management and regex search.
- **Phase 3**: Post Service completed with full CRUD, tags, drafts, and pagination.
- **Phase 4**: Comment Service completed with nested replies support.
- **Phase 5**: Engagement Service completed with Likes/Bookmarks and proper validations.
- **Phase 6**: Notification Service completed.
- **Phase 7**: Social Graph Service completed with Neo4j integration.
- **Phase 8**: API Gateway completed with Spring Cloud Gateway and Global JWT Validation filter.
- **Phase 9/10**: Docker Compose setup for infrastructure and README created.
