import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/services', label: 'Services' },
    { to: '/realisations', label: 'Réalisations' },
    { to: '/futurs-projets', label: 'Projets' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Minimum<span>Tech</span>
        </Link>
        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
