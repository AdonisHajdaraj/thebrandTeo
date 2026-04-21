// Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Home.css';
import Sidebar from './Sidebar';
import './style/Sidebar.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    { id: 1, name: 'Silk Symphony', price: '€189', category: 'evening', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: 'New' },
    { id: 2, name: 'Midnight Muse', price: '€159', category: 'evening', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: 'Bestseller' },
    { id: 3, name: 'Garden Rose', price: '€129', category: 'casual', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: null },
    { id: 4, name: 'Golden Hour', price: '€219', category: 'evening', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: 'Limited' },
    { id: 5, name: 'Breeze', price: '€99', category: 'casual', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: null },
    { id: 6, name: 'Noir', price: '€249', category: 'evening', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: 'Exclusive' },
    { id: 7, name: 'Blossom', price: '€109', category: 'casual', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: null },
    { id: 8, name: 'Starlight', price: '€199', category: 'evening', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', badge: 'New' }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  return (
    <div className="app">
      <Sidebar />
      {/* Custom Cursor */}
      <div className="custom-cursor"></div>
      
    

      {/* Hero Section - Modern Split Layout */}
      <section id="home" className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-tag">
              <span className="tag-dot"></span>
              AW24 Collection
            </div>
            <h1 className="hero-title">
              <span className="title-line">Sculpting</span>
              <span className="title-line">Silhouettes</span>
            </h1>
            <p className="hero-desc">
              Where minimalism meets sensuality. Each piece is a canvas of 
              architectural precision and poetic movement.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/products')}>Discover Collection →</button>
              <button className="btn-outline" onClick={() => navigate('/products')}>Shop Now</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Global Awards</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-container">
              <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Teo Fashion" />
              <div className="image-overlay"></div>
            </div>
            <div className="floating-card">
              <div className="card-content">
                <span className="card-label">New Arrival</span>
                <h4>Silk Symphony</h4>
                <p>Handcrafted in Italy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* Collection Showcase - Vitrinë Ekskluzive */}
<section id="collection" className="collection-showcase">
  <div className="showcase-header">
    <div className="showcase-label">
      <span className="label-dot"></span>
      <span>Koleksioni AW24</span>
    </div>
    <h2 className="showcase-title">
      <span className="title-word">Elegancë</span>
      <span className="title-word italic">Pa Kohë</span>
    </h2>
    <p className="showcase-subtitle">
      Zbulo modelet tona ikonike të punuara me dorë nga mjeshtrit tanë
    </p>
  </div>

  <div className="showcase-masonry">
    {/* Fustani 1 - Dominant */}
    <div className="showcase-item item-large">
      <div className="showcase-image-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Silk Symphony"
        />
        <div className="image-mask"></div>
        <div className="showcase-badge">
          <span>Bestseller</span>
        </div>
      </div>
      <div className="showcase-content">
        <div className="content-inner">
          <span className="category-tag">Evening Collection</span>
          <h3>Silk Symphony</h3>
          <div className="price-wrapper">
            <span className="discover-link">
              Zbulo <span className="arrow">→</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Fustani 2 - Medium */}
    <div className="showcase-item item-medium">
      <div className="showcase-image-wrapper shape-organic">
        <img 
          src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Garden Rose"
        />
        <div className="image-mask"></div>
        <div className="showcase-badge new">
          <span>New</span>
        </div>
      </div>
      <div className="showcase-content">
        <span className="category-tag">Daywear</span>
        <h3>Garden Rose</h3>
      </div>
    </div>

    {/* Fustani 3 - Medium */}
    <div className="showcase-item item-medium">
      <div className="showcase-image-wrapper shape-circle">
        <img 
          src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Golden Hour"
        />
        <div className="image-mask"></div>
        <div className="showcase-badge limited">
          <span>Limited</span>
        </div>
      </div>
      <div className="showcase-content">
        <span className="category-tag">Evening</span>
        <h3>Golden Hour</h3>
      </div>
    </div>

    {/* Fustani 4 - Small (Aksesor) */}
    <div className="showcase-item item-small">
      <div className="showcase-image-wrapper shape-blob">
        <img 
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Noir"
        />
        <div className="image-mask"></div>
      </div>
      <div className="showcase-content">
        <h3>Noir</h3>
      </div>
    </div>
  </div>

  <div className="showcase-footer">
    <button className="btn-view-all">
      <span>Shiko të gjitha</span>
      <span className="btn-arrow">→</span>
    </button>
  </div>
</section>

      {/* Editorial Section - Full Width Banner */}
      <section id="editorial" className="editorial">
        <div className="editorial-container">
          <div className="editorial-text">
            <span className="editorial-label">Editorial</span>
            <h2>The Art of<br/>Draping</h2>
            <p>Exploring the intersection of traditional craftsmanship and contemporary design through the lens of our latest collection.</p>
            <button className="btn-text">Read the story →</button>
          </div>
          <div className="editorial-image">
            <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Editorial" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">✧</div>
            <h3>Artisanal Craft</h3>
            <p>Each garment is meticulously crafted by master artisans</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✦</div>
            <h3>Sustainable Luxury</h3>
            <p>Ethically sourced materials and responsible production</p>
          </div>
          <div className="feature">
            <div className="feature-icon">♢</div>
            <h3>Bespoke Service</h3>
            <p>Personalized fittings and custom alterations</p>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="instagram">
        <div className="instagram-header">
          <span className="insta-label">@teo_studio</span>
          <h2>Follow the<br/>Movement</h2>
        </div>
        <div className="instagram-grid">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="insta-post">
              <img src={`https://images.unsplash.com/photo-${i === 1 ? '1539008835657-9e8e9680c956' : i === 2 ? '1595777457583-95e059d581b8' : i === 3 ? '1515372039744-b8f02a3ae446' : i === 4 ? '1496747611176-843222e1e57c' : '1483985988355-763728e1935b'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`} alt="Instagram" />
              <div className="insta-overlay">
                <span>📷</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2>Become an Insider</h2>
            <p>Be the first to discover new arrivals, exclusive collaborations, and private events.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe →</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>TEO</h2>
            <p>Where fashion becomes<br/>architecture for the body.</p>
            <div className="social-links">
              <a href="#">IG</a>
              <a href="#">FB</a>
              <a href="#">TW</a>
              <a href="#">LI</a>
            </div>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Shop</h4>
              <a href="#">Ready to Wear</a>
              <a href="#">Evenwear</a>
              <a href="#">Accessories</a>
              <a href="#">Archive Sale</a>
            </div>
            <div className="link-group">
              <h4>Studio</h4>
              <Link to="/about">About Us</Link>
              <a href="#">Sustainability</a>
              <a href="#">Press</a>
              <a href="#">Careers</a>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <a href="#">Size Guide</a>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 TEO. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;