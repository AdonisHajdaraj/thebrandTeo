// admin/OrdersManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const OrdersManager = ({ onRefresh }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemPriceEdits, setItemPriceEdits] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const transformed = data.map(order => ({
        ...order,
        total: parseFloat(order.total),
        items: order.order_items?.map(item => ({
          ...item,
          price: parseFloat(item.price),
          orderType: item.order_type || (item.product_name?.includes('(Rent)') ? 'rent' : 'standard')
        })) || []
      }));
      setOrders(transformed);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      fetchOrders();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Në pritje',
      processing: 'Në proces',
      completed: 'Përfunduar',
      cancelled: 'Anuluar'
    };
    return labels[status] || status;
  };

  // Kontrollon nëse porosia ka artikuj rent
  const hasRentItems = (order) => {
    return order.items?.some(item => item.orderType === 'rent');
  };

  // Kontrollon nëse porosia është vetëm rent
  const isOnlyRent = (order) => {
    return order.items?.length > 0 && order.items?.every(item => item.orderType === 'rent');
  };

  // Kontrollon nëse porosia është e përzier (ka dhe rent dhe standard)
  const isMixedOrder = (order) => {
    const hasRent = order.items?.some(item => item.orderType === 'rent');
    const hasStandard = order.items?.some(item => item.orderType !== 'rent');
    return hasRent && hasStandard;
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        order.customer_name?.toLowerCase().includes(search) ||
        order.customer_email?.toLowerCase().includes(search) ||
        order.id?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const handlePriceChange = (itemId, value) => {
    setItemPriceEdits(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleUpdateRentPrice = async (item) => {
    const newPrice = parseFloat(itemPriceEdits[item.id] ?? item.price);
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Shkruani një çmim valid për rent.');
      return;
    }

    try {
      await supabase.from('order_items').update({ price: newPrice }).eq('id', item.id);

      const updatedItems = selectedOrder.items.map(i =>
        i.id === item.id ? { ...i, price: newPrice } : i
      );
      const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      await supabase.from('orders').update({ total: newTotal }).eq('id', selectedOrder.id);

      setSelectedOrder({ ...selectedOrder, items: updatedItems, total: newTotal });
      setItemPriceEdits(prev => ({ ...prev, [item.id]: '' }));
      fetchOrders();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating rent price:', error);
      alert('Ndodhi një problem gjatë përditësimit të çmimit të rent.');
    }
  };

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Porositë</h1>
        <div className="order-stats">
          <span className="stat-badge rent">Rent: {orders.filter(o => isOnlyRent(o)).length}</span>
          <span className="stat-badge mixed">Të Përziera: {orders.filter(o => isMixedOrder(o)).length}</span>
          <span className="stat-badge standard">Blerje: {orders.filter(o => !hasRentItems(o)).length}</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-tabs">
          <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
            Të gjitha
          </button>
          <button className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
            Në pritje
          </button>
          <button className={`filter-tab ${filterStatus === 'processing' ? 'active' : ''}`} onClick={() => setFilterStatus('processing')}>
            Në proces
          </button>
          <button className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`} onClick={() => setFilterStatus('completed')}>
            Përfunduar
          </button>
          <button className={`filter-tab ${filterStatus === 'cancelled' ? 'active' : ''}`} onClick={() => setFilterStatus('cancelled')}>
            Anuluar
          </button>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Kërko porosi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Duke u ngarkuar...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Klienti</th>
                <th>Email</th>
                <th>Lloji</th>
                <th>Data</th>
                <th>Totali</th>
                <th>Statusi</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className={hasRentItems(order) ? 'rent-order-row' : ''}>
                  <td className="order-id">{order.id?.slice(0, 8)}...</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>
                    {isOnlyRent(order) && <span className="order-type-badge rent">Rent</span>}
                    {isMixedOrder(order) && <span className="order-type-badge mixed">Blerje + Rent</span>}
                    {!hasRentItems(order) && <span className="order-type-badge standard">Blerje</span>}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString('sq-AL')}</td>
                  <td>€{order.total}</td>
                  <td>
                    <select
                      className={`status-select ${order.status}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Në pritje</option>
                      <option value="processing">Në proces</option>
                      <option value="completed">Përfunduar</option>
                      <option value="cancelled">Anuluar</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      👁️ Shiko
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal për detajet e porosisë */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detajet e Porosisë</h2>
              {hasRentItems(selectedOrder) && (
                <span className="modal-order-type">
                  {isOnlyRent(selectedOrder) ? 'Porosi Rent' : 'Porosi e Përzier'}
                </span>
              )}
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="order-info-section">
                <h3>Informacioni i Klientit</h3>
                <p><strong>Emri:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                {selectedOrder.customer_phone && <p><strong>Telefon:</strong> {selectedOrder.customer_phone}</p>}
                {selectedOrder.address && <p><strong>Adresa:</strong> {selectedOrder.address}</p>}
                {selectedOrder.notes && <p><strong>Shënime:</strong> {selectedOrder.notes}</p>}
                
                {hasRentItems(selectedOrder) && (
                  <div className="rent-info-box">
                    <span className="rent-info-icon">📋</span>
                    <p>Kjo porosi përmban artikuj me qira (rent)</p>
                  </div>
                )}
              </div>

              <div className="order-items-section">
                <h3>Artikujt e Porositur</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Produkti</th>
                      <th>Lloji</th>
                      <th>Sasia</th>
                      <th>Çmimi</th>
                      <th>Totali</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className={item.orderType === 'rent' ? 'rent-item-row' : ''}>
                        <td>{item.product_name}</td>
                        <td>
                          {item.orderType === 'rent' ? (
                            <span className="order-item-tag rent">Rent</span>
                          ) : (
                            <span className="order-item-tag standard">Blerje</span>
                          )}
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {item.orderType === 'rent' ? (
                            <div className="rent-price-editor">
                              <input
                                type="number"
                                min="0"
                                value={itemPriceEdits[item.id] ?? item.price}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn-save-price"
                                onClick={() => handleUpdateRentPrice(item)}
                              >
                                Ruaj
                              </button>
                            </div>
                          ) : (
                            `€${item.price}`
                          )}
                        </td>
                        <td>€{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4"><strong>Totali</strong></td>
                      <td><strong>€{selectedOrder.total}</strong></td>
                    </tr>
                    {hasRentItems(selectedOrder) && (
                      <tr className="rent-summary-row">
                        <td colSpan="5">
                          <div className="rent-summary">
                            <span>📋 Artikujt Rent: {selectedOrder.items.filter(i => i.orderType === 'rent').length}</span>
                            <span>💰 Totali Rent: €{selectedOrder.items.filter(i => i.orderType === 'rent').reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Mbyll</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;