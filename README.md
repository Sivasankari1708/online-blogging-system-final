# Online Blogging Platform - Microservices Backend

This is a modern Full Stack Web Application built with Spring Boot 3.4.1 (Java 21) on the backend and React on the frontend. 

## 📖 What this Application Does
The **Online Blogging Platform** is a feature-rich, highly scalable blogging system that allows users to create, read, interact with, and discover content. 
- **Users** can register accounts, manage their profiles, and build a social graph by following other authors.
- **Writers** can create rich blog posts, save drafts, and publish them to their followers.
- **Readers** can engage with content by liking posts, bookmarking their favorite articles for later, and participating in nested comment threads.
- **Real-time Notifications** ensure users are alerted when someone interacts with their posts or follows them.

The system is built using a highly decoupled **Microservices Architecture** to demonstrate scalable enterprise patterns, utilizing MongoDB for flexible document storage and Neo4j for managing complex social relationships.
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
- **Node.js** (v18 or higher)
- **Docker & Docker Compose** (for databases) OR local installations of **MongoDB** and **Neo4j**

---

## 🚀 How to Run the Application

You can run the backend services all at once using the provided scripts, or individually.

### 1. Start the Databases
Ensure your databases are running before starting the services.
If you have Docker, you can spin up MongoDB and Neo4j by running:
```bash
docker-compose up -d
```
- MongoDB will be available on `localhost:27017`
- Neo4j will be available on `localhost:7687` (Username: `neo4j`, Password: `password`)

### 2. Run All Backend Services (Recommended)
We provide scripts to start all 8 Spring Boot services automatically.

**For Mac/Linux:**
```bash
sh start_backend.sh
```

**For Windows (PowerShell):**
```powershell
.\start_backend.ps1
```
*Note: The script automatically sets a default `JWT_KEY` for authentication. Logs for each service are saved in the root directory (e.g., `api-gateway.log`).*

### 3. Run Backend Services Individually
If you prefer to run them one by one, open separate terminal windows and run the Maven wrapper:

```bash
cd api-gateway && ./mvnw spring-boot:run
cd auth-service && ./mvnw spring-boot:run
cd user-service && ./mvnw spring-boot:run
cd post-service && ./mvnw spring-boot:run
cd comment-service && ./mvnw spring-boot:run
cd engagement-service && ./mvnw spring-boot:run
cd social-graph-service && ./mvnw spring-boot:run
cd notification-service && ./mvnw spring-boot:run
```
*Make sure to export `JWT_KEY` in your terminal if you aren't using the start scripts!*

### 4. Run the React Frontend
Open a new terminal window, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 5. API Communication
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
