import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [company, setCompany] = useState({});

  useEffect(() => {
    fetch('/api/company')
      .then(res => res.json())
      .then(setCompany)
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Minimum<span>Tech</span></h3>
          <p>{company.company_description || 'Solutions technologiques innovantes pour votre entreprise.'}</p>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <Link to="/services">Services</Link>
          <Link to="/realisations">Réalisations</Link>
          <Link to="/futurs-projets">Projets futurs</Link>
          <Link to="/blog">Blog</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href={`mailto:${company.company_email}`}>{company.company_email || 'contact@minimumtech.com'}</a>
          <a href={`tel:${company.company_phone}`}>{company.company_phone || '+243 000 000 000'}</a>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>{company.company_address || 'Kinshasa, RDC'}</p>
        </div>
        <div className="footer-col">
          <h4>Légal</h4>
          <Link to="/contact">Politique de confidentialité</Link>
          <Link to="/contact">Conditions d'utilisation</Link>
        </div>
      </div>
      <div className="footer-bottom">
        {company.footer_text || '© 2024 Minimum Tech. Tous droits réservés.'}
      </div>
    </footer>
  );
}
