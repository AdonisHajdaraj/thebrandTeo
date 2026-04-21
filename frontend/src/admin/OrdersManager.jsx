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
          price: parseFloat(item.price)
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

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Porositë</h1>
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
                <th>Data</th>
                <th>Totali</th>
                <th>Statusi</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id?.slice(0, 8)}...</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
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
              </div>

              <div className="order-items-section">
                <h3>Artikujt e Porositur</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Produkti</th>
                      <th>Sasia</th>
                      <th>Çmimi</th>
                      <th>Totali</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>€{item.price}</td>
                        <td>€{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3"><strong>Totali</strong></td>
                      <td><strong>€{selectedOrder.total}</strong></td>
                    </tr>
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