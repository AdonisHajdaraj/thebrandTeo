// admin/MessagesManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const MessagesManager = ({ onRefresh }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
      
      fetchMessages();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Jeni të sigurt që doni të fshini këtë mesazh?')) return;
    
    try {
      await supabase.from('messages').delete().eq('id', messageId);
      fetchMessages();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    return true;
  });

  return (
    <div className="admin-content">
      <div className="content-header">
        <h1>Mesazhet</h1>
      </div>

      <div className="filters-bar">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Të gjitha ({messages.length})
          </button>
          <button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            Të palexuara ({messages.filter(m => !m.read).length})
          </button>
          <button className={`filter-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
            Të lexuara ({messages.filter(m => m.read).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Duke u ngarkuar...</div>
      ) : (
        <div className="messages-grid">
          {filteredMessages.map(message => (
            <div key={message.id} className={`message-card ${!message.read ? 'unread' : ''}`}>
              <div className="message-header">
                <div className="sender-info">
                  <span className="sender-name">{message.name}</span>
                  <span className="sender-email">{message.email}</span>
                  {message.phone && <span className="sender-phone">{message.phone}</span>}
                </div>
                <div className="message-meta">
                  <span className="message-date">
                    {new Date(message.created_at).toLocaleDateString('sq-AL')}
                  </span>
                  {!message.read && <span className="unread-badge">E re</span>}
                </div>
              </div>

              <div className="message-subject">{message.subject}</div>
              <div className="message-preview">{message.message?.slice(0, 150)}...</div>

              <div className="message-actions">
                {!message.read && (
                  <button className="btn-mark-read" onClick={() => handleMarkAsRead(message.id)}>
                    ✓ Shëno si e lexuar
                  </button>
                )}
                <button className="btn-view" onClick={() => {
                  setSelectedMessage(message);
                  setShowModal(true);
                  if (!message.read) handleMarkAsRead(message.id);
                }}>
                  👁️ Shiko
                </button>
                <button className="btn-delete" onClick={() => handleDelete(message.id)}>
                  🗑️ Fshi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMessage.subject}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="message-detail">
                <p><strong>Nga:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                {selectedMessage.phone && <p><strong>Telefon:</strong> {selectedMessage.phone}</p>}
                <p><strong>Data:</strong> {new Date(selectedMessage.created_at).toLocaleString('sq-AL')}</p>
                <div className="message-content">
                  <strong>Mesazhi:</strong>
                  <p>{selectedMessage.message}</p>
                </div>
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

export default MessagesManager;