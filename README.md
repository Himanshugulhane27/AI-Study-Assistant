# AI Study Assistant Platform

🚀 **Live Demo:** [https://ai-study-assistant-sooty-seven.vercel.app](https://ai-study-assistant-sooty-seven.vercel.app)

🔗 **Backend API:** [https://ai-study-assistant-njeo.onrender.com](https://ai-study-assistant-njeo.onrender.com)

## About the Project

This is a full-stack web app I built for my SESD course project. The idea is simple — students (like us!) have tons of study material but not enough time to go through everything properly. So I thought, why not use AI to make studying easier?

You can upload your notes or PDFs, and the app uses Google's Gemini AI to generate summaries, answer your questions about the material, and even create quizzes so you can test yourself. It also keeps track of your progress so you know where you stand.

## What It Does

- Sign up and log in to your account
- Upload study materials (PDFs or just paste text)
- Get AI-generated summaries of your notes
- Ask questions about your material and get AI answers
- Auto-generate quizzes from your content to test yourself
- Organize everything by subject
- Track your learning progress on the dashboard
- View your study history

## Tech Stack

- **Frontend:** React (with React Router for navigation)
- **Backend:** Node.js + Express (using OOP pattern with classes)
- **Database:** MongoDB (with Mongoose for schemas)
- **AI:** Google Gemini API
- **Authentication:** JWT tokens + bcrypt for passwords
- **Deployment:** Vercel (frontend) + Render (backend)

## How the Project is Structured

```
├── backend/
│   ├── config/          # DB connection setup
│   ├── controllers/     # All the logic (OOP classes)
│   ├── middleware/       # Auth, validation, error handling, logging
│   ├── models/          # MongoDB schemas (User, Subject, Material, Quiz, Progress)
│   ├── routes/          # API endpoints
│   ├── services/        # Gemini AI service + file handling
│   └── server.js        # Main server file
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/         # Axios setup for API calls
│       ├── components/  # Navbar, PrivateRoute
│       ├── context/     # Auth context (login state management)
│       └── pages/       # All the pages (Dashboard, Materials, Quiz, etc.)
├── Diagrams/            # UML diagrams from milestone 1
└── README.md
```

## How to Run Locally

### What You Need
- Node.js installed
- MongoDB running locally (or a MongoDB Atlas account)
- A Google Gemini API key (free from aistudio.google.com)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Add your MongoDB URI and Gemini API key in .env
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on `localhost:3000` and backend on `localhost:5000`. The proxy is already configured so API calls work automatically during development.

## API Endpoints

### Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Log in
- `GET /api/auth/me` — Get logged-in user info

### Study Materials
- `GET /api/materials` — Get all your materials
- `POST /api/materials` — Upload new material (file or text)
- `GET /api/materials/:id` — View a specific material
- `POST /api/materials/:id/summary` — Generate AI summary
- `POST /api/materials/:id/ask` — Ask AI a question about it
- `DELETE /api/materials/:id` — Delete a material

### Subjects
- `GET /api/subjects` — List your subjects
- `POST /api/subjects` — Create a subject
- `PUT /api/subjects/:id` — Rename a subject
- `DELETE /api/subjects/:id` — Delete a subject

### Quizzes
- `POST /api/quizzes/generate/:materialId` — Generate a quiz from material
- `GET /api/quizzes` — List all your quizzes
- `GET /api/quizzes/:id` — View a quiz
- `POST /api/quizzes/:id/submit` — Submit your answers
- `DELETE /api/quizzes/:id` — Delete a quiz

### Progress
- `GET /api/progress` — See your learning progress
- `GET /api/progress/stats` — Dashboard statistics
- `PUT /api/progress/:materialId` — Update completion status

## Diagrams

All the UML diagrams (ER, Class, Sequence, Use Case) are in the `Diagrams/` folder and were created as part of Milestone 1.

---

Built as part of SESD coursework, 2nd Year
