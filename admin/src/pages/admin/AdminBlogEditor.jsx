import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ArrowLeft, Save, Image as ImageIcon, UploadCloud, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { blogsAPI, uploadAPI } from '../../api.js';

export default function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    author: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin CRE', 
    image_url: '' 
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await blogsAPI.get(id);
          if (res) {
            setFormData({
              title: res.title || '',
              content: res.content || '',
              author: res.author || '',
              image_url: res.image_url || ''
            });
          }
        } catch (err) {
          console.error("Failed to fetch blog:", err);
          alert("Erreur lors du chargement de l'article");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    try {
      const res = await uploadAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload de l'image");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      alert('Veuillez uploader une image valide.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (id) {
        await blogsAPI.update(id, formData);
      } else {
        await blogsAPI.create(formData);
      }
      navigate('/admin/blogs');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du blog");
    } finally {
      setSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>;

  const inputStyle = {
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: '#f9f9fb',
    width: '100%',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/admin/blogs" className="btn btn-ghost" style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{id ? 'Modifier l\'article' : 'Créer un nouvel article'}</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={submitting} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Save size={18} /> {submitting ? 'Sauvegarde...' : 'Publier l\'article'}
        </button>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-secondary)' }}>Titre de l'article</label>
              <input 
                required 
                type="text" 
                name="title"
                style={{ ...inputStyle, fontSize: '1.15rem', fontWeight: 500 }}
                value={formData.title} 
                onChange={handleChange}
                placeholder="Ex: L'impact du changement climatique..."
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(var(--primary-rgb), 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.02)'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-secondary)' }}>Auteur</label>
              <input 
                required 
                type="text" 
                name="author"
                style={inputStyle}
                value={formData.author} 
                onChange={handleChange} 
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(var(--primary-rgb), 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.02)'; }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
              <ImageIcon size={18} /> Image de couverture
            </label>

            {!formData.image_url ? (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12
                }}
              >
                <UploadCloud size={40} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>Cliquez ou glissez une image ici</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>PNG, JPG, WEBP jusqu'à 5MB</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden', 
                  height: 240, 
                  width: '100%', 
                  background: '#f5f5f5', 
                  backgroundImage: `url(${formData.image_url})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }} />
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  className="btn btn-primary btn-sm"
                  style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', border: 'none' }}
                >
                  <Trash2 size={16} /> Changer l'image
                </button>
              </div>
            )}
            
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Ou coller directement l'URL d'une image :</p>
              <input 
                type="url" 
                name="image_url"
                style={inputStyle}
                value={formData.image_url} 
                onChange={handleChange} 
                placeholder="https://..." 
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(var(--primary-rgb), 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.02)'; }}
              />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', marginBottom: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Contenu de l'article</label>
            <div style={{ background: 'white', borderRadius: 'var(--radius-md)' }}>
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={handleContentChange} 
                modules={modules}
                style={{ height: '500px', marginBottom: '40px' }}
                placeholder="Rédigez le contenu de votre article ici... Vous pouvez ajouter des images, des titres, et formater le texte."
              />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
