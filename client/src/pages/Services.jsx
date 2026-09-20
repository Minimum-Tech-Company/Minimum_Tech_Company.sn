import { useEffect, useState } from 'react';
import { FiArrowRight, FiCode, FiCpu, FiGlobe, FiShield } from 'react-icons/fi';

const iconMap = {
  FiCode: <FiCode />,
  FiCpu: <FiCpu />,
  FiGlobe: <FiGlobe />,
  FiShield: <FiShield />,
  FiBriefcase: <FiCode />,
};

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(setServices)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="blog-hero">
        <h1>Nos Services</h1>
        <p>Des solutions technologiques complètes pour propulser votre entreprise</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {services.map((service, i) => (
              <div key={service.id} className="card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {service.image && <img src={service.image} alt={service.title} className="card-image" />}
                <div className="card-body">
                  <div className="card-icon">
                    {iconMap[service.icon] || <FiCode />}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {service.link && (
                    <a href={service.link} target="_blank" rel="noopener noreferrer" className="card-link">
                      Voir plus <FiArrowRight />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {services.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
              Aucun service disponible pour le moment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
