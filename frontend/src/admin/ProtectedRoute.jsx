// admin/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');
  
  // Nëse nuk ka token ose adminData, ridrejto te login
  if (!token || !adminData) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Verifiko nëse token është i vlefshëm (opsionale)
  try {
    const admin = JSON.parse(adminData);
    if (!admin || !admin.id) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;