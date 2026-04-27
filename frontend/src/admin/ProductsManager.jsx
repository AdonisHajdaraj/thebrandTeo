// admin/ProductsManager.jsx - Me Upload Foto në vend të Linkut
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

const ProductsManager = ({ onRefresh }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Mbrëmje',
    price: '',
    rent_price: '',
    original_price: '',
    stock: '',
    description: '',
    image: '',
    badge: '',
    in_stock: true
  });

  const categories = ['Mbrëmje', 'Dasme', 'Casual'];
  const badges = ['', 'New', 'Sale', 'Limited', 'Trending', 'Best Seller'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  // Funksioni për upload foto në Supabase Storage
  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gabim gjatë ngarkimit të fotos!');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Ju lutem zgjidhni një foto!');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Foto duhet të jetë më e vogël se 5MB!');
      return;
    }
    
    // Krijo preview lokal
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload foto dhe merr URL
    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Ju lutem plotësoni fushat e detyrueshme!');
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      rent_price: formData.rent_price ? parseFloat(formData.rent_price) : null,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock: parseInt(formData.stock),
      description: formData.description || null,
      image: formData.image || null,
      badge: formData.badge || null,
      in_stock: formData.in_stock
    };

    try {
      if (editingProduct) {
        await supabase.from('products').update(productData).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert([productData]);
      }
      
      fetchProducts();
      if (onRefresh) onRefresh();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gabim gjatë ruajtjes së produktit!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeni të sigurt që doni të fshini këtë produkt?')) return;
    
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gabim gjatë fshirjes së produktit!');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      rent_price: product.rent_price || '',
      original_price: product.original_price || '',
      stock: product.stock,
      description: product.description || '',
      image: product.image || '',
      badge: product.badge || '',
      in_stock: product.in_stock
    });
    setImagePreview(product.image || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({
      name: '',
      category: 'Mbrëmje',
      price: '',
      rent_price: '',
      original_price: '',
      stock: '',
      description: '',
      image: '',
      badge: '',
      in_stock: true
    });
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Në pritje', class: 'status-pending' },
      processing: { label: 'Në proces', class: 'status-processing' },
      completed: { label: 'Përfunduar', class: 'status-completed' },
      cancelled: { label: 'Anuluar', class: 'status-cancelled' },
      in_progress: { label: 'Në punim', class: 'status-processing' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Produktet</h1>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <span>+</span> Shto Produkt
        </button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Kërko produkt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Duke u ngarkuar...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image && <img src={product.image} alt={product.name} />}
                {product.badge && <span className="badge">{product.badge}</span>}
                {!product.in_stock && <span className="out-of-stock">Pa stok</span>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="stock">Stok: {product.stock}</p>
                <div className="price">
                  <span className="current">€{product.price}</span>
                  {product.original_price && (
                    <span className="original">€{product.original_price}</span>
                  )}
                </div>
                {product.rent_price && (
                  <div className="rent-label">
                    Rent: €{product.rent_price}
                  </div>
                )}
                <div className="actions">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>✏️</button>
                  <button className="btn-delete" onClick={() => handleDelete(product.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Dizajni origjinal i ruajtur */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Ndrysho Produktin' : 'Shto Produkt të Ri'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Emri i produktit</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Shkruaj emrin"
                  />
                </div>
                
                <div className="form-group">
                  <label>Kategoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Çmimi (€)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="189"
                  />
                </div>
                
                <div className="form-group">
                  <label>Çmimi për rent (€)</label>
                  <input
                    type="number"
                    value={formData.rent_price}
                    onChange={(e) => setFormData({...formData, rent_price: e.target.value})}
                    placeholder="79"
                  />
                </div>
                
                <div className="form-group">
                  <label>Çmimi origjinal (opsional)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                    placeholder="249"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="10"
                  />
                </div>
                
                <div className="form-group">
                  <label>Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  >
                    {badges.map(badge => (
                      <option key={badge} value={badge}>{badge || 'Asnjë'}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Fusha e re për Upload Foto - Zëvendëson URL e fotos */}
              <div className="form-group">
                <label>Foto e produktit</label>
                <div className="image-upload-container">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <div className="image-preview-actions">
                        <button 
                          type="button" 
                          className="btn-change-image"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Ndrysho foton
                        </button>
                        <button 
                          type="button" 
                          className="btn-remove-image"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({...formData, image: ''});
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          Hiq foton
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="upload-icon">📸</span>
                      <span className="upload-text">Kliko për të ngarkuar foto</span>
                      <span className="upload-hint">PNG, JPG deri në 5MB</span>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="uploading-status">
                      <div className="loader-small"></div>
                      <span>Duke u ngarkuar...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label>Përshkrimi</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Përshkrimi i produktit..."
                />
              </div>
              
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                  />
                  Në stok
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Anulo
                </button>
                <button type="submit" className="btn-save" disabled={uploading}>
                  {editingProduct ? 'Ruaj Ndryshimet' : 'Shto Produktin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;