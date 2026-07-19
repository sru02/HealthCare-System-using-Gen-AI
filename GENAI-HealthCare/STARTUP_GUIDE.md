# Healthcare Assistant - Startup Guide

## Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Quick Start

### 1. Database Setup
```sql
CREATE DATABASE healthcare_db;
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will start on: http://localhost:8080

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend will start on: http://localhost:3000

## Default Login Credentials

### Admin Access
- Email: `admin@admin.com`
- Password: `admin123`

### Regular User
- Register new account or use any email/password combination

## API Endpoints Status

✅ **Authentication**
- POST /api/login
- POST /api/register

✅ **AI Services**
- POST /api/symptoms (Gemini AI)
- POST /api/mental-health (Gemini AI)
- POST /api/summarize-report-file (Gemini AI)

✅ **Appointments**
- POST /api/appointments
- GET /api/appointments/{email}
- PUT /api/appointments/{id}
- DELETE /api/appointments/{id}

✅ **Medical Requirements**
- POST /api/medical-requirements
- GET /api/medical-requirements/{email}

✅ **Admin Endpoints**
- GET /api/admin/bookings
- GET /api/admin/users
- GET /api/admin/doctors
- GET /api/admin/patients
- GET /api/admin/requirements
- DELETE /api/admin/bookings/{id}
- PUT /api/admin/requirements/{id}/issue

## Features Working

✅ **AI Integration**
- Gemini 2.5 Flash API with retry mechanism
- Exponential backoff for 503 errors
- Intelligent prompt engineering

✅ **Email Notifications**
- Gmail SMTP integration
- Appointment confirmations
- Automated email workflows

✅ **Modern UI**
- Glassmorphism design
- Responsive layout
- Loading animations
- Error handling

✅ **Admin Dashboard**
- Complete CRUD operations
- Real-time data management
- Role-based access control

## Troubleshooting

### Backend Issues
- Ensure MySQL is running
- Check application.properties configuration
- Verify Gemini API key is valid

### Frontend Issues
- Clear browser cache
- Check console for errors
- Ensure backend is running on port 8080

### AI Service Issues
- Verify Gemini API key in application.properties
- Check internet connection
- Monitor console logs for retry attempts

## Success Indicators

✅ Backend starts without errors
✅ Database tables are created automatically
✅ Frontend loads without console errors
✅ Login/Register works
✅ AI features respond (may take 2-8 seconds with retries)
✅ Email notifications appear in console logs
✅ Admin dashboard shows all data

## Support

If you encounter any issues:
1. Check the console logs
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check network connectivity for AI services

The application is now fully functional with robust error handling and retry mechanisms!