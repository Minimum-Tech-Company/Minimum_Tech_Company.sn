import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCode, FiCpu, FiGlobe, FiShield, FiBarChart2, FiBookOpen } from 'react-icons/fi';

const iconMap = {
  FiCode: <FiCode />,
  FiCpu: <FiCpu />,
  FiGlobe: <FiGlobe />,
  FiShield: <FiShield />,
  FiBriefcase: <FiCode />,
  FiBarChart2: <FiBarChart2 />,
  FiBookOpen: <FiBookOpen />,
};

export default function Home() {
  const [hero, setHero] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [company, setCompany] = useState({});

  useEffect(() => {
    Promise.all([
      fetch('/api/hero').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/company').then(r => r.json()),
    ]).then(([h, s, p, c]) => {
      setHero(h);
      setServices(s.slice(0, 3));
      setProjects(p.slice(0, 3));
      setCompany(c);
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Innovation Technologique</div>
          <h1>
            {hero?.title || 'Transformez votre vision en '}
            <span className="gradient-text">
              {hero?.subtitle || 'réalité numérique'}
            </span>
          </h1>
          <p>{hero?.description || company.company_description || 'Nous concevons des solutions numériques sur mesure pour propulser votre entreprise vers le succès.'}</p>
          <div className="hero-cta">
            <Link to={hero?.cta_link || '/services'} className="btn btn-primary">
              {hero?.cta_text || 'Découvrir nos services'} <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Nos Services</h2>
            <p>Des solutions complètes pour tous vos besoins technologiques</p>
          </div>
          <div className="card-grid">
            {services.map((service, i) => (
              <div key={service.id} className="card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="card-body">
                  <div className="card-icon">
                    {iconMap[service.icon] || <FiCode />}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {service.link && (
                    <a href={service.link} target="_blank" rel="noopener noreferrer" className="card-link">
                      En savoir plus <FiArrowRight />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {services.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/services" className="btn btn-outline">
                Voir tous les services <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>À propos de Minimum Tech</h2>
              <p>{company.about_text || 'Nous sommes une entreprise technologique dédiée à l\'innovation et à l\'excellence. Nous transformons vos idées en solutions numériques performantes.'}</p>
              <p>Notre équipe d'experts travaille avec passion pour offrir des résultats exceptionnels à chaque projet.</p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '24px' }}>
                Parlons de votre projet <FiArrowRight />
              </Link>
            </div>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Projets réalisés</div>
              </div>
              <div className="stat">
                <div className="stat-number">30+</div>
                <div className="stat-label">Clients satisfaits</div>
              </div>
              <div className="stat">
                <div className="stat-number">5+</div>
                <div className="stat-label">Années d'expérience</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Nos Réalisations</h2>
            <p>Découvrez les projets que nous avons réalisés avec succès</p>
          </div>
          <div className="card-grid">
            {projects.map((project, i) => (
              <div key={project.id} className="card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {project.image && <img src={project.image} alt={project.title} className="card-image" />}
                {!project.image && <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '3rem' }}>🚀</div>}
                <div className="card-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.tech_stack && (
                    <div className="card-tags">
                      {project.tech_stack.split(',').map((t, j) => (
                        <span key={j} className="tag">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="card-link">
                      Voir le projet <FiArrowRight />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {projects.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/realisations" className="btn btn-outline">
                Voir toutes les réalisations <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Prêt à démarrer votre projet ?</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>
            Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir une solution sur mesure.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
            Démarrer un projet <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
