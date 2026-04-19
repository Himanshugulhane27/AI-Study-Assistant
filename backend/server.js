require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const ErrorHandler = require('./middleware/ErrorHandler');
const RequestLogger = require('./middleware/RequestLogger');

const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const materialRoutes = require('./routes/materials');
const quizRoutes = require('./routes/quizzes');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();

connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-study-assistant-sooty-seven.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(RequestLogger.log);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  console.log('Serving static files from:', buildPath);
  app.use(express.static(buildPath));
  app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.use(ErrorHandler.handleNotFound);
app.use(ErrorHandler.handleError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
