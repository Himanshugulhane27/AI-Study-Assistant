import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const StudyHistory = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/progress');
        setProgress(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleStatusChange = async (materialId, status) => {
    try {
      await API.put(`/progress/${materialId}`, { completionStatus: status });
      setProgress(prev =>
        prev.map(p => p.material?._id === materialId ? { ...p, completionStatus: status } : p)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'badge-success';
    if (status === 'in_progress') return 'badge-warning';
    return 'badge-primary';
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading history...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Study History</h1>
        <p>Track and manage your learning progress across all materials</p>
      </div>

      {progress.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No study history yet</h3>
          <p>Start studying materials to see your progress here</p>
          <Link to="/materials" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Materials</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {progress.map(p => (
            <div key={p._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Link to={`/materials/${p.material?._id}`} className="material-card-title" style={{ display: 'block', marginBottom: 6 }}>
                  {p.material?.title || 'Untitled'}
                </Link>
                <div className="material-card-meta">
                  <span className={`badge ${getStatusColor(p.completionStatus)}`}>
                    {p.completionStatus.replace('_', ' ')}
                  </span>
                  <span>Last: {new Date(p.lastAccessed).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-light)' }}>{p.summariesGenerated}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Summaries</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--secondary)' }}>{p.questionsAsked}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>{p.quizzesTaken}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quizzes</div>
                </div>
                {p.quizScore > 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>{p.quizScore}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
                  </div>
                )}
                <select
                  className="form-select"
                  style={{ width: 'auto', minWidth: 140, padding: '6px 10px', fontSize: '0.8rem' }}
                  value={p.completionStatus}
                  onChange={(e) => handleStatusChange(p.material?._id, e.target.value)}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyHistory;
