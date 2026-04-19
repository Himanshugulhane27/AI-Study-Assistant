import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import API from '../api/axios';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [summarizing, setSummarizing] = useState(false);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const { data } = await API.get(`/materials/${id}`);
        setMaterial(data);
      } catch (err) {
        navigate('/materials');
      }
      setLoading(false);
    };
    fetchMaterial();
  }, [id, navigate]);

  const handleSummary = async () => {
    setSummarizing(true);
    try {
      const { data } = await API.post(`/materials/${id}/summary`);
      setMaterial(prev => ({ ...prev, summary: data.summary }));
      setActiveTab('summary');
    } catch (err) {
      alert(err.response?.data?.message || 'Summary generation failed');
    }
    setSummarizing(false);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    const q = question;
    setChatHistory(prev => [...prev, { type: 'user', text: q }]);
    setQuestion('');
    try {
      const { data } = await API.post(`/materials/${id}/ask`, { question: q });
      setChatHistory(prev => [...prev, { type: 'ai', text: data.answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { type: 'ai', text: 'Sorry, I could not process that question. Please try again.' }]);
    }
    setAsking(false);
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const { data } = await API.post(`/quizzes/generate/${id}`, { numQuestions });
      navigate(`/quizzes/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Quiz generation failed');
    }
    setGeneratingQuiz(false);
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading material...</div>;
  if (!material) return null;

  return (
    <div className="page-container">
      <div className="back-link" onClick={() => navigate('/materials')}>← Back to Materials</div>

      <div className="flex-between">
        <div className="page-header">
          <h1>{material.title}</h1>
          <div className="flex-gap">
            {material.subject && <span className="subject-tag">{material.subject.name}</span>}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Uploaded {new Date(material.uploadDate).toLocaleDateString()}
            </span>
            {material.fileName && <span className="badge badge-primary">📎 {material.fileName}</span>}
          </div>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content</button>
        <button className={`tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>AI Summary</button>
        <button className={`tab ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>Ask AI</button>
        <button className={`tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>Generate Quiz</button>
      </div>

      {activeTab === 'content' && (
        <div className="detail-section">
          <h2>📄 Study Content</h2>
          <div className="ai-output" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {material.content}
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="detail-section">
          <div className="flex-between">
            <h2>🧠 AI Summary</h2>
            <button className="btn btn-primary" onClick={handleSummary} disabled={summarizing}>
              {summarizing ? '⏳ Generating...' : material.summary ? '🔄 Regenerate' : '✨ Generate Summary'}
            </button>
          </div>
          {material.summary ? (
            <div className="ai-output">
              <ReactMarkdown>{material.summary}</ReactMarkdown>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🧠</div>
              <h3>No summary yet</h3>
              <p>Click "Generate Summary" to create an AI-powered summary</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'qa' && (
        <div className="detail-section">
          <h2>💬 Ask AI Questions</h2>
          <div className="chat-container" style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
            {chatHistory.length === 0 && (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <div className="empty-state-icon">💬</div>
                <h3>Ask anything about this material</h3>
                <p>The AI will answer based on the content</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.type}`}>
                {msg.type === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            ))}
            {asking && <div className="loading"><div className="spinner" /> Thinking...</div>}
          </div>
          <form onSubmit={handleAsk} className="chat-input-row">
            <input className="form-input" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question..." disabled={asking} />
            <button className="btn btn-primary" type="submit" disabled={asking || !question.trim()}>Ask</button>
          </form>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="detail-section">
          <h2>📝 Generate Quiz</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Create a quiz from this study material to test your understanding
          </p>
          <div className="form-group">
            <label>Number of Questions</label>
            <select className="form-select" style={{ maxWidth: 200 }} value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}>
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>
          <button className="btn btn-success btn-lg" onClick={handleGenerateQuiz} disabled={generatingQuiz}>
            {generatingQuiz ? '⏳ Generating Quiz...' : '🚀 Generate Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MaterialDetail;
