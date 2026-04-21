// AdminSidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Mbetet siç është:
import { supabase } from '../supabase';

const AdminSidebar = ({ collapsed, setCollapsed, stats, currentAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const canManageAdmins = currentAdmin?.role === 'super_admin' || currentAdmin?.role === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { id: 'orders', label: 'Porositë', icon: '📦', path: '/admin/orders', badge: stats?.pendingOrders },
    { id: 'custom-orders', label: 'Porosi Custom', icon: '✨', path: '/admin/custom-orders', badge: stats?.customOrders },
    { id: 'products', label: 'Produktet', icon: '👗', path: '/admin/products' },
    { id: 'messages', label: 'Mesazhet', icon: '💬', path: '/admin/messages', badge: stats?.unreadMessages },
    ...(canManageAdmins ? [{ id: 'admins', label: 'Administratorët', icon: '👥', path: '/admin/admins' }] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>TEO Admin</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">{currentAdmin?.avatar || 'A'}</div>
          <div className="admin-details">
            <span className="admin-name">{currentAdmin?.name || 'Admin'}</span>
            <span className="admin-role">{currentAdmin?.role || 'admin'}</span>
          </div>
        </div>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Dilni</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;