# GenAI Healthcare Assistant

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-8E75B2?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> An AI-powered full-stack healthcare web application built with **React**, **Spring Boot**, and **Google Gemini 2.5 Flash**. Features real-time appointment booking, AI symptom analysis, mental health support, medical report summarization, and a role-based admin dashboard.

---

## Live Demo

**[Live App →](https://your-app-name.vercel.app)** *(update after deployment)*

---

## Screenshots

> Add your screenshots to the `screenshots/` folder — see [`screenshots/README.md`](screenshots/README.md) for the exact filenames and instructions.

---

## Architecture

```
+------------------------------------------------------------------+
|                         USER BROWSER                            |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                React Frontend (Port 3000)                  |  |
|  |                                                            |  |
|  |  +--------------+  +--------------+  +---------------+    |  |
|  |  |   Symptom    |  | Mental Health|  |    Report     |    |  |
|  |  |   Checker    |  |     Chat     |  |  Summarizer   |    |  |
|  |  +--------------+  +--------------+  +---------------+    |  |
|  |                                                            |  |
|  |  +--------------+  +--------------+  +---------------+    |  |
|  |  | Appointment  |  |   Medical    |  |     Admin     |    |  |
|  |  |   Booking    |  | Requirements |  |   Dashboard   |    |  |
|  |  +--------------+  +--------------+  +---------------+    |  |
|  +------------------------------+-----------------------------+  |
|                                 |  REST API (Axios)              |
+-------------------------------- | --------------------------------+
                                  |
+--------------------------------- v --------------------------------+
|                  Spring Boot Backend (Port 8080)                   |
|                                                                    |
|  +-------------------+      +--------------------+                |
|  |    Controllers    |      |      Services      |                |
|  |  HealthcareCtrl   +----> |  HealthcareSvc     |                |
|  +-------------------+      |  GeminiService     +---> Gemini AI  |
|                             |  RAGService        |                |
|  +-------------------+      |  EmailService      +---> Gmail SMTP |
|  |   JPA Repository  |      +--------------------+                |
|  |   Booking         |                                            |
|  |   Doctor          |                                            |
|  |   User            |                                            |
|  |   MedicalReq      |                                            |
|  +---------+---------+                                            |
+------------|-------------------------------------------------------+
             |
+------------ v ------------------+
|        MySQL Database           |
|        (healthcare_db)          |
|                                 |
|   - users                       |
|   - bookings                    |
|   - doctors                     |
|   - medical_requirements        |
|   - report_summaries            |
|   - knowledge_documents         |
+---------------------------------+
```

---

## Features

| Feature | Description |
|---|---|
| **AI Symptom Checker** | Analyze symptoms using Gemini AI — get possible conditions, urgency level & specialist recommendations |
| **Mental Health Chatbot** | Empathetic AI companion for mental wellness support |
| **Report Summarizer** | Upload medical reports (PDF/image) and get AI-generated summaries with key findings |
| **Appointment Booking** | Real-time scheduling with doctors across specialties + email confirmation |
| **Medical Requirements** | Track and manage medical requirements with priority levels |
| **Admin Dashboard** | Full CRUD — manage users, doctors, bookings, and requirements |
| **Auth System** | Login/Register with role-based access (Admin vs Patient) |
| **Email Notifications** | Automated Gmail SMTP confirmations on appointment booking |

---

## Tech Stack

**Frontend** — React 18, Axios, Glassmorphism UI

**Backend** — Spring Boot 3.2 (Java 17), Spring Data JPA, Spring Mail, Apache Tika

**Database** — MySQL 8.0

**AI** — Google Gemini 2.5 Flash, RAG knowledge base, exponential backoff retry

---


## Local Setup

### Prerequisites
- Java 17+, Node.js 16+, MySQL 8.0+, Maven 3.6+

### Steps

```bash
# 1. Clone
git clone https://github.com/<your-username>/genai-healthcare-assistant.git
cd genai-healthcare-assistant

# 2. Configure backend secrets
cd backend/src/main/resources
cp application.properties.example application.properties
# Fill in your DB credentials, Gemini API key, and Gmail App Password

# 3. Run backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# 4. Run frontend (http://localhost:3000)
cd frontend
npm install && npm start
```

### Default Login
| Role | Email | Password |
|---|---|---|
| Admin | admin@admin.com | admin123 |
| User | Register a new account | — |

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | User login |
| POST | `/api/register` | User registration |

### AI Services
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/symptoms` | Analyze symptoms with Gemini AI |
| POST | `/api/mental-health` | Mental health chat |
| POST | `/api/summarize-report-file` | Summarize uploaded medical report |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments/{email}` | Get appointments by patient |
| PUT | `/api/appointments/{id}` | Update appointment |
| DELETE | `/api/appointments/{id}` | Cancel appointment |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/doctors` | All doctors |
| DELETE | `/api/admin/bookings/{id}` | Delete booking |

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Srushti N**
- GitHub: https://github.com/sru02
- LinkedIn: https://www.linkedin.com/in/srushtinatesh/
