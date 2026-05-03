# OPTGuard AI 🛡️

**AI-powered F1 OPT/STEM OPT Deadline, EAD, and Compliance Tracker**

OPTGuard AI is a full-stack web application designed to help international students (F1 visa) stay compliant with USCIS regulations. It automatically calculates filing windows, tracks unemployment days, and provides personalized AI-driven insights.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based registration and login.
- 📋 **Onboarding**: Multi-step flow to capture program and OPT details.
- 🕒 **Deadline Engine**: Automated calculation of OPT filing, STEM extension, and validation reporting dates.
- 🧠 **AI Assistant**: GPT-4o powered chat for educational guidance on immigration rules.
- 📊 **Dashboard**: High-level status overview with risk level indicators.
- 🗺️ **Visual Timeline**: A beautiful roadmap of your entire OPT journey.
- 📂 **Document Checklist**: Track required forms (I-20s, EADs, I-94s).
- 💼 **Employment Tracker**: Manage job history and monitor allowed unemployment days.

## 🛠️ Tech Stack

### Backend
- **Java 21 / Spring Boot 3.2**
- **Spring Security + JWT**
- **Spring Data JPA + PostgreSQL**
- **OpenAI API** (GPT-4o)
- **Spring RestClient**

### Frontend
- **React 18 + TypeScript**
- **Tailwind CSS** (Custom Premium Theme)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (API Requests)

## 🚀 Getting Started

### Prerequisites
- Docker (for PostgreSQL)
- JDK 21
- Node.js & npm
- OpenAI API Key

### 1. Database
```bash
docker-compose up -d
```

### 2. Backend
1. Navigate to `optguard-backend`.
2. Update `src/main/resources/application.properties` with your `GROQ_API_KEY`.
3. Run the application:
```bash
./mvnw spring-boot:run
```

### 3. Frontend
1. Navigate to `optguard-frontend`.
2. Install dependencies:
```bash
npm install
```
3. Start the dev server:
```bash
npm run dev
```

## 📜 Disclaimer
OPTGuard AI provides educational guidance based on official USCIS/SEVP guidelines. It does not provide legal advice. Students should always verify information with their Designated School Official (DSO) or a qualified immigration attorney.
