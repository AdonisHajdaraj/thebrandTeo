// CustomizeModern.jsx - Me ruajtje në Supabase (Pa çmime dhe pa guidë madhësie)

import React, { useState } from 'react';
import { supabase } from '../supabase';
import './style/Customize3D.css';
import Sidebar from './Sidebar';

const CustomizeModern = () => {
  const [formData, setFormData] = useState({
    dressType: '',
    color: '#1a1a1a',
    size: '',
    hasSlit: false,
    hasBelt: false,
    hasLace: false,
    description: '',
    inspirationImage: null,
    inspirationPreview: '',
    dateNeeded: '',
    email: '',
    phone: '',
    contactMethod: 'email'
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const dressTypes = [
    { id: 'wedding', name: 'Dasme', icon: '💍', description: 'Fustan nuseje i personalizuar' },
    { id: 'evening', name: 'Mbrëmje', icon: '🌙', description: 'Elegant për raste speciale' },
    { id: 'prom', name: 'Prom', icon: '👑', description: 'Për mbrëmjen e maturës' }
  ];

  const colors = [
    { name: 'E zezë', code: '#1a1a1a' },
    { name: 'E bardhë', code: '#f5f5f5' },
    { name: 'Rozë', code: '#c9a9a6' },
    { name: 'Jeshile', code: '#9cae8c' },
    { name: 'Blu', code: '#1b2a4a' },
    { name: 'Burgundy', code: '#6e2c2c' },
    { name: 'Ari', code: '#d4a574' },
    { name: 'Emerald', code: '#2e5c4e' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const steps = [
    { number: 1, title: 'Lloji', icon: '👗' },
    { number: 2, title: 'Ngjyra', icon: '🎨' },
    { number: 3, title: 'Madhësia', icon: '📏' },
    { number: 4, title: 'Detaje', icon: '✨' },
    { number: 5, title: 'Kontakt', icon: '📞' }
  ];

  // Funksioni për të gjeneruar numrin e porosisë
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CUST-${year}${month}-${random}`;
  };

  // Funksioni për upload foto në Supabase Storage
  const uploadInspirationImage = async (file) => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `inspiration-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `custom-orders/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        inspirationImage: file,
        inspirationPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validimet
    if (!formData.dressType) {
      alert('Ju lutem zgjidhni llojin e fustanit');
      return;
    }
    if (!formData.size) {
      alert('Ju lutem zgjidhni madhësinë');
      return;
    }
    if (!formData.email) {
      alert('Ju lutem shkruani emailin tuaj');
      return;
    }
    if (!formData.phone) {
      alert('Ju lutem shkruani numrin tuaj të telefonit');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload foto nëse ka
      let inspirationImageUrl = null;
      if (formData.inspirationImage) {
        inspirationImageUrl = await uploadInspirationImage(formData.inspirationImage);
      }

      // 2. Ndërto stringun e detajeve
      const detailsArray = [];
      if (formData.hasSlit) detailsArray.push('Me çarje');
      if (formData.hasBelt) detailsArray.push('Me rrip');
      if (formData.hasLace) detailsArray.push('Me dantellë');
      if (formData.description) detailsArray.push(`Përshkrimi: ${formData.description}`);
      if (formData.dateNeeded) detailsArray.push(`Data e nevojshme: ${formData.dateNeeded}`);
      if (inspirationImageUrl) detailsArray.push(`Foto inspirimi: ${inspirationImageUrl}`);
      
      const detailsString = detailsArray.join('; ');

      // 3. Gjenero numrin e porosisë
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);

      // 4. Gjej emrin e llojit të fustanit
      const selectedType = dressTypes.find(t => t.id === formData.dressType);
      const dressTypeName = selectedType ? selectedType.name : formData.dressType;

      // 5. Ruaj në Supabase (pa çmim)
      const { error } = await supabase
        .from('custom_orders')
        .insert([
          {
            order_number: newOrderNumber,
            customer_name: 'Klient',
            customer_email: formData.email,
            customer_phone: formData.phone,
            dress_type: dressTypeName,
            color: formData.color,
            size: formData.size,
            status: 'pending',
            details: detailsString || null,
            contact_method: formData.contactMethod
          }
        ]);

      if (error) {
        console.error('Gabim gjatë ruajtjes së porosisë:', error);
        throw error;
      }

      // 6. Shfaq suksesin
      setOrderSubmitted(true);
      
    } catch (error) {
      console.error('Gabim:', error);
      alert('Ndodhi një gabim gjatë dërgimit të porosisë. Ju lutem provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      dressType: '',
      color: '#1a1a1a',
      size: '',
      hasSlit: false,
      hasBelt: false,
      hasLace: false,
      description: '',
      inspirationImage: null,
      inspirationPreview: '',
      dateNeeded: '',
      email: '',
      phone: '',
      contactMethod: 'email'
    });
    setOrderSubmitted(false);
    setCurrentStep(1);
    setOrderNumber('');
  };

  const selectedType = dressTypes.find(t => t.id === formData.dressType);

  if (orderSubmitted) {
    return (
      <div className="customize-page">
        <Sidebar />
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <span>✓</span>
            </div>
            <h2>Porosia u dërgua me sukses!</h2>
            <p>Ne do t'ju kontaktojmë brenda 24 orëve për të konfirmuar detajet dhe çmimin final.</p>
            
            <div className="order-summary">
              <h3>Përmbledhje e porosisë</h3>
              {orderNumber && (
                <div className="summary-item">
                  <span>Numri i porosisë:</span>
                  <strong>{orderNumber}</strong>
                </div>
              )}
              <div className="summary-item">
                <span>Lloji i fustanit:</span>
                <strong>{dressTypes.find(t => t.id === formData.dressType)?.name}</strong>
              </div>
              <div className="summary-item">
                <span>Ngjyra:</span>
                <div className="summary-color">
                  <span className="color-dot" style={{ backgroundColor: formData.color }}></span>
                  <span>{formData.color}</span>
                </div>
              </div>
              <div className="summary-item">
                <span>Madhësia:</span>
                <strong>{formData.size}</strong>
              </div>
              <div className="summary-item">
                <span>Detaje shtesë:</span>
                <strong>
                  {[
                    formData.hasSlit && 'Çarje',
                    formData.hasBelt && 'Rrip',
                    formData.hasLace && 'Dantellë'
                  ].filter(Boolean).join(', ') || 'Asnjë'}
                </strong>
              </div>
              <div className="summary-item">
                <span>Çmimi:</span>
                <strong>Do t'ju konfirmohet pas konsultimit</strong>
              </div>
              <div className="summary-item">
                <span>Kontakt:</span>
                <strong>{formData.phone} / {formData.email}</strong>
              </div>
            </div>
            
            <button className="continue-btn" onClick={handleReset}>
              <span>Krijo një porosi të re</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customize-page">
      <Sidebar />
      
      {/* Hero Section */}
      <section className="customize-hero">
        <div className="customize-hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>Personalizimi</span>
          </div>
          <h1 className="customize-title">
            Dizajno fustanin<br/>
            <span className="title-accent">e ëndrrave të tua</span>
          </h1>
          <p className="customize-description">
            Çdo fustan krijohet me dorë sipas specifikimeve tuaja. Na tregoni vizionin tuaj dhe ne do ta sjellim në jetë.
            Për çmimin, do të kontaktojmë pasi të analizojmë kërkesën tuaj.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="progress-steps">
        <div className="steps-container">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`step-item ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step.number)}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-info">
                <span className="step-number">0{step.number}</span>
                <span className="step-title">{step.title}</span>
              </div>
              {step.number < 5 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Main Form */}
      <section className="customize-main">
        <div className="customize-container">
          <form onSubmit={handleSubmit} className="customize-form">
            
            {/* Step 1: Lloji i fustanit */}
            <div className={`form-section ${currentStep === 1 ? 'visible' : ''}`}>
              <div className="section-header">
                <span className="section-number">01</span>
                <h2>Zgjidh llojin e fustanit</h2>
              </div>
              
              <div className="dress-type-options">
                {dressTypes.map(type => (
                  <div
                    key={type.id}
                    className={`dress-type-option ${formData.dressType === type.id ? 'selected' : ''}`}
                    onClick={() => {
                      setFormData({...formData, dressType: type.id});
                      setCurrentStep(2);
                    }}
                  >
                    <div className="option-icon">{type.icon}</div>
                    <div className="option-content">
                      <h3>{type.name}</h3>
                      <p>{type.description}</p>
                    </div>
                    <div className="option-indicator">
                      {formData.dressType === type.id && <span>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Ngjyra */}
            <div className={`form-section ${currentStep === 2 ? 'visible' : ''}`}>
              <div className="section-header">
                <span className="section-number">02</span>
                <h2>Zgjidh ngjyrën</h2>
              </div>
              
              <div className="color-options">
                {colors.map(color => (
                  <div
                    key={color.code}
                    className={`color-option ${formData.color === color.code ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, color: color.code})}
                  >
                    <div className="color-circle" style={{ backgroundColor: color.code }}>
                      {formData.color === color.code && <span>✓</span>}
                    </div>
                    <span className="color-name">{color.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="custom-color">
                <label>Ose zgjidh ngjyrën tënde</label>
                <div className="custom-color-input">
                  <input
                    type="color"
                    value={formData.color.startsWith('#') ? formData.color : '#1a1a1a'}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Shkruaj emrin e ngjyrës"
                    value={!formData.color.startsWith('#') ? formData.color : ''}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="section-actions">
                <button type="button" className="btn-back" onClick={() => setCurrentStep(1)}>
                  ← Mbrapsht
                </button>
                <button type="button" className="btn-next" onClick={() => setCurrentStep(3)}>
                  Vazhdo →
                </button>
              </div>
            </div>

            {/* Step 3: Madhësia - PA GUIDË DHE PA ÇMIME */}
            <div className={`form-section ${currentStep === 3 ? 'visible' : ''}`}>
              <div className="section-header">
                <span className="section-number">03</span>
                <h2>Zgjidh madhësinë</h2>
              </div>
              
              <div className="size-options">
                {sizes.map(size => (
                  <div
                    key={size}
                    className={`size-option ${formData.size === size ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, size})}
                  >
                    {size}
                  </div>
                ))}
              </div>
              
              {/* Njoftimi për çmimin */}
              <div className="price-notice">
                <div className="price-notice-icon">💰</div>
                <div className="price-notice-content">
                  <strong>Për çmimin do t'ju kontaktojmë në numrin e telefonit</strong>
                  <p>Çmimi final përcaktohet pasi të analizojmë materialet dhe detajet e kërkesës suaj.</p>
                </div>
              </div>
              
              <div className="section-actions">
                <button type="button" className="btn-back" onClick={() => setCurrentStep(2)}>
                  ← Mbrapsht
                </button>
                <button type="button" className="btn-next" onClick={() => setCurrentStep(4)}>
                  Vazhdo →
                </button>
              </div>
            </div>

            {/* Step 4: Detaje shtesë dhe përshkrimi - PA ÇMIME */}
            <div className={`form-section ${currentStep === 4 ? 'visible' : ''}`}>
              <div className="section-header">
                <span className="section-number">04</span>
                <h2>Detaje shtesë</h2>
              </div>
              
              <div className="details-options">
                <label className={`detail-checkbox ${formData.hasSlit ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={formData.hasSlit}
                    onChange={(e) => setFormData({...formData, hasSlit: e.target.checked})}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="detail-label">
                    <strong>Me çarje</strong>
                  </span>
                </label>
                
                <label className={`detail-checkbox ${formData.hasBelt ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={formData.hasBelt}
                    onChange={(e) => setFormData({...formData, hasBelt: e.target.checked})}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="detail-label">
                    <strong>Me rrip</strong>
                  </span>
                </label>
                
                <label className={`detail-checkbox ${formData.hasLace ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={formData.hasLace}
                    onChange={(e) => setFormData({...formData, hasLace: e.target.checked})}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="detail-label">
                    <strong>Me dantellë</strong>
                  </span>
                </label>
              </div>
              
              <div className="description-field">
                <label>Përshkrimi i detajuar</label>
                <textarea
                  rows="4"
                  placeholder="Përshkruani si e imagjinoni fustanin tuaj... Çdo detaj është i rëndësishëm për ne."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="upload-field">
                <label>Foto inspirimi (opsionale)</label>
                <div className="upload-area">
                  <input
                    type="file"
                    id="inspiration"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                  <label htmlFor="inspiration" className="upload-label">
                    <span className="upload-icon">📸</span>
                    <span>Kliko për të ngarkuar foto</span>
                    <small>PNG, JPG deri në 10MB</small>
                  </label>
                  {formData.inspirationPreview && (
                    <div className="upload-preview">
                      <img src={formData.inspirationPreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-preview"
                        onClick={() => setFormData({...formData, inspirationPreview: '', inspirationImage: null})}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="date-field">
                <label>Data kur ju duhet fustani</label>
                <input
                  type="date"
                  value={formData.dateNeeded}
                  onChange={(e) => setFormData({...formData, dateNeeded: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="section-actions">
                <button type="button" className="btn-back" onClick={() => setCurrentStep(3)}>
                  ← Mbrapsht
                </button>
                <button type="button" className="btn-next" onClick={() => setCurrentStep(5)}>
                  Vazhdo →
                </button>
              </div>
            </div>

            {/* Step 5: Kontakt dhe finalizimi - PA ÇMIM */}
            <div className={`form-section ${currentStep === 5 ? 'visible' : ''}`}>
              <div className="section-header">
                <span className="section-number">05</span>
                <h2>Informacioni i kontaktit</h2>
              </div>
              
              <div className="contact-fields">
                <div className="form-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="emri@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label>Numri i telefonit *</label>
                  <input
                    type="tel"
                    placeholder="+355 69 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label>Metoda e preferuar e kontaktit</label>
                  <div className="contact-methods">
                    {['email', 'viber', 'whatsapp'].map(method => (
                      <label key={method} className={`method-option ${formData.contactMethod === method ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="contactMethod"
                          value={method}
                          checked={formData.contactMethod === method}
                          onChange={() => setFormData({...formData, contactMethod: method})}
                        />
                        {method === 'email' ? '📧 Email' : method === 'viber' ? '📱 Viber' : '💬 WhatsApp'}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Order Summary Card - PA ÇMIM */}
              <div className="order-summary-card">
                <h3>Përmbledhje e porosisë</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Lloji:</span>
                    <span>{selectedType?.name || '—'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Ngjyra:</span>
                    <div className="row-color">
                      <span className="mini-dot" style={{ backgroundColor: formData.color }}></span>
                      <span>{formData.color}</span>
                    </div>
                  </div>
                  <div className="summary-row">
                    <span>Madhësia:</span>
                    <span>{formData.size || '—'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Detaje:</span>
                    <span>
                      {[
                        formData.hasSlit && 'Çarje',
                        formData.hasBelt && 'Rrip',
                        formData.hasLace && 'Dantellë'
                      ].filter(Boolean).join(', ') || 'Asnjë'}
                    </span>
                  </div>
                  <div className="summary-row price-row-notice">
                    <span>Çmimi:</span>
                    <span><strong>Do të konfirmohet</strong></span>
                  </div>
                  {formData.dateNeeded && (
                    <div className="summary-row">
                      <span>Data:</span>
                      <span>{new Date(formData.dateNeeded).toLocaleDateString('sq-AL')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="section-actions">
                <button type="button" className="btn-back" onClick={() => setCurrentStep(4)}>
                  ← Mbrapsht
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <span>Duke u dërguar...</span>
                  ) : (
                    <>
                      <span>Dërgo kërkesën</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
              
              <p className="form-note">
                * Pas dërgimit të kërkesës, ne do t'ju kontaktojmë për të diskutuar detajet dhe çmimin final.
                Afati i prodhimit: 3-4 javë. Transporti falas në të gjithë Shqipërinë.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CustomizeModern;