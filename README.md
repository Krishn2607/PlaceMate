# PlaceMate — AI-Powered Placement Preparation Platform

**Prepare with context. Track your progress. Become placement-ready.**

PlaceMate is a full-stack, AI-powered placement preparation platform that helps students organize, manage and improve their placement journey from one centralized workspace.

It brings together academic information, technical skills, projects, certifications, coding practice, resumes and preparation progress. It also uses AI to generate personalized weekly plans, analyze resumes and provide insights into a student's preparation.

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Features](#features)
- [How PlaceMate Works](#how-placemate-works)
- [Placement Readiness](#placement-readiness)
- [AI-Powered Capabilities](#ai-powered-capabilities)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Models](#database-models)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Testing](#testing)
- [Live Deployment](#live-deployment)
- [Future Improvements](#future-improvements)

---

## Overview

Preparing for campus placements involves much more than solving coding problems or creating a resume. Students need to manage multiple aspects of their preparation, understand their strengths and weaknesses, and consistently work towards their career goals.

PlaceMate provides a centralized workspace where students can maintain their placement profile, track their technical preparation, manage career-related information and monitor their overall progress.

The platform combines structured student data with AI-powered assistance to make placement preparation more organized, measurable and actionable.

## The Problem

Students often manage their placement preparation across multiple disconnected platforms:

- Academic information is maintained separately.
- Coding progress is distributed across different coding platforms.
- Projects and certifications are difficult to track consistently.
- Resume preparation and optimization require repeated manual effort.
- Students may not know how prepared they are for placement opportunities.
- Weekly preparation goals are often unstructured.
- It can be difficult to measure improvement over time.

This creates fragmented preparation and makes it harder for students to identify what they should focus on next.

## The Solution

PlaceMate brings these activities into one platform.

Students can maintain their profile, organize their technical achievements, track coding practice, manage resumes, evaluate placement readiness, generate weekly preparation plans and review their progress.

The goal is not simply to store student information, but to turn that information into a clearer picture of placement preparation.

---

## Features

### 1. Student Profile Management
- Maintain personal and academic information.
- Store college, branch, semester, CGPA and graduation year.
- Add GitHub profile and contact information.
- Manage technical skills and achievements.

### 2. Skills Management
- Maintain a structured list of technical skills.
- Track self-assessed skill levels.
- Keep technical strengths organized in one place.

### 3. Project Management
- Add and manage technical projects.
- Maintain project descriptions and relevant details.
- Build a centralized project portfolio.

### 4. Certification Management
- Add and manage certifications.
- Keep learning achievements organized.
- Connect certifications with the overall placement profile.

### 5. Coding Progress Tracking
- Connect coding profiles from:
  - LeetCode
  - Codeforces
  - CodeChef
  - HackerRank
- Maintain multiple accounts where applicable.
- Track individually solved coding problems.
- Record problem difficulty, topics, dates and problem links.
- View coding statistics and recent activity.

### 6. Resume Management
- Upload existing PDF resumes.
- Generate resumes using AI-assisted content generation.
- Analyze resumes for a selected target role.
- View and manage uploaded resumes.
- Maintain an active resume.
- Generate and store PDF documents.
- View ATS-related scores and improvement suggestions.

### 7. Target Company Management
- Maintain a list of companies of interest.
- Organize target companies by priority.
- Keep career goals connected to placement preparation.

### 8. Placement Readiness
- View an overall placement-readiness score.
- Understand the contribution of different preparation areas.
- Identify areas that need improvement.
- Track readiness using academic, coding, project and resume-related information.

### 9. AI-Powered Weekly Planning
- Generate a personalized weekly preparation plan.
- Use existing student information to provide relevant tasks.
- Organize tasks into categories:
  - Coding
  - Project
  - Resume
  - Aptitude
  - Interview
  - Learning
  - Profile
  - Other
- Mark tasks as completed and monitor weekly progress.

### 10. Progress Tracking
- Generate progress snapshots.
- Compare current preparation metrics with previous snapshots.
- Understand changes in coding, projects and other tracked areas.
- Ask AI to interpret preparation progress.

### 11. Centralized Dashboard
- View important placement preparation information.
- Monitor readiness, resume ATS score and coding activity.
- Access projects, certifications and target companies.
- Review weekly plans and recent progress.

---

## How PlaceMate Works

The platform follows a continuous preparation workflow:

```text
Create Student Profile
        |
        v
Add Skills, Projects & Certifications
        |
        v
Connect Coding Profiles
        |
        v
Upload or Generate Resume
        |
        v
Review Placement Readiness
        |
        v
Generate Weekly Preparation Plan
        |
        v
Complete Tasks & Track Progress
        |
        v
Review Improvements and Prepare Further
```

Each module contributes information to the student's overall placement preparation workspace.

---

## Placement Readiness

PlaceMate calculates a readiness score using six preparation dimensions.

| Parameter | Weight |
|---|---:|
| CGPA | 20% |
| Resume ATS Score | 20% |
| Projects | 20% |
| Coding Progress | 20% |
| Skills | 10% |
| Certifications | 10% |

The score is calculated from the student's available profile and preparation data.

### Readiness Categories

| Score | Status |
|---|---|
| 80–100 | Strong Foundation |
| 60–79 | On Track |
| 40–59 | Needs Development |
| Below 40 | Early Stage |

The readiness score is intended as a preparation indicator, not a guarantee of placement or selection by a company.

---

## AI-Powered Capabilities

PlaceMate integrates AI into specific workflows where analysis and structured recommendations can be useful.

**AI Resume Analysis**
- Analyze a resume for a selected target role.
- Generate an ATS-related score.
- Identify strengths and missing skills.
- Provide suggestions for improvement.

**AI Resume Generation**
- Generate resume content using selected projects and certifications.
- Tailor the generated content towards a target role.
- Create a downloadable/viewable PDF resume.

**AI Weekly Plan Generation**
- Use student preparation information to generate a structured weekly goal and tasks.
- Categorize tasks for better tracking.

**AI Progress Analysis**
- Interpret changes between progress snapshots.
- Highlight improvements and unchanged metrics.
- Provide suggestions based on recorded preparation progress.

AI features use Groq-powered backend services.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| File Upload | Multer |
| File Storage | MongoDB GridFS |
| PDF Processing | pdf-parse, PDFKit |
| AI Integration | Groq SDK |
| Testing | Vitest, Supertest |
| Version Control | Git, GitHub |
| Deployment | Render |

---

## System Architecture

PlaceMate follows a client-server architecture.

```text
                 STUDENT
                    |
                    v
          React + Vite Frontend
                    |
                    v
             Axios API Layer
                    |
                    v
             Express REST API
                    |
                    v
          Authentication Middleware
                    |
                    v
              Controllers
                    |
                    v
               Services
                    |
             +------+------+
             |             |
             v             v
       Mongoose Models   AI Services
             |             |
             v             v
          MongoDB       Groq API
             |
             v
         MongoDB GridFS
         (Resume Files)
```

The frontend communicates with the backend through REST APIs. Protected endpoints use JWT authentication. The backend handles application logic, database operations, file storage and AI-related workflows.

---

## Database Models

The main MongoDB models used in PlaceMate include:

| Model | Purpose |
|---|---|
| Student | Student account, academic and profile information |
| Project | Student project details |
| Certification | Certification records |
| CodingProfile | Connected coding-platform accounts |
| CodingProblem | Individually tracked solved problems |
| WeeklyPlan | Weekly goals and categorized tasks |
| ProgressSnapshot | Historical preparation metrics |
| Resume | Resume metadata and analysis information |
| TargetCompany | Student's target companies |

Resume PDF files are stored using MongoDB GridFS, while the Resume document maintains the associated file reference and metadata.

---

## Project Structure

```text
PlaceMate/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   │
│   └── server.js
│
└── README.md
```

The frontend separates pages, reusable components, authentication context and API service functions. The backend separates API routes, controllers, middleware, models and business logic.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (compatible with Vite 8)
- npm
- MongoDB Atlas account or a MongoDB connection
- Git

An API key from Groq is required for the AI-powered features.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd PlaceMate
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

# Optional: used for tests if configured
MONGO_URI_TEST=your_test_database_connection_string
```

Use your own credentials. Never commit `.env` files, database credentials, JWT secrets or API keys to GitHub.

### 4. Start the Backend

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

The API base path is:

```text
http://localhost:5000/api/v1
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Configure the Frontend API URL

Check `frontend/src/services/api.js` and configure its Axios `baseURL` to point to your local backend:

```text
http://localhost:5000/api/v1
```

For production, use your deployed backend API URL.

### 7. Start the Frontend

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## Testing

Backend tests use Vitest and Supertest.

Run the backend test command from the `backend` directory:

```bash
npm test
```

Build the frontend for production:

```bash
cd frontend
npm run build
```

---

## Live Deployment

- **Frontend:** https://placemate-chp6.onrender.com
- **Backend:** https://placemate-backend-7x8y.onrender.com

The frontend communicates with the deployed backend through its REST API.

---

## Future Improvements

Potential areas for further development include:

- More detailed company-specific preparation insights.
- Expanded skill-gap analysis.
- Additional coding-platform integrations.
- More advanced placement analytics.
- Enhanced resume customization and recommendations.
- Further improvements to AI-generated preparation guidance.

---

## Project Purpose

PlaceMate aims to make placement preparation more structured and measurable.

Instead of managing academic details, coding practice, projects, resumes and preparation plans separately, students can use one workspace to understand their current position, identify improvement areas and work towards their career goals.

**PlaceMate — One workspace for your placement preparation.**
