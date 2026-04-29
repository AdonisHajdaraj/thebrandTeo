// Cart.jsx - Pa zbritje dhe pa transport, vetëm porosit dhe kontakto për çmim

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './style/Cart.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

const CartItemCard = ({ item, onRemove, onDecrement, onIncrement }) => {
  const orderLabel = item.orderType === 'rent' ? 'Rent' : item.orderType === 'custom' ? 'E personalizuar' : 'Standard';

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
              {orderLabel}
            </span>
          </div>
          <button className="remove-btn" onClick={() => onRemove(item.id, item.orderType)}>
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
            <button onClick={() => onDecrement(item.id, item.orderType)} disabled={item.quantity <= 1}>
              −
            </button>
            <span className="quantity">{item.quantity}</span>
            <button onClick={() => onIncrement(item.id, item.orderType)}>
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

  const updateItemQuantity = (id, orderType, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, orderType || cartItems.find(item => item.id === id)?.orderType || 'standard', newQuantity);
  };

  const removeItem = (id, orderType) => {
    removeFromCart(id, orderType || cartItems.find(item => item.id === id)?.orderType || 'standard');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

      // Përgatit totalin (pa transport)
      const total = calculateSubtotal();

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

      // 2. Ruaj artikujt e porosisë me order_type
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_name: item.orderType === 'rent' ? `${item.name} (Rent)` : item.name,
        quantity: item.quantity,
        price: item.price,
        order_type: item.orderType || 'standard'
      }));

      console.log('📦 Order items to save:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Gabim gjatë ruajtjes së artikujve:', itemsError);
        throw itemsError;
      }

      // 3. Përditëso stokun e produkteve (zvogëlo sasinë) - vetëm për produkte jo rent
      for (const item of cartItems) {
        if (item.id && item.orderType !== 'rent') {
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

      console.log('✅ Order placed successfully:', {
        orderId: orderData.id,
        orderNumber: newOrderNumber,
        itemsCount: orderItems.length,
        rentItems: orderItems.filter(i => i.order_type === 'rent').length
      });

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
            <h2>Porosia u dërgua!</h2>
            <p className="success-message">
              Faleminderit për porosinë tuaj! Ne do t'ju kontaktojmë në numrin e telefonit ose emailin që keni dhënë për të konfirmuar detajet dhe për të diskutuar çmimin final.
            </p>
            
            <div className="price-notice-card">
              <div className="price-notice-icon">💰</div>
              <h3>Për çmimin do t'ju kontaktojmë</h3>
              <p>Çmimi final do të konfirmohet pasi të shqyrtojmë porosinë tuaj. Ne do t'ju kontaktojmë për të rënë dakord për detajet e pagesës dhe dërgesës.</p>
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
              <h3>Përmbledhje e porosisë</h3>
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
                <span>Totali i përkohshëm:</span>
                <strong>€{calculateSubtotal()}</strong>
              </div>
              <div className="price-confirm-note">
                <small>* Çmimi final do të konfirmohet pas kontaktit</small>
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
                      onDecrement={(id) => updateItemQuantity(id, item.orderType, item.quantity - 1)}
                      onIncrement={(id) => updateItemQuantity(id, item.orderType, item.quantity + 1)}
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
                      <span>Totali i artikujve</span>
                      <span>€{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row total-row">
                      <span>Totali i përkohshëm</span>
                      <span className="total-amount">€{calculateSubtotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Price Notice - Për çmimin do kontaktojmë */}
                  <div className="price-notice-box">
                    <div className="price-notice-icon">💬</div>
                    <div className="price-notice-text">
                      <strong>Për çmimin final do t'ju kontaktojmë</strong>
                      <p>Çmimi mund të ndryshojë në varësi të porosisë. Ne do t'ju konfirmojmë çmimin përfundimtar pasi të shqyrtojmë kërkesën tuaj.</p>
                    </div>
                  </div>
                  
                  <button 
                    className="checkout-btn"
                    onClick={() => setShowCheckoutModal(true)}
                  >
                    <span>Porosit tani</span>
                    <span className="btn-arrow">→</span>
                  </button>
                  
                  <Link to="/products" className="continue-link">
                    ← Vazhdo blerjen
                  </Link>
                </div>
                
                {/* Payment Methods - Pa transport, pa zbritje */}
                <div className="payment-methods">
                  <span>Mënyra e pagesës</span>
                  <div className="payment-icons">
                    <span className="cash-payment">💶 Do të konfirmohet</span>
                  </div>
                  <p className="payment-note">
                    Mënyra e pagesës, transporti dhe çmimi final do të konfirmohen pasi t'ju kontaktojmë.
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
              <h2>Porosit tani</h2>
              <p>Plotësoni të dhënat tuaja për të dërguar porosinë</p>
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
              
              <div className="price-info-modal">
                <div className="price-info-icon">💰</div>
                <div className="price-info-content">
                  <strong>Për çmimin do t'ju kontaktojmë</strong>
                  <p>Çmimi final do të konfirmohet pasi të shqyrtojmë porosinë tuaj. Ne do t'ju kontaktojmë për të rënë dakord për detajet e pagesës dhe transportit.</p>
                </div>
              </div>
              
              <div className="order-summary-mini">
                <div className="summary-row">
                  <span>Totali i artikujve:</span>
                  <strong>€{calculateSubtotal().toFixed(2)}</strong>
                </div>
                <div className="price-confirm-small">
                  <small>* Transporti dhe çmimi final do të konfirmohen pas kontaktit</small>
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
                      <span>Dërgo porosinë</span>
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