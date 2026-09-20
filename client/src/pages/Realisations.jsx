import { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function Realisations() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="blog-hero">
        <h1>Nos Réalisations</h1>
        <p>Découvrez les projets que nous avons menés à bien</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {projects.map((project, i) => (
              <div key={project.id} className="card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {project.image && <img src={project.image} alt={project.title} className="card-image" />}
                {!project.image && <div className="card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '3rem' }}>🚀</div>}
                <div className="card-body">
                  <span className="tag" style={{ marginBottom: '12px', display: 'inline-block' }}>{project.category}</span>
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
          {projects.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
              Aucune réalisation disponible pour le moment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
