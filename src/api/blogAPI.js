const API_URL = 'http://localhost:5001/api';

// Token'ı localStorage'dan al
const getToken = () => localStorage.getItem('token');

// Tüm yazıları getir
export const getPosts = async () => {
  try {
    console.log('📡 API isteği: GET /products');
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Gelen veri:', data);
    
    // API formatı: { success: true, data: { items: [...] } }
    if (data && data.success && data.data && data.data.items) {
      return data.data.items;
    }
    else if (Array.isArray(data)) {
      return data;
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ getPosts hatası:', error);
    return [];
  }
};

// Tek yazı getir
export const getPostById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Yazı bulunamadı');
    }
    
    const data = await response.json();
    
    if (data && data.success && data.data) {
      return data.data;
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ getPostById hatası:', error);
    throw error;
  }
};

// Yeni yazı ekle
export const createPost = async (postData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }
    
    console.log('📝 Gelen postData:', postData);
    
    // API'nin beklediği format - Price 0'dan büyük olmalı!
    const apiData = {
      name: postData.name,
      description: postData.description,
      price: postData.price || 1.99,     // 0'dan büyük olsun
      stockQuantity: postData.stockQuantity || 1,
      categoryId: postData.categoryId || 10,
      imageUrl: postData.imageUrl
    };
    
    console.log('📦 API\'ye gönderilen:', apiData);
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(apiData)
    });
    
    console.log('📡 API yanıt kodu:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Hata detayı:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
      }
      
      throw new Error(`Hata ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Yazı eklendi:', data);
    
    return data.data || data;
    
  } catch (error) {
    console.error('❌ createPost hatası:', error);
    throw error;
  }
};
// Giriş yap - DÜZELTİLDİ!
export const login = async (email, password) => {
  try {
    console.log('🔑 Giriş deneniyor:', email);
    
    // API'nin beklediği format
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email,
        password: password 
      })
    });
    
    console.log('📡 Giriş yanıt kodu:', response.status);
    
    if (!response.ok) {
      throw new Error('Giriş başarısız');
    }
    
    const data = await response.json();
    console.log('✅ Giriş başarılı:', data);
    
    // Token'ı bul
    let token = null;
    if (data && data.data && data.data.token) {
      token = data.data.token;
    } else if (data && data.token) {
      token = data.token;
    }
    
    if (!token) {
      throw new Error('Token alınamadı');
    }
    
    // Token'ı kaydet
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ 
      email: email, 
      role: 'Admin' 
    }));
    
    return {
      success: true,
      token: token,
      user: { email: email, role: 'Admin' }
    };
    
  } catch (error) {
    console.error('❌ login hatası:', error);
    return { 
      success: false, 
      error: 'Hatalı email veya şifre' 
    };
  }
};

// Yazı güncelle - DÜZELTİLDİ!
export const updatePost = async (id, postData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    }
    
    console.log(`📝 Yazı güncelleniyor ID:${id}:`, postData);
    
    // API'nin beklediği format (createPost ile aynı!)
    const apiData = {
      name: postData.name,
      description: postData.description,
      price: postData.price || 1.99,     // 0'dan büyük olmalı
      stockQuantity: postData.stockQuantity || 1,
      categoryId: postData.categoryId || 10,
      imageUrl: postData.imageUrl
    };
    
    console.log('📦 API\'ye gönderilen:', apiData);
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(apiData)
    });
    
    console.log('📡 API yanıt kodu:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Hata detayı:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
      }
      
      if (response.status === 404) {
        throw new Error('Yazı bulunamadı');
      }
      
      throw new Error(`Hata ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Yazı güncellendi:', data);
    
    return data.data || data;
    
  } catch (error) {
    console.error('❌ updatePost hatası:', error);
    throw error;
  }
};

// Yazı sil
export const deletePost = async (id) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Silme başarısız');
    return true;
    
  } catch (error) {
    console.error('❌ deletePost hatası:', error);
    throw error;
  }
};