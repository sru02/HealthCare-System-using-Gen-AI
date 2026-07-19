# Quick Startup Guide

## Backend Setup (Choose one method):

### Method 1: Using IDE (Recommended)
1. Open the project in your IDE (Eclipse/IntelliJ/VS Code)
2. Right-click on `HealthcareApplication.java`
3. Select "Run as Java Application" or "Run Main"

### Method 2: Using Command Line (if Maven is installed)
```bash
cd backend
mvn spring-boot:run
```

### Method 3: Build and Run JAR
```bash
cd backend
mvn clean package
java -jar target/ai-healthcare-backend-1.0.0.jar
```

## Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Database Setup
1. Install MySQL
2. Create database: `CREATE DATABASE healthcare_db;`
3. Update credentials in `backend/src/main/resources/application.properties`

## Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Troubleshooting
- Ensure MySQL is running
- Check if ports 3000 and 8080 are available
- Verify database credentials in application.properties