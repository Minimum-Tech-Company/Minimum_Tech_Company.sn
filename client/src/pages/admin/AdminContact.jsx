import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiTrash2, FiCheck } from 'react-icons/fi';

export default function AdminContact() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    fetch('/api/admin/contact', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setMessages);
  };

  useEffect(() => { fetchMessages(); }, [token]);

  const markRead = async (id) => {
    await fetch(`/api/admin/contact/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    await fetch(`/api/admin/contact/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMessages();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Messages de contact</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(msg => (
          <div key={msg.id} className="card" style={{
            padding: '24px',
            borderLeft: msg.read ? '4px solid var(--border)' : '4px solid var(--primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{msg.name}</h3>
                <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{msg.email}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                </span>
                {!msg.read && (
                  <button className="btn btn-sm btn-success" onClick={() => markRead(msg.id)} title="Marquer comme lu">
                    <FiCheck />
                  </button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(msg.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
            {msg.subject && <p style={{ fontWeight: 600, marginBottom: '8px' }}>{msg.subject}</p>}
            <p style={{ color: 'var(--text-light)', lineHeight: 1.7 }}>{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
            Aucun message pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
