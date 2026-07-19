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
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              React Frontend (Port 3000)                 │   │
│   │                                                         │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│   │  │   Symptom    │  │Mental Health │  │   Report    │  │   │
│   │  │   Checker    │  │     Chat     │  │ Summarizer  │  │   │
│   │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│   │  │ Appointment  │  │   Medical    │  │    Admin    │  │   │
│   │  │   Booking    │  │Requirements  │  │  Dashboard  │  │   │
│   │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│   └─────────────────────────┬───────────────────────────────┘   │
│                             │ REST API (Axios)                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                    │
│                                                                 │
│  ┌─────────────────┐   ┌──────────────────┐                    │
│  │   Controllers   │   │    Services      │                    │
│  │  HealthcareCtrl │──▶│  HealthcareSvc   │                    │
│  └─────────────────┘   │  GeminiService   │──▶ Google Gemini   │
│                        │  RAGService      │    2.5 Flash API   │
│  ┌─────────────────┐   │  EmailService    │──▶ Gmail SMTP      │
│  │  JPA Repository │   └──────────────────┘                    │
│  │  Booking        │                                            │
│  │  Doctor         │                                            │
│  │  User           │                                            │
│  │  MedicalReq     │                                            │
│  └────────┬────────┘                                            │
└───────────┼─────────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────┐
│     MySQL Database          │
│     (healthcare_db)         │
│                             │
│  • users                    │
│  • bookings                 │
│  • doctors                  │
│  • medical_requirements     │
│  • report_summaries         │
│  • knowledge_documents      │
└─────────────────────────────┘
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

## Deployment

### Option 1 — Railway + Vercel (Recommended, Free)

**Backend on Railway**

1. Go to [railway.app](https://railway.app) → sign up with GitHub
2. **New Project → Deploy from GitHub repo** → select this repo, set root to `backend`
3. Add a database: **+ New → Database → MySQL**
4. In **Variables**, add:
   - `GEMINI_API_KEY` → your Gemini API key
   - `MAIL_USERNAME` → your Gmail address
   - `MAIL_PASSWORD` → your Gmail App Password
5. Update `application.properties` to read from environment variables:
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}
gemini.api.key=${GEMINI_API_KEY}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```
6. Deploy — Railway gives you a URL like `https://your-app.railway.app`

**Frontend on Vercel**

1. Go to [vercel.com](https://vercel.com) → **New Project → Import** this repo
2. Set **Root Directory** to `frontend`
3. Add environment variable: `REACT_APP_API_URL` = your Railway backend URL
4. Deploy — Vercel gives you a URL like `https://your-app.vercel.app`

---

### Option 2 — AWS (Adds AWS Experience to Resume)

| Service | Purpose |
|---|---|
| **Elastic Beanstalk** | Deploy Spring Boot JAR |
| **Amazon RDS (MySQL)** | Managed MySQL database |
| **AWS Amplify** | Deploy React frontend |
| **Secrets Manager** | Store API keys securely |

See [AWS Free Tier](https://aws.amazon.com/free/) for usage limits.

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

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)
