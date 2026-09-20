import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiSave } from 'react-icons/fi';

export default function AdminCompany() {
  const { token } = useAuth();
  const [infos, setInfos] = useState([]);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/company', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(data => {
      setInfos(data);
      const formObj = {};
      data.forEach(info => { formObj[info.key] = info.value || ''; });
      setForm(formObj);
    });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      setStatus('saved');
      setTimeout(() => setStatus(''), 2000);
    } catch {
      setStatus('error');
    }
  };

  const labels = {
    company_name: 'Nom de l\'entreprise',
    company_tagline: 'Slogan',
    company_description: 'Description',
    company_email: 'Email de contact',
    company_phone: 'Téléphone',
    company_address: 'Adresse',
    company_website: 'Site web',
    about_text: 'Texte "À propos"',
    footer_text: 'Texte de footer',
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Informations de l'entreprise</h1>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={status === 'saving'}>
          <FiSave /> {status === 'saving' ? 'Sauvegarde...' : status === 'saved' ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          {infos.map(info => (
            <div key={info.key} className="form-group">
              <label>{labels[info.key] || info.key}</label>
              {info.key.includes('description') || info.key.includes('about_text') ? (
                <textarea
                  value={form[info.key] || ''}
                  onChange={e => setForm({...form, [info.key]: e.target.value})}
                  style={{ minHeight: '100px' }}
                />
              ) : (
                <input
                  value={form[info.key] || ''}
                  onChange={e => setForm({...form, [info.key]: e.target.value})}
                />
              )}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
