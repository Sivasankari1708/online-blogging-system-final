#!/bin/bash

echo "🚀 Starting Online Blogging Platform Backend Services..."


# 2. Function to start a Spring Boot service
start_service() {
    local dir=$1
    echo "⚙️ Starting $dir..."
    cd $dir
    # Run in background, limit memory to prevent crashing, redirect output to a log file
    MAVEN_OPTS="-Xmx256m" ./mvnw spring-boot:run > "../$dir.log" 2>&1 &
    cd ..
}

# 3. Start Core Services
start_service "api-gateway"
start_service "auth-service"
start_service "user-service"

echo "⏳ Waiting for core services to start (10 seconds)..."
sleep 10

# 4. Start Dependent Services
start_service "post-service"
start_service "comment-service"
start_service "engagement-service"
start_service "social-graph-service"
start_service "notification-service"

echo "✅ All backend services have been triggered!"
echo "📄 Logs for each service are available in the root directory (e.g. api-gateway.log)"
echo "⚠️ Note: It may take 1-2 minutes for all services to fully register with Eureka (if configured) and be ready to accept requests."
