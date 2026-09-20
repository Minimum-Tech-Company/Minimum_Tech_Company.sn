import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function AdminServices() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'FiBriefcase', link: '', display_order: 0, active: 1 });

  const fetchServices = () => {
    fetch('/api/admin/services', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setServices);
  };

  useEffect(() => { fetchServices(); }, [token]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', description: '', icon: 'FiBriefcase', link: '', display_order: 0, active: 1 });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, icon: s.icon, link: s.link || '', display_order: s.display_order, active: s.active });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/services/${editing.id}` : '/api/admin/services';
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setShowModal(false);
    fetchServices();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce service ?')) return;
    await fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchServices();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Services</h1>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Ajouter</button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Lien</th>
              <th>Ordre</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.title}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</td>
                <td>{s.link && <a href={s.link} target="_blank" rel="noopener noreferrer"><FiExternalLink /></a>}</td>
                <td>{s.display_order}</td>
                <td>{s.active ? '✅' : '❌'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(s)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}><FiTrash2 /></button>
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
              <h2>{editing ? 'Modifier' : 'Ajouter'} un service</h2>
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
                  <label>Icone (nom React Icons)</label>
                  <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="FiBriefcase" />
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
