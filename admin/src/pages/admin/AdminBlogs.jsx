import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { blogsAPI } from '../../api.js';

export default function AdminBlogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await blogsAPI.list();
      setBlogs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await blogsAPI.delete(id);
        fetchBlogs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="text-2xl font-bold">Gestion des Blogs</h1>
        <Link to="/admin/blogs/create" className="btn btn-primary btn-sm">
          <Plus size={16} /> Nouveau Blog
        </Link>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: 12 }}>Titre</th>
              <th style={{ padding: 12 }}>Auteur</th>
              <th style={{ padding: 12 }}>Date</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              blogs.map(blog => (
                <tr key={blog.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: 12, fontWeight: 500 }}>{blog.title}</td>
                  <td style={{ padding: 12 }}>{blog.author}</td>
                  <td style={{ padding: 12, color: 'var(--text-muted)' }}>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: 12, textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Link to={`/admin/blogs/edit/${blog.id}`} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>
                      <Edit size={16} />
                    </Link>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(blog.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
