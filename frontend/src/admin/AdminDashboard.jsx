// admin/AdminDashboard.jsx - ME IMPORTET E SAKTA PËR STRUKTURËN TËNDE
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import AdminSidebar from './AdminSidebar';
import DashboardHome from './DashboardHome';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import CustomOrdersManager from './CustomOrdersManager';
import MessagesManager from './MessagesManager';
import AdminsManager from './AdminsManager';

// Import CSS të ndara nga admin/style/
import './style/admin-base.css';
import './style/admin-sidebar.css';
import './style/adminDashboard.css';
import './style/admin-products.css';
import './style/admin-orders.css';
import './style/admin-messages.css';
import './style/admin-admins.css';
import './style/admin-modals.css';
import './style/admin-responsive.css';

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    totalProducts: 0,
    lowStock: 0,
    customOrders: 0,
    totalAdmins: 0,
    activeAdmins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      setCurrentAdmin(JSON.parse(adminData));
    } else {
      window.location.href = '/admin/login';
    }
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const fetchStats = async () => {
    try {
      const { data: products } = await supabase.from('products').select('*');
      const { data: orders } = await supabase.from('orders').select('*');
      const { data: customOrders } = await supabase.from('custom_orders').select('*');
      const { data: messages } = await supabase.from('messages').select('*');
      const { data: admins } = await supabase.from('admins').select('*');

      setStats({
        totalOrders: orders?.length || 0,
        totalRevenue: orders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + parseFloat(o.total), 0) || 0,
        pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
        unreadMessages: messages?.filter(m => !m.read).length || 0,
        totalProducts: products?.length || 0,
        lowStock: products?.filter(p => p.stock < 5).length || 0,
        customOrders: customOrders?.length || 0,
        totalAdmins: admins?.length || 0,
        activeAdmins: admins?.filter(a => a.status === 'active').length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdmin) {
      fetchStats();
    }
  }, [currentAdmin]);

  const handleMobileToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleOverlayClick = () => {
    setMobileSidebarOpen(false);
  };

  const handleNavClick = () => {
    setMobileSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Duke u ngarkuar paneli i administrimit...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <button 
        className="sidebar-mobile-toggle"
        onClick={handleMobileToggle}
        aria-label={mobileSidebarOpen ? 'Mbyll menunë' : 'Hap menunë'}
      >
        {mobileSidebarOpen ? '✕' : '☰'}
      </button>

      {mobileSidebarOpen && (
        <div className="sidebar-mobile-overlay" onClick={handleOverlayClick} />
      )}

      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          stats={stats}
          currentAdmin={currentAdmin}
          onNavClick={handleNavClick}
        />
      </div>

      <div className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Routes>
          <Route path="dashboard" element={<DashboardHome stats={stats} />} />
          <Route path="products" element={<ProductsManager onRefresh={fetchStats} />} />
          <Route path="orders" element={<OrdersManager onRefresh={fetchStats} />} />
          <Route path="custom-orders" element={<CustomOrdersManager onRefresh={fetchStats} />} />
          <Route path="messages" element={<MessagesManager onRefresh={fetchStats} />} />
          <Route path="admins" element={<AdminsManager currentAdmin={currentAdmin} onRefresh={fetchStats} />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;