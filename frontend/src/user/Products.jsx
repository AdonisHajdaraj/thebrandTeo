// Products.jsx - Me fetch direkt që funksionon me proxy
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Products.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRentProduct, setSelectedRentProduct] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const isProd = import.meta.env.PROD;
        
        const url = isProd
          ? '/api/products'
          : 'https://jscyzysifxtsrhvsapao.supabase.co/rest/v1/products?select=*&order=created_at.desc';
        
        const anonKey = 'sb_publishable_nuYKr0Oa32fwnHNO_U13kQ_bt1CMh6f';
        
        const response = await fetch(url, {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        const transformed = data.map(p => ({
          ...p,
          inStock: p.in_stock === true,
          originalPrice: p.original_price || null,
          rentPrice: p.rent_price || null,
          availableForRent: p.rent_price && p.in_stock === true
        }));
        
        setProducts(transformed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', label: 'Të gjitha' },
    { id: 'Dasme', label: 'Dasma' },
    { id: 'Mbrëmje', label: 'Mbrëmje' },
    { id: 'Casual', label: 'Casual' }
  ];

  const filteredProducts = products.filter((product) => {
    if (filterCategory !== 'all' && product.category !== filterCategory) return false;
    if (filterType === 'rent' && !product.availableForRent) return false;
    if (filterType === 'buy' && !product.inStock) return false;
    if (searchTerm && !product.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts];

  if (sortBy === 'price-asc') {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-desc') {
    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === 'name') {
    sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortBy === 'rent-asc') {
    sortedProducts.sort((a, b) => (a.rentPrice || 9999) - (b.rentPrice || 9999));
  }

  const getProductPrice = (product, type) => {
    if (type === 'rent' && product.rentPrice) return product.rentPrice;
    return product.price;
  };

  const handleAddToCart = (product, type) => {
    const price = getProductPrice(product, type);
    const productWithDefaults = {
      ...product,
      size: product.size || 'M',
      color: product.color || 'E zezë',
      price,
      originalPrice: product.originalPrice,
      orderType: type
    };
    addToCart(productWithDefaults, type);
    
    if (type === 'rent') {
      setShowRentModal(false);
      setSelectedRentProduct(null);
    }
    
    navigate('/cart');
  };

  const handleRentClick = (product) => {
    setSelectedRentProduct(product);
    setShowRentModal(true);
  };

  if (loading) {
    return (
      <div className="products-page">
        <Sidebar />
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Duke ngarkuar koleksionin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <Sidebar />
        <div className="error-container">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <h3>Diçka shkoi gabim</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Provo përsëri
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Sidebar />

      {/* Hero Section - E thjeshtë */}
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-title">
            Koleksioni <span className="title-accent">TEO</span>
          </h1>
          <p className="products-description">
            Zbuloni fustanet më të bukura për çdo rast
          </p>
        </div>
      </section>

      <section className="products-main-section">
        <div className="products-container">
          {/* Filters - Modern Style */}
          <div className="filters-section">
            {/* Search Bar - Full Width */}
            <div className="search-row">
              <div className="search-box-modern">
                <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Kërko fustan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
                )}
              </div>
            </div>

            {/* Filter Chips Row */}
            <div className="filter-chips-row">
              {/* Category Scroll */}
              <div className="chips-scroll">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`chip ${filterCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setFilterCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort Select */}
              <select
                className="sort-select-chip"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Rendit</option>
                <option value="name">A-Z</option>
                <option value="price-asc">Çmimi ↑</option>
                <option value="price-desc">Çmimi ↓</option>
                <option value="rent-asc">Rent ↑</option>
              </select>
            </div>

            {/* Type Toggle */}
            <div className="type-toggle-row">
              <button
                className={`toggle-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                Të gjitha
              </button>
              <button
                className={`toggle-btn ${filterType === 'buy' ? 'active' : ''}`}
                onClick={() => setFilterType('buy')}
              >
                Blerje
              </button>
              <button
                className={`toggle-btn ${filterType === 'rent' ? 'active' : ''}`}
                onClick={() => setFilterType('rent')}
              >
                Rent
              </button>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="no-results">
              <div className="no-results-card">
                <span className="no-results-illustration">🔍</span>
                <h3>Asnjë fustan nuk u gjet</h3>
                <p>Provoni të ndryshoni filtrat</p>
                <button onClick={() => { setFilterCategory('all'); setFilterType('all'); setSearchTerm(''); }}>
                  Shiko të gjitha
                </button>
              </div>
            </div>
          ) : (
            <div className="products-grid-premium">
              {sortedProducts.map((product, index) => {
                const isInStock = product.in_stock === true || product.inStock === true;
                
                return (
                  <article
                    key={product.id}
                    className="product-card"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    {/* Image */}
                    <div className="product-card-image" onClick={() => handleAddToCart(product, 'standard')}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="image-placeholder">👗</div>
                      )}
                      
                      {/* Badges */}
                      <div className="card-badges">
                        {product.availableForRent && (
                          <span className="badge-rent-chip">Rent</span>
                        )}
                        {product.badge && (
                          <span className="badge-special-chip">{product.badge}</span>
                        )}
                      </div>

                      {/* Out of Stock */}
                      {!isInStock && (
                        <div className="out-of-stock-badge">Pa stok</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="product-card-info">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="product-category-tag">{product.category}</span>
                      
                      <div className="product-prices">
                        <span className="price-buy">€{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="price-old">€{product.originalPrice}</span>
                        )}
                        {product.availableForRent && (
                          <span className="price-rent">Rent €{product.rentPrice}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="product-card-actions">
                      <button
                        className="btn-add-cart"
                        onClick={() => handleAddToCart(product, 'standard')}
                        disabled={!isInStock}
                      >
                        Shto në shportë
                      </button>
                      {product.availableForRent && (
                        <button
                          className="btn-rent"
                          onClick={() => handleRentClick(product)}
                        >
                          Rent
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Rent Modal */}
      {showRentModal && selectedRentProduct && (
        <div className="modal-overlay" onClick={() => setShowRentModal(false)}>
          <div className="rent-modal-premium" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowRentModal(false)}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            
            <div className="rent-modal-layout">
              <div className="rent-modal-image">
                <div className="rent-image-wrapper">
                  <img src={selectedRentProduct.image} alt={selectedRentProduct.name} />
                  <div className="rent-image-badge">
                    <span>📋 Rent</span>
                  </div>
                </div>
              </div>

              <div className="rent-modal-details">
                <span className="rent-category-badge">{selectedRentProduct.category}</span>
                <h2>{selectedRentProduct.name}</h2>
                <p className="rent-modal-desc">{selectedRentProduct.description}</p>

                <div className="rent-pricing-box">
                  <div className="rent-price-main">
                    <span className="rent-price-big">€{selectedRentProduct.rentPrice}</span>
                    <span className="rent-price-label">çmimi i qirasë</span>
                  </div>
                  <div className="rent-compare">
                    <span>Blerje: €{selectedRentProduct.price}</span>
                    <span className="rent-save">
                      Kurseni {(100 - Math.round((selectedRentProduct.rentPrice / selectedRentProduct.price) * 100))}%
                    </span>
                  </div>
                </div>

                <div className="rent-benefits-box">
                  <h4>✨ Çfarë përfshihet</h4>
                  <div className="benefits-grid">
                    <div className="benefit-item"><span>🧹</span> Pastrim profesional</div>
                    <div className="benefit-item"><span>👗</span> Mirëmbajtje</div>
                    <div className="benefit-item"><span>🛡️</span> Sigurim bazë</div>
                    <div className="benefit-item"><span>🔄</span> Kthim i thjeshtë</div>
                  </div>
                </div>

                <div className="rent-modal-actions">
                  <button className="btn-rent-primary" onClick={() => handleAddToCart(selectedRentProduct, 'rent')}>
                    Rezervo tani
                  </button>
                  <button className="btn-rent-secondary" onClick={() => {
                    setShowRentModal(false);
                    handleAddToCart(selectedRentProduct, 'standard');
                  }}>
                    Blej përgjithmonë
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;