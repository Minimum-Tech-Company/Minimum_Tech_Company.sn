import { useEffect, useState } from 'react';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

export default function FutursProjets() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/future-projects')
      .then(res => res.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="blog-hero">
        <h1>Projets Futurs</h1>
        <p>Découvrez les innovations que nous préparons</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {projects.map((project, i) => (
              <div key={project.id} className="card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {project.image && <img src={project.image} alt={project.title} className="card-image" />}
                {!project.image && <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '3rem' }}>🔮</div>}
                <div className="card-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.expected_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <FiCalendar /> Prévu pour {project.expected_date}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="card-link">
                      En savoir plus <FiArrowRight />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
              Aucun projet futur annoncé pour le moment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
