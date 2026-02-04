import React from 'react';
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, AlertCircle } from 'lucide-react';
import { mockPortfolio, mockPositions, mockRecommendations, mockHistoricalData } from '../mockData';

const Dashboard = () => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="display-md" style={{ marginBottom: '8px' }}>Tableau de bord</h1>
        <p className="body-md" style={{ color: 'var(--text-muted)' }}>Vue d'ensemble de votre portefeuille</p>
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
            {formatCurrency(mockPortfolio.totalValue)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mockPortfolio.gainLossPercent >= 0 ? (
              <TrendingUp size={18} color="var(--success)" />
            ) : (
              <TrendingDown size={18} color="var(--danger)" />
            )}
            <span style={{
              color: mockPortfolio.gainLossPercent >= 0 ? 'var(--success)' : 'var(--danger)',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {formatPercent(mockPortfolio.gainLossPercent)}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>depuis le début</span>
          </div>
        </div>

        {/* Daily Change */}
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Variation Journalière</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: mockPortfolio.dailyChange >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatCurrency(mockPortfolio.dailyChange)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--text-muted)" />
            <span style={{
              color: mockPortfolio.dailyChangePercent >= 0 ? 'var(--success)' : 'var(--danger)',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {formatPercent(mockPortfolio.dailyChangePercent)}
            </span>
          </div>
        </div>

        {/* Beta */}
        <div className="card">
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Bêta du Portefeuille</div>
          <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {mockPortfolio.beta.toFixed(2)}
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
            {mockPortfolio.sharpeRatio.toFixed(2)}
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
              {mockPortfolio.volatility.daily.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Mensuelle</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {mockPortfolio.volatility.monthly.toFixed(2)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Historique</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {mockPortfolio.volatility.historical.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 className="h2" style={{ marginBottom: '24px' }}>Principales Positions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mockPositions.map(position => (
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
                  {formatCurrency(position.totalValue)}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {position.weight.toFixed(1)}% du portefeuille
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: position.gainLossPercent >= 0 ? 'var(--success)' : 'var(--danger)'
                }}>
                  {formatPercent(position.gainLossPercent)}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Volatilité: {position.volatility.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="h2" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={24} color="var(--accent-primary)" />
          Recommandations
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mockRecommendations.map(rec => (
            <div key={rec.id} style={{
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
    </div>
  );
};

export default Dashboard;
