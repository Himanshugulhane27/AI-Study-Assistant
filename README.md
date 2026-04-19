# AI Study Assistant Platform

A full-stack MERN web application that uses Google Gemini AI to help students study more effectively.

## Features

- User registration and authentication (JWT)
- Upload study materials (PDF/TXT)
- AI-generated summaries using Google Gemini
- AI-powered Q&A based on study content
- Automatic quiz generation from materials
- Subject-wise material organization
- Progress tracking dashboard
- Study history management

## Tech Stack

- **Frontend:** React with React Router
- **Backend:** Node.js with Express (OOP architecture)
- **Database:** MongoDB with Mongoose
- **AI:** Google Gemini API
- **Auth:** JWT with bcrypt password hashing

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # OOP controller classes
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # AI and file services
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── api/         # Axios config
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       └── pages/       # Page components
└── Diagrams/            # UML diagrams
```

## Setup

### Prerequisites
- Node.js
- MongoDB
- Google Gemini API key

### Backend
```bash
cd backend
cp .env.example .env    # Add your GEMINI_API_KEY and MONGODB_URI
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

The frontend runs on port 3000 and proxies API requests to port 5000.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Materials
- `GET /api/materials` - List all materials
- `POST /api/materials` - Upload new material
- `GET /api/materials/:id` - Get material details
- `POST /api/materials/:id/summary` - Generate AI summary
- `POST /api/materials/:id/ask` - Ask AI question
- `DELETE /api/materials/:id` - Delete material

### Subjects
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Quizzes
- `POST /api/quizzes/generate/:materialId` - Generate quiz
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Get quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `DELETE /api/quizzes/:id` - Delete quiz

### Progress
- `GET /api/progress` - Get learning progress
- `GET /api/progress/stats` - Get dashboard stats
- `PUT /api/progress/:materialId` - Update progress
