// Cart.jsx - Me pagesë vetëm kesh dhe ruajtje në Supabase
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './style/Cart.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

const CartItemCard = ({ item, onRemove, onDecrement, onIncrement }) => {
  return (
    <div className="cart-item-card">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <div className="item-header">
          <div>
            <h3>{item.name}</h3>
            <span className={`item-badge ${item.orderType}`}>
              {item.orderType === 'standard' ? 'Standard' : 'E personalizuar'}
            </span>
          </div>
          <button className="remove-btn" onClick={() => onRemove(item.id)}>
            ✕
          </button>
        </div>

        <div className="item-attributes">
          <span className="attribute">Madhësia: {item.size}</span>
          <span className="attribute">Ngjyra: {item.color}</span>
          {item.customizations && (
            <span className="attribute custom">✨ {item.customizations}</span>
          )}
        </div>

        <div className="item-footer">
          <div className="quantity-control">
            <button onClick={() => onDecrement(item.id)} disabled={item.quantity <= 1}>
              −
            </button>
            <span className="quantity">{item.quantity}</span>
            <button onClick={() => onIncrement(item.id)}>
              +
            </button>
          </div>

          <div className="item-price">
            {item.originalPrice && (
              <span className="original-price">€{item.originalPrice * item.quantity}</span>
            )}
            <span className="current-price">€{item.price * item.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const updateItemQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, cartItems.find(item => item.id === id)?.orderType || 'standard', newQuantity);
  };

  const removeItem = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      removeFromCart(id, item.orderType);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'TEO20') {
      setDiscount(0.2);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(0.1);
      setPromoApplied(true);
    } else {
      alert('Kodi i zbritjes nuk është i vlefshëm.');
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setPromoApplied(false);
    setPromoCode('');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    return calculateSubtotal() * discount;
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 300 ? 0 : 15;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount() + calculateShipping();
  };

  // Gjenero numrin e porosisë
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validimi
    if (!customerInfo.name || !customerInfo.surname || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Ju lutem plotësoni të gjitha fushat e detyrueshme!');
      return;
    }

    setLoading(true);

    try {
      // Gjenero numrin e porosisë
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);

      // Përgatit totalin
      const subtotal = calculateSubtotal();
      const discountAmount = calculateDiscountAmount();
      const shipping = calculateShipping();
      const total = calculateTotal();

      // 1. Ruaj porosinë në tabelën orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: newOrderNumber,
            customer_name: `${customerInfo.name} ${customerInfo.surname}`,
            customer_email: customerInfo.email,
            customer_phone: customerInfo.phone,
            total: total,
            status: 'pending',
            address: `${customerInfo.address}${customerInfo.city ? ', ' + customerInfo.city : ''}`,
            notes: customerInfo.notes || null
          }
        ])
        .select('id')
        .single();

      if (orderError) {
        console.error('Gabim gjatë ruajtjes së porosisë:', orderError);
        throw orderError;
      }

      // 2. Ruaj artikujt e porosisë
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Gabim gjatë ruajtjes së artikujve:', itemsError);
        throw itemsError;
      }

      // 3. Përditëso stokun e produkteve (zvogëlo sasinë)
      for (const item of cartItems) {
        if (item.id) {
          // Merr produktin aktual
          const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();

          if (product) {
            const newStock = Math.max(0, (product.stock || 0) - item.quantity);
            await supabase
              .from('products')
              .update({ 
                stock: newStock,
                in_stock: newStock > 0
              })
              .eq('id', item.id);
          }
        }
      }

      // Pastro shportën dhe shfaq suksesin
      clearCart();
      setOrderPlaced(true);
      setShowCheckoutModal(false);

    } catch (error) {
      console.error('Gabim gjatë finalizimit të porosisë:', error);
      alert('Ndodhi një gabim gjatë dërgimit të porosisë. Ju lutem provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <Sidebar />
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <span>✓</span>
            </div>
            <h2>Porosia u konfirmua!</h2>
            <p className="success-message">
              Faleminderit për porosinë tuaj! Ne do t'ju kontaktojmë në numrin e telefonit ose emailin që keni dhënë për të konfirmuar detajet e pagesës dhe dërgesës.
            </p>
            
            <div className="payment-info-card">
              <div className="payment-icon">💶</div>
              <h3>Pagesa me Kesh</h3>
              <p>Pagesa do të kryhet pasi t'ju kontaktojmë për konfirmimin e porosisë.</p>
            </div>

            <div className="contact-info-card">
              <h3>Do t'ju kontaktojmë në:</h3>
              <div className="contact-detail">
                <span>📞 {customerInfo.phone}</span>
              </div>
              <div className="contact-detail">
                <span>✉️ {customerInfo.email}</span>
              </div>
            </div>
            
            <div className="order-details">
              <h3>Detajet e porosisë</h3>
              <div className="order-number">
                <span>Numri i porosisë:</span>
                <strong>{orderNumber}</strong>
              </div>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>€{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Totali për t'u paguar:</span>
                <strong>€{calculateTotal()}</strong>
              </div>
            </div>
            
            <div className="success-actions">
              <Link to="/products" className="continue-shopping">
                <span>Vazhdo blerjen</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Sidebar />
      
      {/* Hero Section */}
      <section className="cart-hero">
        <div className="cart-hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>Shporta juaj</span>
          </div>
          <h1 className="cart-title">
            Artikujt e<br/>
            <span className="title-accent">përzgjedhur</span>
          </h1>
          <p className="cart-description">
            {cartItems.length} {cartItems.length === 1 ? 'artikull' : 'artikuj'} në shportën tuaj
          </p>
        </div>
      </section>

      {/* Main Cart Section */}
      <section className="cart-main">
        <div className="cart-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-container">
              <div className="empty-cart-content">
                <span className="empty-icon">🛍️</span>
                <h2>Shporta juaj është bosh</h2>
                <p>Eksploroni koleksionin tonë dhe shtoni artikujt tuaj të preferuar.</p>
                <Link to="/products" className="explore-btn">
                  <span>Eksploro koleksionin</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="cart-grid">
              {/* Cart Items Column */}
              <div className="cart-items-column">
                <div className="cart-header">
                  <h2>Artikujt</h2>
                  <span className="item-count">{cartItems.length} artikuj</span>
                </div>
                
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onDecrement={(id) => updateItemQuantity(id, item.quantity - 1)}
                      onIncrement={(id) => updateItemQuantity(id, item.quantity + 1)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Order Summary Column */}
              <div className="summary-column">
                <div className="summary-card">
                  <h3>Përmbledhje</h3>
                  
                  <div className="summary-rows">
                    <div className="summary-row">
                      <span>Nëntotali</span>
                      <span>€{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="summary-row discount-row">
                        <div>
                          <span>Zbritja ({discount * 100}%)</span>
                          <button onClick={removePromo} className="remove-promo">✕</button>
                        </div>
                        <span className="discount-amount">-€{calculateDiscountAmount().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="summary-row">
                      <span>Transporti</span>
                      {calculateShipping() === 0 ? (
                        <span className="free-shipping">Falas</span>
                      ) : (
                        <span>€{calculateShipping().toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row total-row">
                      <span>Totali</span>
                      <span className="total-amount">€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  {!promoApplied ? (
                    <div className="promo-section">
                      <label>Kodi i zbritjes</label>
                      <div className="promo-input">
                        <input
                          type="text"
                          placeholder="Shkruaj kodin"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button onClick={applyPromoCode}>Apliko</button>
                      </div>
                      <p className="promo-hint">Provoni TEO20 ose WELCOME10</p>
                    </div>
                  ) : (
                    <div className="promo-applied">
                      <span>✓ Kodi u aplikua ({discount * 100}% zbritje)</span>
                    </div>
                  )}
                  
                  {/* Free Shipping Message */}
                  {calculateSubtotal() < 300 && (
                    <div className="shipping-message">
                      <span>Shtoni edhe €{(300 - calculateSubtotal()).toFixed(0)} për transport falas</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min((calculateSubtotal() / 300) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    className="checkout-btn"
                    onClick={() => setShowCheckoutModal(true)}
                  >
                    <span>Vazhdo te pagesa</span>
                    <span className="btn-arrow">→</span>
                  </button>
                  
                  <Link to="/products" className="continue-link">
                    ← Vazhdo blerjen
                  </Link>
                </div>
                
                {/* Payment Methods - Vetëm Kesh */}
                <div className="payment-methods">
                  <span>Mënyra e pagesës</span>
                  <div className="payment-icons">
                    <span className="cash-payment">💶 Kesh</span>
                  </div>
                  <p className="payment-note">
                    Pagesa kryhet pas konfirmimit të porosisë nga stafi ynë.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* You May Also Like */}
      {cartItems.length > 0 && (
        <section className="recommended">
          <div className="recommended-container">
            <h2>Mund t'ju pëlqejë gjithashtu</h2>
            <div className="recommended-grid">
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Recommended" />
                <h4>Golden Hour</h4>
                <p>€299</p>
              </div>
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Recommended" />
                <h4>Emerald Dream</h4>
                <p>€219</p>
              </div>
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Recommended" />
                <h4>Blush Pink</h4>
                <p>€259</p>
              </div>
              <div className="recommended-item">
                <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Recommended" />
                <h4>Summer Breeze</h4>
                <p>€89</p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCheckoutModal(false)}>✕</button>
            
            <div className="modal-header">
              <h2>Finalizo porosinë</h2>
              <p>Plotësoni të dhënat e kontaktit për konfirmim</p>
            </div>
            
            <form className="checkout-form" onSubmit={handleCheckout}>
              <div className="form-row">
                <div className="form-field">
                  <label>Emri *</label>
                  <input
                    type="text"
                    placeholder="Emri juaj"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Mbiemri *</label>
                  <input
                    type="text"
                    placeholder="Mbiemri juaj"
                    value={customerInfo.surname}
                    onChange={(e) => setCustomerInfo({...customerInfo, surname: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    placeholder="+355 69 123 4567"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-field">
                <label>Adresa *</label>
                <input
                  type="text"
                  placeholder="Rruga, numri"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Qyteti</label>
                <input
                  type="text"
                  placeholder="Tiranë"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                />
              </div>
              
              <div className="form-field">
                <label>Shënime shtesë</label>
                <textarea
                  rows="3"
                  placeholder="Detaje shtesë për porosinë..."
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                />
              </div>
              
              <div className="payment-method-info">
                <div className="payment-method-header">
                  <span className="payment-icon">💶</span>
                  <span className="payment-method-name">Pagesë me Kesh</span>
                </div>
                <p className="payment-method-description">
                  Do t'ju kontaktojmë në numrin e telefonit ose emailin tuaj për të konfirmuar porosinë dhe për të rënë dakord për mënyrën e pagesës dhe dërgesës.
                </p>
              </div>
              
              <div className="order-summary-mini">
                <div className="summary-row">
                  <span>Totali për t'u paguar:</span>
                  <strong>€{calculateTotal().toFixed(2)}</strong>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCheckoutModal(false)}>
                  Anulo
                </button>
                <button type="submit" className="btn-confirm" disabled={loading}>
                  {loading ? (
                    <span>Duke u përpunuar...</span>
                  ) : (
                    <>
                      <span>Konfirmo porosinë</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;