import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiBriefcase, FiFolder, FiClock, FiFileText,
  FiImage, FiSettings, FiMessageSquare, FiLogOut, FiMenu
} from 'react-icons/fi';

const navItems = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', exact: true },
  { to: '/admin/services', icon: <FiBriefcase />, label: 'Services' },
  { to: '/admin/projects', icon: <FiFolder />, label: 'Réalisations' },
  { to: '/admin/future-projects', icon: <FiClock />, label: 'Projets futurs' },
  { to: '/admin/blog', icon: <FiFileText />, label: 'Blog' },
  { to: '/admin/hero', icon: <FiImage />, label: 'Hero Banner' },
  { to: '/admin/company', icon: <FiSettings />, label: 'Entreprise' },
  { to: '/admin/contact', icon: <FiMessageSquare />, label: 'Messages' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          Minimum<span>Tech</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to || (item.exact && location.pathname === '/admin') ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer">
            🌐 Voir le site
          </a>
        </nav>
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>{user?.email}</p>
          <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <FiLogOut /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <button
          className="menu-toggle"
          style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 101, background: 'var(--bg)', padding: '8px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
