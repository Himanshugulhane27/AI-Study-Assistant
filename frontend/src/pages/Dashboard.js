import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, progressRes] = await Promise.all([
          API.get('/progress/stats'),
          API.get('/progress')
        ]);
        setStats(statsRes.data);
        setRecentProgress(progressRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your learning progress overview</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalMaterials || 0}</div>
          <div className="stat-label">Study Materials</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalQuizzes || 0}</div>
          <div className="stat-label">Quizzes Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.averageScore || 0}%</div>
          <div className="stat-label">Avg Quiz Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalSummaries || 0}</div>
          <div className="stat-label">AI Summaries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.totalQuestions || 0}</div>
          <div className="stat-label">Questions Asked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.completedMaterials || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h2>Recent Activity</h2>
        <Link to="/materials" className="btn btn-secondary btn-sm">View All Materials</Link>
      </div>

      {recentProgress.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No activity yet</h3>
          <p>Upload your first study material to get started!</p>
          <Link to="/materials" className="btn btn-primary" style={{ marginTop: '1rem' }}>Upload Material</Link>
        </div>
      ) : (
        <div className="card-grid">
          {recentProgress.map((p) => (
            <Link to={`/materials/${p.material?._id}`} key={p._id} className="card material-card">
              <div className="material-card-title">{p.material?.title || 'Untitled'}</div>
              <div className="material-card-meta">
                <span className={`badge badge-${p.completionStatus === 'completed' ? 'success' : p.completionStatus === 'in_progress' ? 'warning' : 'primary'}`}>
                  {p.completionStatus.replace('_', ' ')}
                </span>
                {p.quizScore > 0 && <span>Score: {p.quizScore}%</span>}
              </div>
              <div className="material-card-meta">
                <span>Last accessed: {new Date(p.lastAccessed).toLocaleDateString()}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${p.completionStatus === 'completed' ? 100 : p.completionStatus === 'in_progress' ? 50 : 0}%` }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
