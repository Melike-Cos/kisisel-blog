import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as blogService from '../api/blogService'; 
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Geçersiz yazı ID\'si');
      setLoading(false);
      return;
    }
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPostById(id);
      setPost(data);
      setError(null);
    } catch (err) {
      setError('Yazı yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;

    try {
      setDeleteLoading(true);
      await blogService.deletePost(id);
      navigate('/');
    } catch (err) {
      alert('Yazı silinirken bir hata oluştu');
      setDeleteLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <p>{error || 'Yazı bulunamadı'}</p>
        <Link to="/">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const title = post.name || post.title || 'Başlıksız Yazı';
  const content = post.description || post.content || '';
  const imageUrl = post.imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800';

  return (
    <div className="post-detail">
      {}
      {isAdmin() && (
        <div className="admin-actions">
          <Link to={`/edit-post/${id}`} className="edit-button">✏️ Düzenle</Link>
          <button onClick={handleDelete} className="delete-button" disabled={deleteLoading}>
            {deleteLoading ? 'Siliniyor...' : '🗑️ Sil'}
          </button>
        </div>
      )}
      <article className="post-article">
        <h1>{title}</h1>
        <div className="post-meta"><span>✍️ Admin</span></div>
        <img src={imageUrl} alt={title} className="post-image-large" />
        <div className="post-content-text">
          {content.split('\n').map((p, i) => <p key={i}>{p || <br />}</p>)}
        </div>
      </article>
    </div>
  );
};

export default PostDetailPage;