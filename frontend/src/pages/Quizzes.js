import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await API.get('/quizzes');
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await API.delete(`/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading quizzes...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Quizzes</h1>
        <p>View and attempt your generated quizzes</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No quizzes yet</h3>
          <p>Generate a quiz from any study material</p>
          <Link to="/materials" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go to Materials</Link>
        </div>
      ) : (
        <div className="card-grid">
          {quizzes.map(q => (
            <div key={q._id} className="card">
              <div className="material-card-title">{q.material?.title || 'Untitled'}</div>
              <div className="material-card-meta">
                <span>{q.totalQuestions} questions</span>
                <span>{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
              {q.attempted ? (
                <div style={{ marginTop: '12px' }}>
                  <div className="flex-gap">
                    <span className="badge badge-success">Completed</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>
                      {q.score}/{q.totalQuestions}
                    </span>
                  </div>
                  <div className="progress-bar-container" style={{ marginTop: '8px' }}>
                    <div className="progress-bar-fill" style={{ width: `${(q.score / q.totalQuestions) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <span className="badge badge-warning" style={{ marginTop: '12px' }}>Not attempted</span>
              )}
              <div className="material-card-actions">
                <Link to={`/quizzes/${q._id}`} className="btn btn-primary btn-sm">
                  {q.attempted ? 'Review' : 'Attempt'}
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
