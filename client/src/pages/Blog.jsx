import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiTag } from 'react-icons/fi';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(setPosts)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="blog-hero">
        <h1>Blog & Recherches</h1>
        <p>Explorez nos articles sur les dernières innovations technologiques</p>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {posts.map((post, i) => (
              <div key={post.id} className="card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {post.image && <img src={post.image} alt={post.title} className="card-image" />}
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiCalendar /> {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    {post.tags && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiTag /> {post.tags}
                      </span>
                    )}
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt || post.content.substring(0, 200) + '...'}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <Link to={`/blog/${post.id}`} className="card-link">
                      Lire l'article <FiArrowRight />
                    </Link>
                    {post.link && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="card-link" style={{ color: 'var(--accent)' }}>
                        Source externe <FiArrowRight />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {posts.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
              Aucun article disponible pour le moment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
