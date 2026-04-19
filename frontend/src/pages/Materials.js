import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [filterSubject, setFilterSubject] = useState('');
  const [uploadData, setUploadData] = useState({ title: '', content: '', subject: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const fetchMaterials = async () => {
    try {
      const url = filterSubject ? `/materials?subject=${filterSubject}` : '/materials';
      const { data } = await API.get(url);
      setMaterials(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await API.get('/subjects');
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);
  useEffect(() => { fetchMaterials(); }, [filterSubject]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      if (uploadData.subject) formData.append('subject', uploadData.subject);
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('content', uploadData.content);
      }
      const { data } = await API.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowUpload(false);
      setUploadData({ title: '', content: '', subject: '' });
      setFile(null);
      navigate(`/materials/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this material?')) return;
    try {
      await API.delete(`/materials/${id}`);
      setMaterials(materials.filter(m => m._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading materials...</div>;

  return (
    <div className="page-container">
      <div className="flex-between">
        <div className="page-header">
          <h1>Study Materials</h1>
          <p>Upload and manage your study content</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>+ Upload Material</button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <select className="form-select" style={{ maxWidth: 250 }} value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {materials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No materials yet</h3>
          <p>Upload your first study material to get started</p>
        </div>
      ) : (
        <div className="card-grid">
          {materials.map(m => (
            <Link to={`/materials/${m._id}`} key={m._id} className="card material-card">
              <div className="material-card-title">{m.title}</div>
              <div className="material-card-meta">
                {m.subject && <span className="subject-tag">{m.subject.name}</span>}
                <span>{new Date(m.uploadDate).toLocaleDateString()}</span>
                {m.fileName && <span>📎 {m.fileName}</span>}
              </div>
              <div className="material-card-preview">
                {m.content?.substring(0, 150)}...
              </div>
              <div className="material-card-actions">
                {m.summary && <span className="badge badge-success">Summarized</span>}
                <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(m._id, e)}>Delete</button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Upload Study Material</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} placeholder="Material title" required />
              </div>
              <div className="form-group">
                <label>Subject (Optional)</label>
                <select className="form-select" value={uploadData.subject} onChange={e => setUploadData({...uploadData, subject: e.target.value})}>
                  <option value="">No subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Upload PDF or TXT File</label>
                <div className="file-upload">
                  <input type="file" accept=".pdf,.txt" onChange={e => setFile(e.target.files[0])} />
                  <div className="file-upload-text">
                    {file ? <span>📎 {file.name}</span> : <><span>Click to upload</span> or drag and drop<br/>PDF, TXT up to 10MB</>}
                  </div>
                </div>
              </div>
              {!file && (
                <div className="form-group">
                  <label>Or Paste Text Content</label>
                  <textarea className="form-textarea" value={uploadData.content} onChange={e => setUploadData({...uploadData, content: e.target.value})} placeholder="Paste your study notes here..." />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
