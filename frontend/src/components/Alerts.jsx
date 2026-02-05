import React, { useState, useEffect } from 'react';
import { Bell, X, Plus, AlertCircle, Check, Trash2 } from 'lucide-react';
import { portfolioAPI, storage } from '../api';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    symbol: '',
    alert_type: 'price_above',
    target_value: '',
    notes: ''
  });

  const userId = storage.getUserId();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const fetchData = async () => {
    try {
      const [alertsData, positionsData] = await Promise.all([
        axios.get(`${API}/alerts?user_id=${userId}`),
        portfolioAPI.getPositions(userId)
      ]);
      setAlerts(alertsData.data);
      setPositions(positionsData);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAlert = async () => {
    try {
      await axios.post(
        `${API}/alerts?user_id=${userId}`,
        {
          symbol: formData.symbol.toUpperCase(),
          alert_type: formData.alert_type,
          target_value: parseFloat(formData.target_value),
          notes: formData.notes
        }
      );
      await fetchData();
      setShowCreateModal(false);
      setFormData({ symbol: '', alert_type: 'price_above', target_value: '', notes: '' });
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Erreur lors de la création de l\'alerte');
    }
  };

  const handleToggleAlert = async (alertId, isActive) => {
    try {
      await axios.put(`${API}/alerts/${alertId}?user_id=${userId}&is_active=${!isActive}`);
      await fetchData();
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Supprimer cette alerte ?')) return;
    try {
      await axios.delete(`${API}/alerts/${alertId}?user_id=${userId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const getAlertTypeLabel = (type) => {
    switch(type) {
      case 'price_above': return 'Prix au-dessus de';
      case 'price_below': return 'Prix en-dessous de';
      case 'volatility_high': return 'Volatilité supérieure à';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="display-md" style={{ marginBottom: '8px' }}>Alertes</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)' }}>Soyez notifié des mouvements importants</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Créer une alerte
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Alertes actives</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-primary)' }}>
            {alerts.filter(a => a.is_active).length}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Alertes déclenchées</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--danger)' }}>
            {alerts.filter(a => a.is_triggered).length}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                style={{
                  padding: '20px',
                  background: alert.is_triggered ? 'var(--danger-bg)' : 'var(--bg-tertiary)',
                  border: alert.is_triggered ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Bell size={20} color={alert.is_triggered ? 'var(--danger)' : 'var(--accent-primary)'} />
                    <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {alert.symbol}
                    </span>
                    {alert.is_triggered && (
                      <span className="badge badge-danger">DÉCLENCHÉE</span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {getAlertTypeLabel(alert.alert_type)} {alert.alert_type.includes('price') ? formatCurrency(alert.target_value) : `${alert.target_value}%`}
                  </div>
                  {alert.notes && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {alert.notes}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      background: alert.is_active ? 'var(--success-bg)' : 'var(--bg-primary)',
                      color: alert.is_active ? 'var(--success)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {alert.is_active ? <Check size={16} /> : <X size={16} />}
                    {alert.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'var(--danger-bg)',
                      color: 'var(--danger)',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '16px' }}>
            Aucune alerte configurée
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Créez des alertes pour être notifié des mouvements importants de vos positions
          </p>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Créer ma première alerte
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>

            <h2 className="h2" style={{ marginBottom: '24px' }}>Créer une alerte</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Symbole
                </label>
                <select
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="input-field"
                >
                  <option value="">Sélectionner un titre</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.symbol}>{pos.symbol} - {pos.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Type d'alerte
                </label>
                <select
                  value={formData.alert_type}
                  onChange={(e) => setFormData({ ...formData, alert_type: e.target.value })}
                  className="input-field"
                >
                  <option value="price_above">Prix au-dessus de</option>
                  <option value="price_below">Prix en-dessous de</option>
                  <option value="volatility_high">Volatilité supérieure à</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Valeur cible {formData.alert_type.includes('price') ? '(€)' : '(%)'}
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder={formData.alert_type.includes('price') ? 'Ex: 200' : 'Ex: 50'}
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Notes (optionnel)
                </label>
                <textarea
                  placeholder="Ajouter une note..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button 
                className="btn-primary" 
                onClick={handleCreateAlert}
                disabled={!formData.symbol || !formData.target_value}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Bell size={20} />
                Créer l'alerte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
