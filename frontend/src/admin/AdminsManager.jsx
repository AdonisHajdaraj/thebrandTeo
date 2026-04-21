// admin/AdminsManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminsManager = ({ currentAdmin, onRefresh }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
    status: 'active'
  });

  const roles = [
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Admin' },
    ...(currentAdmin?.role === 'super_admin' ? [{ value: 'super_admin', label: 'Super Admin' }] : [])
  ];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAdmins(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Plotësoni të gjitha fushat!');
      return;
    }

    if (!editingAdmin && !formData.password) {
      alert('Vendosni fjalëkalimin!');
      return;
    }

    try {
      if (editingAdmin) {
        await supabase
          .from('admins')
          .update({
            name: formData.name,
            role: formData.role,
            status: formData.status
          })
          .eq('id', editingAdmin.id);
      } else {
        // Krijo përdorues në Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        // Shto në tabelën admins
        await supabase.from('admins').insert([{
          user_id: authData.user.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          avatar: formData.name.charAt(0).toUpperCase()
        }]);
      }

      fetchAdmins();
      if (onRefresh) onRefresh();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving admin:', error);
      alert('Gabim: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    const admin = admins.find(a => a.id === id);
    if (admin?.role === 'super_admin') {
      alert('Nuk mund të fshini Super Admin!');
      return;
    }

    if (!window.confirm('Jeni të sigurt?')) return;

    try {
      await supabase.from('admins').delete().eq('id', id);
      fetchAdmins();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Gabim gjatë fshirjes!');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await supabase
        .from('admins')
        .update({ status: currentStatus === 'active' ? 'inactive' : 'active' })
        .eq('id', id);
      
      fetchAdmins();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      status: 'active'
    });
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      status: admin.status
    });
    setShowModal(true);
  };

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      editor: 'Editor'
    };
    return labels[role] || role;
  };

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Administratorët</h1>
        {currentAdmin?.role === 'super_admin' && (
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <span>+</span> Shto Admin
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Duke u ngarkuar...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Email</th>
                <th>Roli</th>
                <th>Statusi</th>
                <th>Krijuar më</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>
                    <div className="admin-info-cell">
                      <div className="admin-avatar-small">{admin.avatar || admin.name?.charAt(0)}</div>
                      <span>{admin.name}</span>
                    </div>
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={`role-badge ${admin.role}`}>
                      {getRoleLabel(admin.role)}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${admin.status}`}
                      onClick={() => handleToggleStatus(admin.id, admin.status)}
                      disabled={admin.role === 'super_admin' || currentAdmin?.role !== 'super_admin'}
                    >
                      {admin.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </button>
                  </td>
                  <td>{new Date(admin.created_at).toLocaleDateString('sq-AL')}</td>
                  <td>
                    <div className="action-buttons">
                      {(currentAdmin?.role === 'super_admin' || currentAdmin?.id === admin.id) && (
                        <button className="btn-edit" onClick={() => handleEdit(admin)}>✏️</button>
                      )}
                      {currentAdmin?.role === 'super_admin' && admin.role !== 'super_admin' && (
                        <button className="btn-delete" onClick={() => handleDelete(admin.id)}>🗑️</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAdmin ? 'Ndrysho Admin' : 'Shto Admin të Ri'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Emri i plotë *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  disabled={!!editingAdmin}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  {editingAdmin ? 'Fjalëkalimi i ri (opsional)' : 'Fjalëkalimi *'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required={!editingAdmin}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Roli</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    disabled={currentAdmin?.role !== 'super_admin'}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Statusi</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Anulo
                </button>
                <button type="submit" className="btn-save">
                  {editingAdmin ? 'Ruaj Ndryshimet' : 'Shto Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsManager;