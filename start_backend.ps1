# Set environment variables for this process (which will be inherited by all child processes)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$env:MAVEN_OPTS = "-Xmx256m"

Write-Host "[INFO] Starting Online Blogging Platform Backend Services in separate windows..."

$services = @("api-gateway", "auth-service", "user-service", "post-service", "comment-service", "engagement-service", "social-graph-service", "notification-service")

# 1. Compile each service sequentially first to download dependencies and avoid parallel download locks
Write-Host "[BUILD] Compiling services sequentially to resolve dependencies..."
foreach ($s in $services) {
    Write-Host "[BUILD] Compiling $s..."
    $absPath = (Get-Item $s).FullName
    Push-Location $absPath
    # Clean lastUpdated files if any download failed previously
    Remove-Item -Path "$env:USERPROFILE\.m2\repository\*.lastUpdated" -Recurse -Force -ErrorAction SilentlyContinue
    # Run compile
    cmd.exe /c "mvnw.cmd compile"
    Pop-Location
}

# Function to start a Spring Boot service in a new CMD window
function Start-ServiceProcess {
    param (
        [string]$dirName
    )
    Write-Host "[START] Opening new terminal window for $dirName..."
    $absPath = (Get-Item $dirName).FullName

    # Spawn cmd.exe in a new window, inheriting env variables, setting window title, and running spring-boot:run
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k title $dirName && .\mvnw.cmd spring-boot:run" -WorkingDirectory $absPath
}

# 2. Start Core Services
Start-ServiceProcess "api-gateway"
Start-ServiceProcess "auth-service"
Start-ServiceProcess "user-service"

Write-Host "[WAIT] Waiting for core services to initialize (15 seconds)..."
Start-Sleep -Seconds 15

# 3. Start Dependent Services
Start-ServiceProcess "post-service"
Start-ServiceProcess "comment-service"
Start-ServiceProcess "engagement-service"
Start-ServiceProcess "social-graph-service"
Start-ServiceProcess "notification-service"

Write-Host "[SUCCESS] All backend services have been launched in separate terminal windows!"
Write-Host "[INFO] You can inspect each service's log output in its respective terminal window."
