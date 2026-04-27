// Home.jsx - Me më shumë përmbajtje dhe tekst
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Home.css';
import Sidebar from './Sidebar';
import './style/Sidebar.css';

const Home = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [showAdminHint, setShowAdminHint] = useState(false);

  const handleSecretClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 1) setShowAdminHint(true);
      if (newCount >= 5) {
        setShowAdminHint(false);
        navigate('/admin/login');
        return 0;
      }
      setTimeout(() => { setClickCount(0); setShowAdminHint(false); }, 3000);
      return newCount;
    });
  };

  const testimonials = [
    { text: "Fustani i dasmës ishte më i bukur se çdo gjë që kisha imagjinuar. Faleminderit TEO!", name: "Ana M.", role: "Nuse" },
    { text: "Cilësi e jashtëzakonshme dhe shërbim i përsosur. E rekomandoj për çdo rast special.", name: "Elena K.", role: "Kliente" },
    { text: "Personalizimi ishte fantastik. Skuadra kuptoi saktësisht çfarë doja.", name: "Besa L.", role: "Kliente" }
  ];

  const values = [
    { icon: "✧", title: "Artizanat Italian", desc: "Çdo fustan punohet me dorë në atelietë tona në Firence, duke ruajtur traditën e mjeshtërisë italiane." },
    { icon: "♡", title: "Materiale Premium", desc: "Përdorim vetëm mëndafsh natyral, dantellë franceze dhe pëlhura të certifikuara etike." },
    { icon: "◆", title: "Eko-Miqësore", desc: "Prodhimi ynë është 100% i qëndrueshëm. Çdo material riciklohet dhe nuk ka mbetje në landfill." },
    { icon: "❖", title: "Ekskluzive", desc: "Çdo koleksion prodhohet në sasi të limituar për të garantuar unicitetin e çdo veshjeje." }
  ];

  return (
    <div className="app">
      <Sidebar />
      
      {showAdminHint && (
        <div className="admin-hint">
          Kliko edhe {5 - clickCount} herë për admin
        </div>
      )}

      {/* === HERO === */}
      <section id="home" className="hero-v2">
        <div className="hero-v2-bg">
          <img 
            src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="TEO Fashion" 
          />
          <div className="hero-v2-overlay"></div>
        </div>
        
        <div className="hero-v2-content">
          <div className="hero-v2-tag">
            <span className="tag-line"></span>
            <span>Koleksioni 2025</span>
          </div>
          <h1 className="hero-v2-title">
            Elegancë<br/>
            <span className="hero-v2-accent">Pa Kohë</span>
          </h1>
          <p className="hero-v2-desc">
            Çdo fustan është një kryevepër e krijuar me pasion në zemër të Prishtines, 
            duke sjellë elegancën klasike në gardërobën tuaj.
          </p>
          <div className="hero-v2-buttons">
            <button className="btn-hero-primary" onClick={() => navigate('/products')}>
              Eksploro Koleksionin
            </button>
            <button className="btn-hero-outline" onClick={() => navigate('/customize')}>
              Personalizo Fustanin Tënd
            </button>
          </div>
        </div>
      </section>

      {/* === ABOUT BRAND === */}
      <section className="about-brand">
        <div className="about-brand-content">
          <span className="section-tag">Rreth nesh</span>
          <h2>Një histori pasioni dhe elegance</h2>
          <p className="about-brand-text">
            TEO u themelua në vitin 2023 në Prishtinë nga Aulona Pirraku, pas një karriere 10-vjeçare
            në modën e lartë në Milano dhe Paris. Marka synon të ndërthurë stilin e
            personalizuar me mjeshtërinë e punës së dorës.
          </p>
          <p className="about-brand-text">
            Sot, TEO është një destinacion për gratë që duan më shumë se një fustan —
            duan një histori të krijuar me materiale premium dhe dizajn të prekur nga eleganca.
          </p>
          <button className="btn-outline-dark" onClick={() => navigate('/about')}>
            Lexo historinë tonë të plotë →
          </button>
        </div>
      </section>

      {/* === VALUES === */}
      <section className="values-section">
        <div className="section-header">
          <span className="section-tag">Filozofia jonë</span>
          <h2>Çfarë na bën unikë</h2>
          <p className="section-subtitle">
            Katër shtyllat mbi të cilat ndërtojmë çdo krijim
          </p>
        </div>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="category-quick">
        <div className="section-header">
          <span className="section-tag">Koleksionet tona</span>
          <h2>Zbuloni sipas rastit</h2>
        </div>
        <div className="category-grid">
          <div className="category-card" onClick={() => navigate('/products')}>
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" alt="Mbrëmje" />
            <div className="category-overlay">
              <div>
                <h3>Mbrëmje</h3>
                <p>Elegancë për raste speciale</p>
              </div>
              <span>Shiko →</span>
            </div>
          </div>
          <div className="category-card" onClick={() => navigate('/products')}>
            <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80" alt="Dasme" />
            <div className="category-overlay">
              <div>
                <h3>Dasma</h3>
                <p>Fustani i ëndrrave tuaja</p>
              </div>
              <span>Shiko →</span>
            </div>
          </div>
          <div className="category-card" onClick={() => navigate('/products')}>
            <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80" alt="Casual" />
            <div className="category-overlay">
              <div>
                <h3>Casual</h3>
                <p>Stil i përditshëm</p>
              </div>
              <span>Shiko →</span>
            </div>
          </div>
        </div>
      </section>

      {/* === BEST SELLERS === */}
      <section className="bestsellers">
        <div className="section-header">
          <span className="section-tag">Më të preferuarat</span>
          <h2>Best Sellers</h2>
          <p className="section-subtitle">Fustanet më të dashura nga klientet tona</p>
        </div>
        <div className="bestsellers-grid">
          {[
            { name: 'Silk Symphony', price: '€189', image: '1539008835657-9e8e9680c956' },
            { name: 'Midnight Muse', price: '€159', image: '1595777457583-95e059d581b8' },
            { name: 'Golden Hour', price: '€299', image: '1496747611176-843222e1e57c' },
            { name: 'Garden Rose', price: '€129', image: '1515372039744-b8f02a3ae446' }
          ].map((item, i) => (
            <div key={i} className="bestseller-card" onClick={() => navigate('/products')}>
              <div className="bestseller-image">
                <img 
                  src={`https://images.unsplash.com/photo-${item.image}?w=400&q=80`} 
                  alt={item.name} 
                />
              </div>
              <h4>{item.name}</h4>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <button className="btn-view-all" onClick={() => navigate('/products')}>
            Shiko të gjitha produktet →
          </button>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="testimonials">
        <div className="section-header">
          <span className="section-tag">Dëshmi</span>
          <h2>Çfarë thonë klientet tona</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-text">"{item.text}"</p>
              <div className="testimonial-author">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === EDITORIAL === */}
      <section className="editorial-v2">
        <div className="editorial-v2-content">
          <span className="section-tag">Procesi ynë</span>
          <h2>Artizanat<br/>Italian</h2>
          <p>
            Çdo fustan TEO kalon nëpër duart e të paktën 15 mjeshtërve para se të arrijë tek ju. 
            Nga prerja e pëlhurës tek qepja e fundit, çdo detaj kontrollohet me kujdes maksimal. 
            Përdorim vetëm materiale të importuara nga Italia dhe Franca.
          </p>
          <div className="editorial-stats">
            <div className="editorial-stat">
              <span className="stat-big">40+</span>
              <span className="stat-small">Orë për çdo fustan</span>
            </div>
            <div className="editorial-stat">
              <span className="stat-big">15+</span>
              <span className="stat-small">Mjeshtër përfshihen</span>
            </div>
            <div className="editorial-stat">
              <span className="stat-big">100%</span>
              <span className="stat-small">Materiale italiane</span>
            </div>
          </div>
          <button className="btn-outline-dark" onClick={() => navigate('/about')}>
            Zbulo më shumë →
          </button>
        </div>
        <div className="editorial-v2-image">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80" alt="Artizanat" />
        </div>
      </section>

      {/* === CTA === */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Gati për të gjetur fustanin e ëndrrave?</h2>
          <p>Na tregoni vizionin tuaj dhe ne do ta krijojmë posaçërisht për ju</p>
          <div className="cta-buttons">
            <button className="btn-hero-primary" onClick={() => navigate('/customize')}>
              Personalizo tani
            </button>
            <button className="btn-hero-outline-dark" onClick={() => navigate('/contact')}>
              Na kontaktoni
            </button>
          </div>
        </div>
      </section>

      {/* === INSTAGRAM === */}
      <section className="instagram-mini">
        <div className="section-header">
          <span className="section-tag">@thebrand.teo</span>
          <h2>Na ndiqni në Instagram</h2>
          <p className="section-subtitle">Për frymëzim të përditshëm dhe pamje ekskluzive</p>
        </div>
        <div className="instagram-mini-grid">
          {[1,2,3,4].map(i => (
            <a
              key={i}
              className="insta-mini-item"
              href="https://www.instagram.com/thebrand.teo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={`https://images.unsplash.com/photo-${i === 1 ? '1539008835657-9e8e9680c956' : i === 2 ? '1595777457583-95e059d581b8' : i === 3 ? '1515372039744-b8f02a3ae446' : '1483985988355-763728e1935b'}?w=300&q=80`} alt="Instagram" />
            </a>
          ))}
        </div>
      </section>


      {/* === FOOTER === */}
      <footer className="footer-v2">
        <div className="footer-v2-grid">
          <div className="footer-v2-brand">
            <h2 onClick={handleSecretClick} style={{cursor:'pointer'}}>TEO</h2>
            <p>Elegancë e përjetshme për gruan moderne</p>
            <p className="footer-address">Rr. Bedri Shala 9, Prishtinë, Kosovë</p>
            <p className="footer-contact">+383 44 951 144 | hello@teostudio.al</p>
          </div>
          <div className="footer-v2-links">
            <div className="footer-link-group">
              <h4>Eksploro</h4>
              <Link to="/products">Koleksioni</Link>
              <Link to="/customize">Personalizo</Link>
              <Link to="/about">Rreth nesh</Link>
              <Link to="/contact">Kontakt</Link>
            </div>
            <div className="footer-link-group">
              <h4>Informacion</h4>
              <Link to="/contact">Transporti</Link>
              <Link to="/contact">Kthimet</Link>
              <Link to="/contact">Size Guide</Link>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-v2-bottom">
          <p>© 2026 TEO Studio. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;