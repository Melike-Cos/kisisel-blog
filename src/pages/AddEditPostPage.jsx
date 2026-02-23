import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// DEĞİŞİKLİK: Servis yapısına geçiş
import * as blogService from '../api/blogService'; 
import { useAuth } from '../context/AuthContext';

const AddEditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setFetchLoading(true);
      const data = await blogService.getPostById(id);
      setTitle(data.name || data.title || '');
      setContent(data.description || data.content || '');
      setImageUrl(data.imageUrl || '');
    } catch (err) {
      setError('Yazı yüklenirken hata oluştu');
    } finally {
      setFetchLoading(false);
    }
  };

 // AddEditPostPage.jsx içindeki handleSubmit fonksiyonunu bu şekilde güncelle:

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik zorunludur');
      return;
    }

    const postData = {
      name: title,
      description: content,
      price: 1.99,
      stockQuantity: 1,
      categoryId: 10,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800'
    };

    try {
      setLoading(true);
      if (isEditMode) {
        // Güncelleme işlemi
        await blogService.updatePost(id, postData);
      } else {
        // Yeni yazı ekleme işlemi
        await blogService.createPost(postData);
      }
      
      // İşlem başarılı olduğunda yazı çıkarmadan doğrudan ana sayfaya yönlendir
      navigate('/'); 
      
    } catch (err) {
      setError(err.response?.status === 401 ? 'Oturum süreniz doldu' : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  if (fetchLoading) return <div className="loading-container"><div className="spinner"></div><p>Yükleniyor...</p></div>;

  return (
   <div className="add-edit-page">
      <div className="add-edit-container">
        <div className="add-edit-header">
          <h1>
            <span className="header-icon">✍️</span>
            {isEditMode ? 'Yazıyı Düzenle' : 'Yeni Yazılım Yazısı Ekle'}
          </h1>
          <p>Kodumun Dünyası'na yeni bir yazı ekliyorsunuz</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="add-edit-form">
          <div className="form-group">
            <label className="form-label">
              Yazı Başlığı <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📌</span>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: React.js ile Modern Web Uygulamaları"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Yazı İçeriği <span className="required">*</span>
            </label>
            <div className="textarea-wrapper">
              <span className="textarea-icon">📝</span>
              <textarea
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Yazılım hakkındaki düşüncelerinizi, deneyimlerinizi yazın..."
                rows="12"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Görsel URL <span className="optional">(Opsiyonel)</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🖼️</span>
              <input
                type="url"
                className="form-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/resim.jpg"
                disabled={loading}
              />
            </div>
            {imageUrl && (
              <div className="image-preview">
                <img 
                  src={imageUrl} 
                  alt="Önizleme" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800';
                  }} 
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/')} 
              disabled={loading}
            >
              <span className="button-icon">❌</span>
              İptal
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              <span className="button-icon">
                {loading ? '⏳' : (isEditMode ? '🔄' : '🚀')}
              </span>
              {loading ? 'Kaydediliyor...' : (isEditMode ? 'Güncelle' : 'Yayınla')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditPostPage;