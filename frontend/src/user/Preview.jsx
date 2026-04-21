// Preview.jsx
import React, { useState, useEffect } from 'react';
import './Preview.css';
import Sidebar from './Sidebar';
import './style/Sidebar.css';

const Preview = ({ customization, selectedDress, onBack, onSubmit }) => {
  const [activeView, setActiveView] = useState('front');
  const [zoom, setZoom] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuloni ngarkimin e imazhit 3D
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Ngjyrat për visualization
  const colorMap = {
    'Jet Black': '#1a1a1a',
    'Pearl White': '#f5f5f5',
    'Dusty Rose': '#c9a9a6',
    'Sage Green': '#9cae8c',
    'Navy Blue': '#1b2a4a',
    'Burgundy': '#6e2c2c',
    'Champagne': '#f7e7ce',
    'Emerald': '#2e5c4e'
  };

  const selectedColor = colorMap[customization.color] || '#1a1a1a';
  const isLightColor = customization.color === 'Pearl White' || customization.color === 'Champagne';

  // Gjatësia e fustanit për preview
  const lengthHeight = {
    'Mini': '30%',
    'Knee Length': '50%',
    'Midi': '70%',
    'Maxi': '90%',
    'Train': '100%'
  };

  const dressHeight = lengthHeight[customization.length] || '70%';

  // Qafa për preview
  const necklineShape = {
    'V-Neck': 'polygon(50% 0%, 30% 40%, 50% 60%, 70% 40%)',
    'Sweetheart': 'path("M 30 40 Q 50 20 70 40 Q 60 55 50 65 Q 40 55 30 40")',
    'High Neck': 'ellipse(30% 15% at 50% 30%)',
    'Off Shoulder': 'ellipse(40% 10% at 50% 25%)',
    'Square': 'polygon(35% 25%, 65% 25%, 65% 45%, 35% 45%)'
  };

  // Mëngët për preview
  const sleeveStyle = {
    'Sleeveless': { width: '0%', display: 'none' },
    'Short Sleeves': { width: '25%', height: '20%', borderRadius: '50%' },
    'Long Sleeves': { width: '30%', height: '60%', borderRadius: '0%' },
    'Puff Sleeves': { width: '35%', height: '25%', borderRadius: '50% 50% 40% 40%' },
    'Bishop Sleeves': { width: '35%', height: '55%', borderRadius: '0% 0% 30% 30%' }
  };

  const currentSleeve = sleeveStyle[customization.sleeves] || sleeveStyle['Sleeveless'];

  return (
    <div className="preview-page">
      <Sidebar />
      <div className="preview-container">
        {/* Header */}
        <div className="preview-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Customization
          </button>
          <h1>Your Custom Creation</h1>
          <p>See how your dream dress comes to life</p>
        </div>

        {/* Main Preview Area */}
        <div className="preview-main">
          {/* 3D Dress Preview */}
          <div className="dress-preview">
            <div className="view-controls">
              <button 
                className={`view-btn ${activeView === 'front' ? 'active' : ''}`}
                onClick={() => setActiveView('front')}
              >
                Front
              </button>
              <button 
                className={`view-btn ${activeView === 'back' ? 'active' : ''}`}
                onClick={() => setActiveView('back')}
              >
                Back
              </button>
              <button 
                className={`view-btn ${activeView === 'side' ? 'active' : ''}`}
                onClick={() => setActiveView('side')}
              >
                Side
              </button>
              <button 
                className={`view-btn ${activeView === 'detail' ? 'active' : ''}`}
                onClick={() => setShowDetails(!showDetails)}
              >
                Details
              </button>
            </div>

            <div className="zoom-controls">
              <button onClick={() => setZoom(Math.min(zoom + 0.1, 2))}>+</button>
              <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}>-</button>
            </div>

            {isLoading ? (
              <div className="preview-loader">
                <div className="loader"></div>
                <p>Rendering your custom dress...</p>
              </div>
            ) : (
              <div className="dress-container" style={{ transform: `scale(${zoom})` }}>
                {/* Dress Silhouette */}
                <div className={`dress-silhouette ${activeView}`}>
                  {/* Body Base */}
                  <div 
                    className="dress-body"
                    style={{ 
                      backgroundColor: selectedColor,
                      height: dressHeight,
                      boxShadow: isLightColor ? '0 0 20px rgba(0,0,0,0.1)' : '0 0 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Neckline */}
                    <div 
                      className="neckline"
                      style={{ 
                        clipPath: necklineShape[customization.neckline] || necklineShape['V-Neck']
                      }}
                    ></div>

                    {/* Sleeves */}
                    {customization.sleeves !== 'Sleeveless' && (
                      <>
                        <div 
                          className="sleeve left"
                          style={{ 
                            ...currentSleeve,
                            left: '-15%',
                            backgroundColor: selectedColor
                          }}
                        ></div>
                        <div 
                          className="sleeve right"
                          style={{ 
                            ...currentSleeve,
                            right: '-15%',
                            backgroundColor: selectedColor
                          }}
                        ></div>
                      </>
                    )}

                    {/* Embroidery Details */}
                    {customization.embroidery !== 'none' && (
                      <div className="embroidery-pattern">
                        {customization.embroidery === 'Minimal Floral' && (
                          <div className="floral-pattern">
                            <div className="flower">✿</div>
                            <div className="flower">❀</div>
                            <div className="flower">✿</div>
                          </div>
                        )}
                        {customization.embroidery === 'Intricate Pattern' && (
                          <div className="intricate-pattern">
                            <div className="pattern-line"></div>
                            <div className="pattern-line"></div>
                            <div className="pattern-dot">✦</div>
                          </div>
                        )}
                        {customization.embroidery === 'Beaded Details' && (
                          <div className="beaded-pattern">
                            <div className="bead">💎</div>
                            <div className="bead">✨</div>
                            <div className="bead">💎</div>
                          </div>
                        )}
                        {customization.embroidery === 'Custom Monogram' && (
                          <div className="monogram">TEO</div>
                        )}
                      </div>
                    )}

                    {/* Fabric Texture Effect */}
                    <div className="fabric-texture" style={{
                      backgroundImage: customization.fabric === 'Silk Chiffon' ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' :
                                      customization.fabric === 'Italian Satin' ? 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 6px)' :
                                      customization.fabric === 'Velvet' ? 'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(0,0,0,0.1) 15px, rgba(0,0,0,0.1) 30px)' : 'none'
                    }}></div>

                    {/* Hemline Detail */}
                    <div className="hemline"></div>
                  </div>

                  {/* Mannequin Stand */}
                  <div className="stand"></div>
                </div>

                {/* Reflection Effect */}
                <div className="reflection"></div>
              </div>
            )}

            {/* Quality Indicators */}
            <div className="quality-badges">
              <div className="badge">✓ Handcrafted</div>
              <div className="badge">✓ Premium Materials</div>
              <div className="badge">✓ Made to Order</div>
            </div>
          </div>

          {/* Specifications Panel */}
          <div className="specifications-panel">
            <h3>Your Specifications</h3>
            
            <div className="spec-group">
              <div className="spec-item">
                <span className="spec-label">Base Style:</span>
                <span className="spec-value">{selectedDress?.name}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color:</span>
                <span className="spec-value" style={{ color: selectedColor }}>{customization.color}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Fabric:</span>
                <span className="spec-value">{customization.fabric}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Length:</span>
                <span className="spec-value">{customization.length}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Neckline:</span>
                <span className="spec-value">{customization.neckline}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Sleeves:</span>
                <span className="spec-value">{customization.sleeves}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Embroidery:</span>
                <span className="spec-value">{customization.embroidery}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Size:</span>
                <span className="spec-value">{customization.size}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <h4>Price Summary</h4>
              <div className="price-row">
                <span>Base Price:</span>
                <span>€{selectedDress?.price}</span>
              </div>
              {customization.fabric !== 'Silk Chiffon' && (
                <div className="price-row">
                  <span>Fabric Upgrade:</span>
                  <span>+€50</span>
                </div>
              )}
              {customization.length === 'Maxi' && (
                <div className="price-row">
                  <span>Length:</span>
                  <span>+€40</span>
                </div>
              )}
              {customization.sleeves !== 'Sleeveless' && customization.sleeves !== 'Short Sleeves' && (
                <div className="price-row">
                  <span>Sleeves:</span>
                  <span>+€30</span>
                </div>
              )}
              {customization.embroidery !== 'none' && (
                <div className="price-row">
                  <span>Embroidery:</span>
                  <span>+€{customization.embroidery === 'Minimal Floral' ? '50' : customization.embroidery === 'Intricate Pattern' ? '100' : '75'}</span>
                </div>
              )}
              <div className="price-total">
                <span>Total:</span>
                <span>€{selectedDress?.price + 
                  (customization.fabric !== 'Silk Chiffon' ? 50 : 0) +
                  (customization.length === 'Maxi' ? 40 : 0) +
                  (customization.sleeves !== 'Sleeveless' && customization.sleeves !== 'Short Sleeves' ? 30 : 0) +
                  (customization.embroidery !== 'none' ? (customization.embroidery === 'Minimal Floral' ? 50 : customization.embroidery === 'Intricate Pattern' ? 100 : 75) : 0)
                }</span>
              </div>
            </div>

            {/* Fabric Swatch Preview */}
            <div className="fabric-swatch">
              <h4>Fabric Quality</h4>
              <div className="swatch-container">
                <div className="swatch" style={{ backgroundColor: selectedColor }}></div>
                <div className="swatch-info">
                  <p><strong>{customization.fabric}</strong></p>
                  <p className="fabric-feel">
                    {customization.fabric === 'Silk Chiffon' && 'Lightweight, flowing, elegant drape'}
                    {customization.fabric === 'Italian Satin' && 'Smooth, lustrous, premium finish'}
                    {customization.fabric === 'Crepe' && 'Matte texture, fluid movement'}
                    {customization.fabric === 'Velvet' && 'Rich, plush, luxurious feel'}
                    {customization.fabric === 'Linen Blend' && 'Breathable, natural, effortless'}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="delivery-timeline">
              <h4>Production Timeline</h4>
              <div className="timeline-bar">
                <div className="timeline-progress" style={{ width: '25%' }}></div>
              </div>
              <div className="timeline-steps">
                <div className="step">
                  <span>📝</span>
                  <small>Order<br/>Confirmed</small>
                </div>
                <div className="step">
                  <span>✂️</span>
                  <small>Cutting<br/>& Sewing</small>
                </div>
                <div className="step">
                  <span>🎨</span>
                  <small>Embroidery<br/>& Details</small>
                </div>
                <div className="step">
                  <span>✨</span>
                  <small>Quality<br/>Control</small>
                </div>
                <div className="step">
                  <span>📦</span>
                  <small>Shipping</small>
                </div>
              </div>
              <p className="delivery-estimate">Estimated Delivery: 3-4 weeks</p>
            </div>

            {/* Action Buttons */}
            <div className="preview-actions">
              <button className="btn-secondary" onClick={onBack}>
                Modify Design
              </button>
              <button className="btn-primary" onClick={onSubmit}>
                Confirm & Place Order →
              </button>
            </div>
          </div>
        </div>

        {/* Similar Recommendations */}
        <div className="recommendations">
          <h3>You Might Also Like</h3>
          <div className="rec-grid">
            <div className="rec-card">
              <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Similar" />
              <p>Matching Clutch</p>
              <span>€89</span>
            </div>
            <div className="rec-card">
              <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Similar" />
              <p>Silk Shawl</p>
              <span>€129</span>
            </div>
            <div className="rec-card">
              <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Similar" />
              <p>Statement Belt</p>
              <span>€49</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;