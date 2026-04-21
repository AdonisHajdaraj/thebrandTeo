// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './user/Home';
import About from './user/About';
import Customize3D from './user/Customize3D';
import Products from './user/Products';
import Cart from './user/Cart';
import ContactUs from './user/ContactUs';
import { CartProvider } from './user/CartContext';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Routes>
            {/* Rrugët publike */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/customize" element={<Customize3D />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Admin Login - publike */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Dashboard - e mbrojtur, me /* për nën-rrugët */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Ridrejto /admin te /admin/dashboard */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* 404 - Faqe nuk u gjet */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;