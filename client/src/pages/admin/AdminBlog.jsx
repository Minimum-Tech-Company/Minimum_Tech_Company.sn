import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiEye } from 'react-icons/fi';

export default function AdminBlog() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', tags: '', link: '', published: 0, display_order: 0 });

  const fetchPosts = () => {
    fetch('/api/admin/blog', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setPosts);
  };

  useEffect(() => { fetchPosts(); }, [token]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', content: '', excerpt: '', tags: '', link: '', published: 0, display_order: 0 });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ title: p.title, content: p.content, excerpt: p.excerpt || '', tags: p.tags || '', link: p.link || '', published: p.published, display_order: p.display_order });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setShowModal(false);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch(`/api/admin/blog/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchPosts();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Blog</h1>
        <button className="btn btn-primary" onClick={openNew}><FiPlus /> Nouvel article</button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Tags</th>
              <th>Publié</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td>{p.tags}</td>
                <td>{p.published ? '✅' : '❌'}</td>
                <td>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}><FiEdit2 /></button>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline"><FiExternalLink /></a>}
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>{editing ? 'Modifier' : 'Nouvel'} article</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Extrait (optionnel)</label>
                  <input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Résumé court de l'article" />
                </div>
                <div className="form-group">
                  <label>Contenu</label>
                  <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} required style={{ minHeight: '200px' }} />
                </div>
                <div className="form-group">
                  <label>Tags (séparés par virgule)</label>
                  <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="IA, Machine Learning, Web" />
                </div>
                <div className="form-group">
                  <label>Lien source externe</label>
                  <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Publié</label>
                  <select value={form.published} onChange={e => setForm({...form, published: parseInt(e.target.value)})}>
                    <option value={0}>Brouillon</option>
                    <option value={1}>Publié</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ordre d'affichage</label>
                  <input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value)})} />
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
