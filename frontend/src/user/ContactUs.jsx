// Contact.jsx - Me ruajtje në Supabase
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './style/ContactUs.css';
import Sidebar from './Sidebar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFocused({ ...focused, [field]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validimi
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Ju lutem plotësoni të gjitha fushat e detyrueshme!');
      return;
    }

    setLoading(true);

    try {
      // Ruaj mesazhin në Supabase
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject,
            message: formData.message,
            read: false
          }
        ]);

      if (error) {
        console.error('Gabim gjatë ruajtjes së mesazhit:', error);
        throw error;
      }

      // Sukses
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFocused({});
      
      // Fshih mesazhin e suksesit pas 5 sekondash
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Gabim:', error);
      alert('Ndodhi një gabim gjatë dërgimit të mesazhit. Ju lutem provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Atelieja',
      lines: ['Rruga Ibrahim Rugova 15', 'Tiranë, Shqipëri']
    },
    {
      icon: '🕐',
      title: 'Orari',
      lines: ['E Hënë - E Premte: 10:00 - 19:00', 'E Shtunë: 11:00 - 16:00', 'E Diel: Mbyllur']
    },
    {
      icon: '📞',
      title: 'Kontakt i Drejtpërdrejtë',
      lines: ['+355 69 123 4567', 'hello@teostudio.al']
    }
  ];

  const socialLinks = [
    { name: 'Instagram', handle: '@teo_studio', link: '#' },
    { name: 'Facebook', handle: '/teostudio', link: '#' },
    { name: 'Pinterest', handle: '@teostudio', link: '#' },
    { name: 'LinkedIn', handle: '/company/teo-studio', link: '#' }
  ];

  return (
    <div className="contact-page">
      <Sidebar />
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content fade-in">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>Bisedoni me ne</span>
          </div>
          <h1 className="contact-title">
            Le të krijojmë<br/>
            <span className="title-accent">diçka të bukur</span>
          </h1>
          <p className="contact-description">
            Jeni të interesuar për koleksionin tonë, dëshironi një konsultë private 
            apo keni pyetje rreth porosive? Ekipi ynë është këtu për ju.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="contact-grid">
          {/* Left Column - Contact Info */}
          <div className="contact-info-col fade-in">
            <div className="info-header">
              <span className="info-label">Kontaktoni</span>
              <h2>Jemi këtu për ju</h2>
              <p className="info-subtitle">
                Na shkruani për çdo gjë — nga pyetjet rreth produkteve 
                te bashkëpunimet e mundshme.
              </p>
            </div>

            <div className="info-cards">
              {contactInfo.map((info, index) => (
                <div key={index} className="info-card">
                  <div className="info-icon">{info.icon}</div>
                  <div className="info-content">
                    <h3>{info.title}</h3>
                    {info.lines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="contact-social">
              <span className="social-label">Na ndiqni</span>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a key={index} href={social.link} className="social-link">
                    <span className="social-name">{social.name}</span>
                    <span className="social-handle">{social.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-col fade-in">
            <div className="form-wrapper">
              <div className="form-header">
                <span className="form-label">Dërgoni një mesazh</span>
                <h3>Na shkruani</h3>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  <span>Faleminderit për mesazhin! Do t'ju kontaktojmë së shpejti.</span>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className={`form-group ${focused.name || formData.name ? 'focused' : ''}`}>
                    <label htmlFor="name">Emri i plotë *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      required
                    />
                    <span className="input-line"></span>
                  </div>
                </div>

                <div className="form-row two-cols">
                  <div className={`form-group ${focused.email || formData.email ? 'focused' : ''}`}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      required
                    />
                    <span className="input-line"></span>
                  </div>

                  <div className={`form-group ${focused.phone || formData.phone ? 'focused' : ''}`}>
                    <label htmlFor="phone">Telefon</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => handleFocus('phone')}
                      onBlur={() => handleBlur('phone')}
                    />
                    <span className="input-line"></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${focused.subject || formData.subject ? 'focused' : ''}`}>
                    <label htmlFor="subject">Subjekti *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus('subject')}
                      onBlur={() => handleBlur('subject')}
                      required
                    />
                    <span className="input-line"></span>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${focused.message || formData.message ? 'focused' : ''}`}>
                    <label htmlFor="message">Mesazhi *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={() => handleBlur('message')}
                      required
                    ></textarea>
                    <span className="input-line"></span>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span>Duke u dërguar...</span>
                  ) : (
                    <>
                      <span>Dërgo Mesazhin</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Minimal */}
      <section className="contact-map fade-in">
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-overlay">
              <div className="map-content">
                <span className="map-icon">📍</span>
                <h3>Vizitoni atelienë tonë</h3>
                <p>Rruga Ibrahim Rugova 15, Tiranë</p>
                <button className="map-btn" onClick={() => window.open('https://maps.google.com/?q=Rruga+Ibrahim+Rugova+15+Tirane', '_blank')}>
                  <span>Hap në Google Maps</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="TEO Studio Location" 
            />
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="contact-faq">
        <div className="faq-container fade-in">
          <div className="faq-header">
            <span className="faq-label">Pyetje të shpeshta</span>
            <h2>Ndoshta kemi tashmë përgjigjen</h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Si mund të porosis?</h4>
              <p>Porositë mund t'i bëni online përmes faqes sonë ose duke na vizituar në atelie.</p>
            </div>
            <div className="faq-item">
              <h4>Cilat janë opsionet e pagesës?</h4>
              <p>Pranojmë të gjitha kartat kryesore, PayPal dhe pagesë në dorëzim.</p>
            </div>
            <div className="faq-item">
              <h4>Sa zgjat dërgesa?</h4>
              <p>Dërgesa brenda Shqipërisë zgjat 1-2 ditë pune. Ndërkombëtarisht 3-7 ditë.</p>
            </div>
            <div className="faq-item">
              <h4>A keni politikë kthimi?</h4>
              <p>Po, ofrojmë kthim falas brenda 14 ditëve për të gjitha porositë.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="contact-newsletter">
        <div className="newsletter-wrapper fade-in">
          <div className="newsletter-content">
            <h2>Qëndroni të informuar</h2>
            <p>Regjistrohuni për të marrë lajmet më të fundit rreth koleksioneve dhe eventeve tona.</p>
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.querySelector('input[type="email"]').value;
              if (email) {
                alert('Faleminderit për regjistrimin!');
                e.target.reset();
              }
            }}>
              <input type="email" placeholder="Adresa juaj email" required />
              <button type="submit">
                <span>Regjistrohu</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;