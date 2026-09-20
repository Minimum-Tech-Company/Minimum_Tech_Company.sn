import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiTag, FiExternalLink } from 'react-icons/fi';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then(res => res.json())
      .then(setPost)
      .catch(() => {});
  }, [id]);

  if (!post) return (
    <div className="blog-hero">
      <h1>Article non trouvé</h1>
      <Link to="/blog" className="btn btn-primary" style={{ marginTop: '20px' }}>
        <FiArrowLeft /> Retour au blog
      </Link>
    </div>
  );

  return (
    <>
      <div className="blog-hero">
        <h1>{post.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.9rem', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiCalendar /> {new Date(post.created_at).toLocaleDateString('fr-FR')}
          </span>
          {post.tags && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiTag /> {post.tags}
            </span>
          )}
        </div>
      </div>

      <div className="blog-content">
        {post.image && (
          <img src={post.image} alt={post.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '32px', maxHeight: '400px', objectFit: 'cover' }} />
        )}
        <div className="blog-article">
          <div className="content">{post.content}</div>
        </div>
        {post.link && (
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '24px' }}>
            <FiExternalLink /> Voir la source externe
          </a>
        )}
        <div style={{ marginTop: '32px' }}>
          <Link to="/blog" className="card-link">
            <FiArrowLeft /> Retour au blog
          </Link>
        </div>
      </div>
    </>
  );
}
