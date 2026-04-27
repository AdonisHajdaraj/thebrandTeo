// About.jsx - Version Modern & Minimal
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/About.css';
import Sidebar from './Sidebar';

const About = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page">
      <Sidebar />
      
      {/* Hero Section - Minimal & Elegant */}
      <section className="about-hero">
        <div className="about-hero-grid">
          <div className="about-hero-content fade-in">
            <div className="hero-eyebrow">
              <span className="eyebrow-line"></span>
              <span>Që nga 2020</span>
            </div>
            <h1 className="about-title">
              <span className="title-main">TEO</span>
              <span className="title-sub">Studio</span>
            </h1>
            <p className="about-description">
              Një shtëpi mode e pavarur e themeluar në zemër të Prishtines. 
              Ne krijojmë veshje që festojnë individualitetin përmes 
              minimalizmit arkitekturor dhe elegancës së përjetshme.
            </p>
            <div className="hero-numbers">
              <div className="number-item">
                <span className="number">5+</span>
                <span className="number-label">Vite Krijimtarie</span>
              </div>
              <div className="number-item">
                <span className="number">15+</span>
                <span className="number-label">Koleksione</span>
              </div>
           
            </div>
          </div>
          <div className="about-hero-visual fade-in">
            <div className="hero-image-wrapper">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="TEO Studio" />
              <div className="image-gradient"></div>
            </div>
            <div className="hero-quote-card">
              <p>E veshur nga gratë që formësojnë të ardhmen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story - E thjeshtë dhe e fuqishme */}
      <section className="company-story">
        <div className="story-container">
          <div className="story-header fade-in">
            <span className="story-label">Trashëgimia Jonë</span>
            <h2>Një histori e thurur me pasion</h2>
          </div>
          <div className="story-content fade-in">
            <p className="story-text-large">
              TEO lindi nga një ide e thjeshtë: të krijojmë veshje që flasin gjuhën e gruas moderne. 
              Të fuqishme, elegante dhe autentike.
            </p>
            <div className="story-grid">
              <div className="story-paragraph">
                <p>
                  Çdo koleksion fillon në atelienë tonë në Prishtine, ku ekipi ynë i dizajnerëve 
                  dhe mjeshtërve punojnë dorë për dore për të sjellë në jetë vizionin TEO. 
                  Materialet vijnë nga furnizues të përzgjedhur italianë dhe francezë, 
                  ndërsa çdo detaj qepet me përkushtim maksimal.
                </p>
              </div>
              <div className="story-paragraph">
                <p>
                  Nga një butik i vogël në Prishtine, sot TEO është i pranishëm në Milano, 
                  Paris dhe online në mbarë botën. Por filozofia jonë mbetet e pandryshuar: 
                  cilësi pa kompromis, dizajn që sfidon kohën dhe respekt për gruan që 
                  vesh krijimet tona.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section - E veçantë dhe personale */}
      <section className="ceo-section">
        <div className="ceo-container">
          <div className="ceo-image-col fade-in">
            <div className="ceo-image-wrapper">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Elena Teodora - CEO" />
              <div className="ceo-image-border"></div>
            </div>
          </div>
          <div className="ceo-content-col fade-in">
            <span className="ceo-label">Njihuni me</span>
            <h2 className="ceo-name">Aulona  Pirraku </h2>
            <span className="ceo-title">Themeluese & Drejtore Kreative</span>
            <div className="ceo-quote">
              <p>
                "Dizajni për mua nuk është thjesht estetikë — është një mënyrë për të treguar histori, 
                për të fuqizuar dhe për të krijuar lidhje. Çdo fustan që del nga studioja jonë 
                mbart një pjesë të shpirtit tim dhe të ekipit tim të mrekullueshëm."
              </p>
            </div>
            <p className="ceo-bio">
              Aulona themeloi The Brand TEO në vitin 2023 pas një karriere 10-vjeçare në shtëpitë 
              e mëdha të modës në Milano dhe Paris. E diplomuar në Institutin Marangoni, 
              ajo ka fituar çmimin "Talenti i Ri i Vitit" në 2021 dhe është përfshirë 
              në listën "30 nën 30" të Forbes për Europën.
            </p>
            <div className="ceo-signature">
              <span className="signature">Aulona Pirraku</span>
            </div>
            <div className="ceo-social">
              <span>Ndiqni:</span>
              <a href="https://www.instagram.com/thebrand.teo/" target="_blank" rel="noopener noreferrer">
                IG
              </a>
              <span>•</span>
            
            </div>
          </div>
        </div>
      </section>

      {/* Values - Minimal Cards */}
      <section className="about-values">
        <div className="values-header fade-in">
          <span className="values-label">Filozofia Jonë</span>
          <h2>Katër shtyllat e TEO</h2>
        </div>
        <div className="values-cards">
          <div className="value-card fade-in">
            <div className="value-number">01</div>
            <h3>Mjeshtëri</h3>
            <p>Çdo qepje, çdo prerje, çdo detaj është rezultat i dekadave të përvojës së mjeshtërve tanë.</p>
          </div>
          <div className="value-card fade-in">
            <div className="value-number">02</div>
            <h3>Qëndrueshmëri</h3>
            <p>Prodhime në sasi të kufizuara, materiale të certifikuara dhe zero mbetje në landfill.</p>
          </div>
          <div className="value-card fade-in">
            <div className="value-number">03</div>
            <h3>Inovacion</h3>
            <p>Kombinimi i teknikave tradicionale me teknologjinë moderne për rezultate të jashtëzakonshme.</p>
          </div>
          <div className="value-card fade-in">
            <div className="value-number">04</div>
            <h3>Gjithëpërfshirje</h3>
            <p>Dizajnojmë për të gjitha format, madhësitë dhe historitë — bukuria nuk ka një standard të vetëm.</p>
          </div>
        </div>
      </section>

      {/* Studio Showcase */}
      <section className="studio-showcase">
        <div className="studio-grid">
          <div className="studio-text fade-in">
            <span className="studio-eyebrow">Atelieja</span>
            <h2>Ku lind magjia</h2>
            <p>
              Në zemër të Prishtines, në një ndërtesë historike të viteve '30, 
              ndodhet studioja jonë. Një hapësirë e mbushur me dritë natyrale, 
              pëlhura luksoze dhe energjinë krijuese të ekipit tonë.
            </p>
            <p>
              Këtu, çdo koleksion merr jetë përmes një procesi që zgjat me muaj — 
              nga skicat e para deri tek fustani i përfunduar që del nga duart 
              e rrobaqepësve tanë.
            </p>
            <button className="studio-btn" type="button" onClick={() => navigate('/contact')}>
              <span>Vizitoni Dyqanin</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
          <div className="studio-images fade-in">
            <div className="studio-img-1">
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Studio" />
            </div>
          </div>
        </div>
      </section>

      {/* Press Recognition - Minimal */}
      <section className="about-press">
        <div className="press-header fade-in">
          <span>Të njohur nga</span>
        </div>
        <div className="press-logos fade-in">
          <span className="press-logo">VOGUE</span>
          <span className="press-logo">ELLE</span>
          <span className="press-logo">HARPERS</span>
          <span className="press-logo">FORBES</span>
          <span className="press-logo">WWD</span>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="cta-wrapper fade-in">
          <h2>Bëhuni pjesë e historisë sonë</h2>
          <p>Zbuloni koleksionin më të ri dhe përjetoni elegancën TEO</p>
          <button className="cta-btn" type="button" onClick={() => navigate('/products')}>
            <span>Eksploro Koleksionin</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;