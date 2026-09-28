import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import { blogsAPI } from '../api.js';

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await blogsAPI.get(id);
        setBlog(res);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Chargement...</div>;
  if (!blog) return <div style={{ padding: '80px', textAlign: 'center' }}>Article non trouvé</div>;

  return (
    <div>
      <div style={{ background: 'var(--bg-secondary)', padding: '60px 0 40px', borderBottom: '1px solid rgba(45,106,79,0.06)' }}>
        <div className="container">
          <Link to="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, fontWeight: 500 }}>
            <ArrowLeft size={18} /> Retour aux actualités
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-muted)', marginBottom: 16, fontSize: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={16} /> {new Date(blog.created_at).toLocaleDateString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} /> {blog.author}
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.3, marginBottom: 24, maxWidth: 900 }}>
            {blog.title}
          </h1>
        </div>
      </div>
      
      <div className="container" style={{ padding: '60px 0 120px' }}>
        <div style={{ 
          maxWidth: 900, 
          margin: '0 auto', 
          background: 'var(--bg-card)', 
          padding: '48px', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(45, 106, 79, 0.06)'
        }}>
          {blog.image_url && (
            <img src={blog.image_url} alt={blog.title} style={{ width: '100%', borderRadius: 12, marginBottom: 32 }} />
          )}
          <div 
            style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
