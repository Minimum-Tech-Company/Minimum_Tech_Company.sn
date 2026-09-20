import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function AdminProjects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'realisation', link: '', tech_stack: '', display_order: 0, active: 1 });

  const fetchProjects = () => {
    fetch('/api/admin/projects', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setProjects);
  };

  useEffect(() => { fetchProjects(); }, [token]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: 'realisation', link: '', tech_stack: '', display_order: 0, active: 1 });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, category: p.category, link: p.link || '', tech_stack: p.tech_stack || '', display_order: p.display_order, active: p.active });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/projects/${editing.id}` : '/api/admin/projects';
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setShowModal(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProjects();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Réalisations</h1>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Ajouter</button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Technologies</th>
              <th>Lien</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td><span className="tag">{p.category}</span></td>
                <td>{p.tech_stack}</td>
                <td>{p.link && <a href={p.link} target="_blank" rel="noopener noreferrer"><FiExternalLink /></a>}</td>
                <td>{p.active ? '✅' : '❌'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Modifier' : 'Ajouter'} une réalisation</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Catégorie</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="realisation">Réalisation</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="collaboration">Collaboration</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Technologies (séparées par virgule)</label>
                  <input value={form.tech_stack} onChange={e => setForm({...form, tech_stack: e.target.value})} placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="form-group">
                  <label>Lien externe</label>
                  <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Ordre d'affichage</label>
                  <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Actif</label>
                  <select value={form.active} onChange={e => setForm({...form, active: parseInt(e.target.value)})}>
                    <option value={1}>Oui</option>
                    <option value={0}>Non</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
