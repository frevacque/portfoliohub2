import React, { useState, useEffect } from 'react';
import { Target, X, Plus, TrendingUp, Trash2, CheckCircle } from 'lucide-react';
import { portfolioAPI, storage } from '../api';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    target_date: '',
    description: ''
  });

  const userId = storage.getUserId();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const fetchData = async () => {
    try {
      const [goalsData, summary] = await Promise.all([
        axios.get(`${API}/goals?user_id=${userId}`),
        portfolioAPI.getSummary(userId)
      ]);
      setGoals(goalsData.data);
      setPortfolioSummary(summary);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGoal = async () => {
    try {
      await axios.post(
        `${API}/goals?user_id=${userId}`,
        {
          title: formData.title,
          target_amount: parseFloat(formData.target_amount),
          target_date: formData.target_date ? new Date(formData.target_date).toISOString() : null,
          description: formData.description
        }
      );
      await fetchData();
      setShowCreateModal(false);
      setFormData({ title: '', target_amount: '', target_date: '', description: '' });
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Erreur lors de la création de l\'objectif');
    }
  };

  const handleToggleComplete = async (goalId, isCompleted) => {
    try {
      await axios.put(`${API}/goals/${goalId}?user_id=${userId}&is_completed=${!isCompleted}`);
      await fetchData();
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Supprimer cet objectif ?')) return;
    try {
      await axios.delete(`${API}/goals/${goalId}?user_id=${userId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const calculateProgress = (targetAmount) => {
    if (!portfolioSummary) return 0;
    const progress = (portfolioSummary.total_value / targetAmount) * 100;
    return Math.min(progress, 100);
  };

  const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
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
          <h1 className="display-md" style={{ marginBottom: '8px' }}>Objectifs Financiers</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)' }}>Fixez-vous des objectifs et suivez votre progression</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Nouvel objectif
        </button>
      </div>

      {/* Current Portfolio Value */}
      {portfolioSummary && (
        <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Valeur actuelle du portefeuille</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                {formatCurrency(portfolioSummary.total_value)}
              </div>
            </div>
            <TrendingUp size={48} color="var(--accent-primary)" />
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {goals.map(goal => {
            const progress = calculateProgress(goal.target_amount);
            const daysRemaining = getDaysRemaining(goal.target_date);
            const isCompleted = goal.is_completed || progress >= 100;

            return (
              <div 
                key={goal.id} 
                className="card"
                style={{
                  border: isCompleted ? '2px solid var(--success)' : '1px solid var(--border-subtle)',
                  background: isCompleted ? 'var(--success-bg)' : 'var(--bg-secondary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 className="h3" style={{ margin: 0, color: 'var(--text-primary)' }}>{goal.title}</h3>
                      {isCompleted && (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} />
                          Atteint!
                        </span>
                      )}
                    </div>
                    {goal.description && (
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                        {goal.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Objectif</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {formatCurrency(goal.target_amount)}
                        </div>
                      </div>
                      {daysRemaining !== null && (
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Échéance</div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: daysRemaining < 30 ? 'var(--warning)' : 'var(--text-primary)' }}>
                            {daysRemaining > 0 ? `${daysRemaining} jours` : 'Expiré'}
                          </div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Progression</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                          {progress.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleComplete(goal.id, goal.is_completed)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: goal.is_completed ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                        color: goal.is_completed ? 'var(--success)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                      title={goal.is_completed ? 'Marquer comme incomplet' : 'Marquer comme complet'}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {portfolioSummary ? formatCurrency(portfolioSummary.total_value) : '-'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Reste: {formatCurrency(Math.max(0, goal.target_amount - (portfolioSummary?.total_value || 0)))}
                    </span>
                  </div>
                  <div style={{ height: '12px', background: 'var(--bg-primary)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${progress}%`, 
                        height: '100%', 
                        background: isCompleted ? 'var(--success)' : 'var(--accent-primary)',
                        transition: 'width 0.5s ease',
                        borderRadius: '6px'
                      }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Target size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '16px' }}>
            Aucun objectif défini
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Fixez-vous des objectifs financiers pour rester motivé et suivre votre progression
          </p>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Créer mon premier objectif
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

            <h2 className="h2" style={{ marginBottom: '24px' }}>Nouvel objectif</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Titre de l'objectif
                </label>
                <input
                  type="text"
                  placeholder="Ex: Atteindre 50 000€"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Montant cible (€)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 50000"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Date cible (optionnel)
                </label>
                <input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Description (optionnel)
                </label>
                <textarea
                  placeholder="Pourquoi cet objectif est important pour vous..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button 
                className="btn-primary" 
                onClick={handleCreateGoal}
                disabled={!formData.title || !formData.target_amount}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Target size={20} />
                Créer l'objectif
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
