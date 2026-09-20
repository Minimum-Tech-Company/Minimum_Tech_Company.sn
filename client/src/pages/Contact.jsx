import { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function Contact() {
  const [company, setCompany] = useState({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/company')
      .then(res => res.json())
      .then(setCompany)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <div className="blog-hero">
        <h1>Contact</h1>
        <p>Nous sommes à votre écoute. N'hésitez pas à nous contacter.</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '32px' }}>Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                    placeholder="Votre nom"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Sujet</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    placeholder="Sujet du message"
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    required
                    placeholder="Votre message..."
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                  <FiSend /> {status === 'sending' ? 'Envoi...' : status === 'sent' ? 'Envoyé !' : 'Envoyer'}
                </button>
                {status === 'error' && <p style={{ color: 'var(--danger)', marginTop: '12px' }}>Erreur lors de l'envoi.</p>}
              </form>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '32px' }}>Nos coordonnées</h2>
              <div className="contact-info-item">
                <div className="contact-info-icon"><FiMail /></div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>Email</h4>
                  <a href={`mailto:${company.company_email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {company.company_email || 'contact@minimumtech.com'}
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon"><FiPhone /></div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>Téléphone</h4>
                  <a href={`tel:${company.company_phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {company.company_phone || '+243 000 000 000'}
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon"><FiMapPin /></div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>Adresse</h4>
                  <p style={{ color: 'var(--text-light)' }}>{company.company_address || 'Kinshasa, RDC'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
