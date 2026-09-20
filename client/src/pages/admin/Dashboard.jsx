import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiFolder, FiClock, FiFileText, FiMessageSquare } from 'react-icons/fi';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStats)
      .catch(() => {});
  }, [token]);

  if (!stats) return <p>Chargement...</p>;

  const items = [
    { label: 'Services', value: stats.services, icon: <FiBriefcase />, color: '#2563eb' },
    { label: 'Réalisations', value: stats.projects, icon: <FiFolder />, color: '#06b6d4' },
    { label: 'Projets futurs', value: stats.futureProjects, icon: <FiClock />, color: '#8b5cf6' },
    { label: 'Articles blog', value: stats.blogPosts, icon: <FiFileText />, color: '#10b981' },
    { label: 'Messages', value: stats.messages, icon: <FiMessageSquare />, color: '#f59e0b' },
    { label: 'Messages non lus', value: stats.unreadMessages, icon: <FiMessageSquare />, color: '#ef4444' },
  ];

  return (
    <div>
      <div className="admin-header">
        <h1>Tableau de bord</h1>
      </div>

      <div className="admin-stats">
        {items.map((item, i) => (
          <div key={i} className="admin-stat">
            <h3>{item.label}</h3>
            <div className="number" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Bienvenue, Admin !</h2>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.7 }}>
          Utilisez le menu latéral pour gérer le contenu de votre site.
          Vous pouvez ajouter, modifier ou supprimer des services, projets, articles de blog, et bien plus encore.
          Toutes les modifications sont sauvegardées automatiquement.
        </p>
      </div>
    </div>
  );
}
