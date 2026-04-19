import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchSubjects = async () => {
    try {
      const { data } = await API.get('/subjects');
      setSubjects(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/subjects/${editingId}`, { name });
      } else {
        await API.post('/subjects', { name });
      }
      setShowModal(false);
      setName('');
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subject');
    }
    setSaving(false);
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setName(subject.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject? Materials will be unlinked.')) return;
    try {
      await API.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="spinner" /> Loading subjects...</div>;

  return (
    <div className="page-container">
      <div className="flex-between">
        <div className="page-header">
          <h1>Subjects</h1>
          <p>Organize your study materials by subject</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Subject</button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <h3>No subjects yet</h3>
          <p>Create subjects to organize your study materials</p>
        </div>
      ) : (
        <div className="card-grid">
          {subjects.map(s => (
            <div key={s._id} className="card">
              <div className="flex-between">
                <div>
                  <div className="material-card-title">{s.name}</div>
                  <div className="material-card-meta">
                    <span>{s.materialCount || 0} material{s.materialCount !== 1 ? 's' : ''}</span>
                    <span>Created {new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="material-card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Subject' : 'New Subject'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Subject Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Mathematics, Physics" required autoFocus />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
