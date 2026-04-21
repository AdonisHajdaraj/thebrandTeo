// admin/CustomOrdersManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const CustomOrdersManager = ({ onRefresh }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await supabase
        .from('custom_orders')
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
      in_progress: 'Në punim',
      completed: 'Përfunduar',
      cancelled: 'Anuluar'
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Porositë Custom</h1>
      </div>

      <div className="filters-bar">
        <div className="filter-tabs">
          <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
            Të gjitha
          </button>
          <button className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
            Në pritje
          </button>
          <button className={`filter-tab ${filterStatus === 'in_progress' ? 'active' : ''}`} onClick={() => setFilterStatus('in_progress')}>
            Në punim
          </button>
          <button className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`} onClick={() => setFilterStatus('completed')}>
            Përfunduar
          </button>
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
                <th>Ngjyra</th>
                <th>Madhësia</th>
                <th>Çmimi</th>
                <th>Statusi</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id?.slice(0, 8)}...</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>{order.dress_type}</td>
                  <td>
                    <div className="color-preview">
                      <span className="color-dot" style={{ backgroundColor: order.color }}></span>
                      {order.color}
                    </div>
                  </td>
                  <td>{order.size}</td>
                  <td>€{order.price}</td>
                  <td>
                    <select
                      className={`status-select ${order.status}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Në pritje</option>
                      <option value="in_progress">Në punim</option>
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

      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detajet e Porosisë Custom</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Klienti</h3>
                <p><strong>Emri:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                {selectedOrder.customer_phone && <p><strong>Telefon:</strong> {selectedOrder.customer_phone}</p>}
              </div>

              <div className="detail-section">
                <h3>Detajet e Fustanit</h3>
                <p><strong>Lloji:</strong> {selectedOrder.dress_type}</p>
                <p><strong>Ngjyra:</strong> 
                  <span className="color-dot" style={{ backgroundColor: selectedOrder.color, marginLeft: '8px' }}></span>
                  {selectedOrder.color}
                </p>
                <p><strong>Madhësia:</strong> {selectedOrder.size}</p>
                <p><strong>Detaje shtesë:</strong> {selectedOrder.details || 'Asnjë'}</p>
                <p><strong>Çmimi:</strong> €{selectedOrder.price}</p>
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

export default CustomOrdersManager;