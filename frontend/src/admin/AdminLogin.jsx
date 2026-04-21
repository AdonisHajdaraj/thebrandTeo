// admin/AdminLogin.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase';
import './style/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hapi 1: Autentifikimi me Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError('Email ose fjalëkalim i pasaktë.');
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Përdoruesi nuk u gjet.');
        setLoading(false);
        return;
      }

      // Hapi 2: Kontrollo nëse përdoruesi është admin në tabelën admins
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        console.error('Admin check error:', adminError);
        setError('Ky përdorues nuk ka akses në panelin e administrimit.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Hapi 3: Kontrollo nëse admini është aktiv
      if (adminData.status !== 'active') {
        setError('Llogaria juaj është çaktivizuar. Kontaktoni Super Adminin.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Hapi 4: Ruaj të dhënat në localStorage
      localStorage.setItem('adminToken', authData.session.access_token);
      localStorage.setItem('adminData', JSON.stringify({
        id: adminData.id,
        user_id: adminData.user_id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
        avatar: adminData.avatar || adminData.name?.charAt(0).toUpperCase() || 'A',
        status: adminData.status
      }));

      // Hapi 5: Përditëso last_login
      await supabase
        .from('admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id);

      // Hapi 6: Ridrejto në dashboard
      window.location.href = '/admin/dashboard';

    } catch (err) {
      console.error('Login error:', err);
      setError('Gabim gjatë hyrjes. Provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <h1>TEO</h1>
              <span>Admin Panel</span>
            </div>
            <p className="login-subtitle">Hyni për të menaxhuar platformën</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Fjalëkalimi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Mbaj mend
              </label>
            </div>
            
            <button 
              type="submit" 
              className={`login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  <span>Hyni</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p>© 2024 TEO Studio. Të gjitha të drejtat e rezervuara.</p>
            <a href="/" className="back-to-site">← Kthehu në faqe</a>
          </div>
        </div>
        
        <div className="login-decoration">
          <div className="decoration-content">
            <h2>Mirë se vini në</h2>
            <h1>TEO Admin</h1>
            <p>Menaxhoni porositë, produktet dhe më shumë</p>
            <div className="decoration-image">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="TEO Studio" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;