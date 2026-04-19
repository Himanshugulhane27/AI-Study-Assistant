import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import Subjects from './pages/Subjects';
import Quizzes from './pages/Quizzes';
import QuizAttempt from './pages/QuizAttempt';
import StudyHistory from './pages/StudyHistory';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
        <Route path="/materials/:id" element={<PrivateRoute><MaterialDetail /></PrivateRoute>} />
        <Route path="/subjects" element={<PrivateRoute><Subjects /></PrivateRoute>} />
        <Route path="/quizzes" element={<PrivateRoute><Quizzes /></PrivateRoute>} />
        <Route path="/quizzes/:id" element={<PrivateRoute><QuizAttempt /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><StudyHistory /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
