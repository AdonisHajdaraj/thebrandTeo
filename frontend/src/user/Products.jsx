// Products.jsx - Version Modern & Minimal - I RREGULLUAR
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './style/Products.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Hiq filtrin eq('in_stock', true) që të shfaqen të gjitha produktet
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        // Transformo të dhënat për t'u përputhur me strukturën e pritur
        const transformedProducts = data.map(product => ({
          ...product,
          inStock: product.in_stock, // Shto inStock për compatibility
          originalPrice: product.original_price // Shto originalPrice për compatibility
        }));

        setProducts(transformedProducts || []);
        console.log('Produktet e ngarkuara:', transformedProducts); // Për debugging
      } catch (err) {
        console.error('Error:', err);
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
    if (searchTerm && !product.name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Krijoni një kopje për sortim
  const sortedProducts = [...filteredProducts];

  if (sortBy === 'price-asc') {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-desc') {
    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === 'name') {
    sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  const handleAddToCart = (product, type) => {
    const productWithDefaults = {
      ...product,
      size: product.size || 'M',
      color: product.color || 'E zezë'
    };
    addToCart(productWithDefaults, type);
    navigate('/cart');
  };

  const handleCustomize = (product) => {
    const productWithDefaults = {
      ...product,
      size: product.size || 'M',
      color: product.color || 'E zezë'
    };
    addToCart(productWithDefaults, 'custom');
    navigate('/customize');
  };

  if (loading) {
    return (
      <div className="products-page">
        <Sidebar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Po ngarkohen produktet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Sidebar />

      <section className="products-hero">
        <div className="products-hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>Koleksioni</span>
          </div>
          <h1 className="products-title">
            Zbuloni elegancën<br />
            <span className="title-accent">TEO</span>
          </h1>
          <p className="products-description">
            Çdo fustan është një vepër arti e krijuar me pasion dhe përkushtim.
          </p>
        </div>
      </section>

      <section className="products-main-section">
        <div className="products-container">
          <div className="filters-wrapper">
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-chip ${filterCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="search-sort-wrapper">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Kërko fustan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Rendit sipas</option>
                <option value="price-asc">Çmimi: Nga i liri</option>
                <option value="price-desc">Çmimi: Nga i shtrenjti</option>
                <option value="name">Emri: A-Z</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>Nuk u gjet asnjë fustan</h3>
              <p>Provoni të ndryshoni filtrat ose kërkimin</p>
              <button onClick={() => { setFilterCategory('all'); setSearchTerm(''); }}>
                Shiko të gjitha
              </button>
            </div>
          ) : (
            <div className="products-grid-modern">
              {sortedProducts.map((product, index) => {
                // Kontrollo nëse produkti është në stok
                const isInStock = product.in_stock === true || product.inStock === true;
                
                return (
                  <div
                    key={product.id}
                    className="product-card-modern"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="product-image-wrapper">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="no-image">📸</div>
                      )}
                      {product.badge && (
                        <span className={`product-badge-modern ${product.badge.toLowerCase().replace(' ', '-')}`}>
                          {product.badge}
                        </span>
                      )}
                      {!isInStock && (
                        <div className="out-of-stock-overlay">
                          <span>Pa stok</span>
                        </div>
                      )}
                      {isInStock && (
                        <div className="product-overlay">
                          <button
                            className="quick-view-btn"
                            onClick={() => handleAddToCart(product, 'standard')}
                          >
                            Shto në shportë
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="product-info-modern">
                      <div className="product-header">
                        <h3>{product.name}</h3>
                        <span className="product-category-tag">{product.category}</span>
                      </div>

                      <p className="product-description-modern">{product.description}</p>

                      <div className="product-price-modern">
                        <span className="current-price">€{product.price}</span>
                        {product.original_price && (
                          <span className="original-price">€{product.original_price}</span>
                        )}
                        {product.originalPrice && !product.original_price && (
                          <span className="original-price">€{product.originalPrice}</span>
                        )}
                      </div>

                      <div className="product-actions-modern">
                        <button
                          className="action-btn primary"
                          onClick={() => handleAddToCart(product, 'standard')}
                          disabled={!isInStock}
                        >
                          <span>Porosit</span>
                          <span className="btn-arrow">→</span>
                        </button>
                        <button
                          className="action-btn secondary"
                          onClick={() => handleCustomize(product)}
                          disabled={!isInStock}
                        >
                          Personalizo
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;