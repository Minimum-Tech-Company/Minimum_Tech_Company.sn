import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminHero() {
  const { token } = useAuth();
  const [heroes, setHeroes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', cta_text: 'Découvrir', cta_link: '/services', active: 1 });

  const fetchHeroes = () => {
    fetch('/api/admin/hero', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setHeroes);
  };

  useEffect(() => { fetchHeroes(); }, [token]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', subtitle: '', description: '', cta_text: 'Découvrir', cta_link: '/services', active: 1 });
    setShowModal(true);
  };

  const openEdit = (h) => {
    setEditing(h);
    setForm({ title: h.title, subtitle: h.subtitle || '', description: h.description || '', cta_text: h.cta_text || 'Découvrir', cta_link: h.cta_link || '/services', active: h.active });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/hero/${editing.id}` : '/api/admin/hero';
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setShowModal(false);
    fetchHeroes();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce hero ?')) return;
    await fetch(`/api/admin/hero/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchHeroes();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Hero Banner</h1>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Ajouter</button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Sous-titre</th>
              <th>Bouton</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {heroes.map(h => (
              <tr key={h.id}>
                <td style={{ fontWeight: 600 }}>{h.title}</td>
                <td>{h.subtitle}</td>
                <td>{h.cta_text}</td>
                <td>{h.active ? '✅' : '❌'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(h)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(h.id)}><FiTrash2 /></button>
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
              <h2>{editing ? 'Modifier' : 'Ajouter'} un hero</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre principal</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Sous-titre</label>
                  <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Texte du bouton</label>
                  <input value={form.cta_text} onChange={e => setForm({...form, cta_text: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Lien du bouton</label>
                  <input value={form.cta_link} onChange={e => setForm({...form, cta_link: e.target.value})} />
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
