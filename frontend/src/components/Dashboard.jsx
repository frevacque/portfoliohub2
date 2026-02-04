import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { portfolioAPI, analyticsAPI, storage } from '../api';

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [positions, setPositions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userId = storage.getUserId();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const fetchData = async () => {
    try {
      const [portfolioData, positionsData, recommendationsData] = await Promise.all([
        portfolioAPI.getSummary(userId),
        portfolioAPI.getPositions(userId),
        analyticsAPI.getRecommendations(userId)
      ]);
      
      setPortfolio(portfolioData);
      setPositions(positionsData.slice(0, 5)); // Top 5 positions
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Chargement...</div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container" style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '18px' }}>
          Aucune donnée de portefeuille disponible
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="display-md" style={{ marginBottom: '8px' }}>Tableau de bord</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)' }}>Vue d'ensemble de votre portefeuille</p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-secondary"
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Actualiser
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Total Value */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-primary)' }} />
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Valeur Totale</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {formatCurrency(portfolio.total_value)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {portfolio.gain_loss_percent >= 0 ? (
              <TrendingUp size={18} color="var(--success)" />
            ) : (
              <TrendingDown size={18} color="var(--danger)" />
            )}
            <span style={{
              color: portfolio.gain_loss_percent >= 0 ? 'var(--success)' : 'var(--danger)',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {formatPercent(portfolio.gain_loss_percent)}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>depuis le début</span>
          </div>
        </div>

        {/* Daily Change */}
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Variation Journalière</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: portfolio.daily_change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatCurrency(portfolio.daily_change)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--text-muted)" />
            <span style={{
              color: portfolio.daily_change_percent >= 0 ? 'var(--success)' : 'var(--danger)',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {formatPercent(portfolio.daily_change_percent)}
            </span>
          </div>
        </div>

        {/* Beta */}
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Bêta du Portefeuille</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {portfolio.beta.toFixed(2)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Exposition au marché</span>
          </div>
        </div>

        {/* Sharpe Ratio */}
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Ratio de Sharpe</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {portfolio.sharpe_ratio.toFixed(2)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Rendement ajusté</span>
          </div>
        </div>
      </div>

      {/* Volatility Section */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 className="h2" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={24} color="var(--accent-primary)" />
          Volatilité du Portefeuille
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Journalière</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {portfolio.volatility.daily.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Mensuelle</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {portfolio.volatility.monthly.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Historique</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {portfolio.volatility.historical.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      {positions.length > 0 && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 className="h2" style={{ marginBottom: '24px' }}>Principales Positions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {positions.map(position => (
              <div key={position.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-primary)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {position.symbol}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '12px', padding: '4px 8px' }}>
                      {position.type === 'stock' ? 'Action' : 'Crypto'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{position.name}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: '32px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {formatCurrency(position.total_value)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {position.weight.toFixed(1)}% du portefeuille
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: position.gain_loss_percent >= 0 ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {formatPercent(position.gain_loss_percent)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Volatilité: {position.volatility.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card">
          <h2 className="h2" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={24} color="var(--accent-primary)" />
            Recommandations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map((rec, idx) => (
              <div key={idx} style={{
                padding: '16px',
                background: rec.type === 'warning' ? 'var(--warning-bg)' : rec.type === 'success' ? 'var(--success-bg)' : 'var(--info-bg)',
                border: `1px solid ${rec.type === 'warning' ? 'var(--warning)' : rec.type === 'success' ? 'var(--success)' : 'var(--info)'}`,
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  {rec.title}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {rec.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {positions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '16px' }}>
            Aucune position dans votre portefeuille
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Ajoutez votre première position dans l'onglet Portefeuille
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
