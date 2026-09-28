import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import { blogsAPI } from '../api.js';

const CATEGORIES = ['Tous', 'Environnement', 'Santé', 'Changement Climatique', 'Déchets', 'Événements', 'Publications'];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogsAPI.list();
        setBlogs(res);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Simple pseudo-categorization logic based on keywords in title/content (since DB lacks category column)
  const getCategoryForBlog = (blog) => {
    const text = (blog.title + ' ' + blog.content).toLowerCase();
    if (text.includes('santé') || text.includes('health') || text.includes('covid')) return 'Santé';
    if (text.includes('climat')) return 'Changement Climatique';
    if (text.includes('déchet')) return 'Déchets';
    if (text.includes('séminaire') || text.includes('appel') || text.includes('événement')) return 'Événements';
    if (text.includes('publication') || text.includes('article') || text.includes('revue')) return 'Publications';
    return 'Environnement';
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || getCategoryForBlog(blog) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="hero" style={{ 
        minHeight: '40vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(rgba(15, 31, 23, 0.8), rgba(37, 129, 93, 0.7)), url("https://cre.dz/images/headers/10.jpg") center/cover',
        borderBottom: '4px solid var(--primary)',
        width: '100%'
      }}>
        <div className="hero-content" style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            marginBottom: '20px',
            fontWeight: 800,
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            lineHeight: 1.1,
            fontFamily: 'var(--font-display)'
          }}>
            Actualités <span style={{ color: 'var(--emerald-light)' }}>&</span> Blogs
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '1.2rem', 
            margin: '0 auto',
            lineHeight: 1.6,
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            maxWidth: '650px'
          }}>
            Restez informé des dernières avancées scientifiques, publications et événements majeurs du Centre de Recherche en Environnement.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 0', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        
        {/* Sidebar */}
        <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: 100 }}>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem' }}>
              <Search size={18} className="text-primary" /> Rechercher
            </h3>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Mots-clés..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: 8, padding: '10px 16px', background: '#f5f5f5', border: 'none', width: '100%' }}
            />
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem' }}>
              <Tag size={18} className="text-primary" /> Catégories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ 
                    padding: '8px 16px', 
                    textAlign: 'left', 
                    background: selectedCategory === cat ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: selectedCategory === cat ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>Chargement des articles...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Aucun article ne correspond à vos critères de recherche.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {blog.image_url && (
                    <div style={{ height: 220, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${blog.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease' }} />
                      <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {getCategoryForBlog(blog)}
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <User size={14} className="text-primary" /> <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{blog.author}</span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={14} /> {new Date(blog.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{ marginBottom: 12, fontSize: '1.35rem', lineHeight: 1.3 }}>
                      <Link to={`/blog/${blog.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{blog.title}</Link>
                    </h3>
                    <div 
                      style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                      dangerouslySetInnerHTML={{ __html: blog.content.replace(/<[^>]+>/g, '') }}
                    />
                    <Link to={`/blog/${blog.id}`} style={{ alignSelf: 'flex-start', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                      Lire l'article <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
