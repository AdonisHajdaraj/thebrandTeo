// admin/DashboardHome.jsx
import React from 'react';

const DashboardHome = ({ stats }) => {
  const statCards = [
    { icon: '📦', label: 'Total Porosi', value: stats.totalOrders, color: '#8b7355' },
    { icon: '💰', label: 'Të ardhura', value: `€${stats.totalRevenue.toFixed(0)}`, color: '#4caf50' },
    { icon: '⏳', label: 'Në pritje', value: stats.pendingOrders, color: '#ff9800' },
    { icon: '👗', label: 'Produkte', value: stats.totalProducts, color: '#2196f3' },
    { icon: '💬', label: 'Mesazhe të palexuara', value: stats.unreadMessages, color: '#f44336' },
    { icon: '✨', label: 'Porosi Custom', value: stats.customOrders, color: '#9c27b0' }
  ];

  return (
    <div className="admin-content dashboard-home">
      <div className="content-header">
        <h1>Dashboard</h1>
        <p>Mirë se vini në panelin e administrimit</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="info-section">
          <h3>📊 Përmbledhje e Shpejtë</h3>
          <div className="info-grid">
            <div className="info-item">
              <span>Produkte me stok të ulët</span>
              <strong>{stats.lowStock}</strong>
            </div>
            <div className="info-item">
              <span>Total Adminë</span>
              <strong>{stats.totalAdmins}</strong>
            </div>
            <div className="info-item">
              <span>Adminë Aktivë</span>
              <strong>{stats.activeAdmins}</strong>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>🚀 Veprime të Shpejta</h3>
          <div className="quick-actions">
            <button onClick={() => window.location.href = '/admin/products'} className="quick-action-btn">
              <span>👗</span> Menaxho Produktet
            </button>
            <button onClick={() => window.location.href = '/admin/orders'} className="quick-action-btn">
              <span>📦</span> Shiko Porositë
            </button>
            <button onClick={() => window.location.href = '/admin/messages'} className="quick-action-btn">
              <span>💬</span> Lexo Mesazhet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;