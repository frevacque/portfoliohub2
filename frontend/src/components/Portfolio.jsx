import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, X } from 'lucide-react';
import { mockPositions, mockCorrelationMatrix } from '../mockData';

const Portfolio = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'stock',
    quantity: '',
    avgPrice: ''
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleAddPosition = () => {
    alert('Position ajoutée avec succès! (mock data)');
    setShowAddModal(false);
    setFormData({ symbol: '', type: 'stock', quantity: '', avgPrice: '' });
  };

  const filteredPositions = mockPositions.filter(pos =>
    pos.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pos.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="display-md" style={{ marginBottom: '8px' }}>Mon Portefeuille</h1>
          <p className="body-md" style={{ color: 'var(--text-muted)' }}>Gérez vos positions et analysez les corrélations</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Ajouter une position
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Rechercher un titre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '52px' }}
        />
      </div>

      {/* Positions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {filteredPositions.map(position => (
          <div key={position.id} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {position.symbol}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{position.name}</div>
              </div>
              <span className="badge badge-info">
                {position.type === 'stock' ? 'Action' : 'Crypto'}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {formatCurrency(position.totalValue)}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {position.quantity} × {formatCurrency(position.currentPrice)}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              background: position.gainLossPercent >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Gain/Perte</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: position.gainLossPercent >= 0 ? 'var(--success)' : 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {position.gainLossPercent >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  {formatPercent(position.gainLossPercent)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Montant</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: position.gainLossPercent >= 0 ? 'var(--success)' : 'var(--danger)'
                }}>
                  {formatCurrency(position.gainLoss)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Bêta</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{position.beta.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Volatilité</div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{position.volatility.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Correlation Matrix */}
      <div className="card">
        <h2 className="h2" style={{ marginBottom: '24px' }}>Matrice de Corrélation</h2>
        <p className="body-sm" style={{ marginBottom: '24px' }}>Analyse des corrélations entre vos différentes positions</p>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--border-primary)', color: 'var(--text-muted)', fontSize: '14px' }}>Titre 1</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--border-primary)', color: 'var(--text-muted)', fontSize: '14px' }}>Titre 2</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--border-primary)', color: 'var(--text-muted)', fontSize: '14px' }}>Corrélation</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--border-primary)', color: 'var(--text-muted)', fontSize: '14px' }}>Interprétation</th>
              </tr>
            </thead>
            <tbody>
              {mockCorrelationMatrix.map((corr, idx) => {
                let interpretation = '';
                let color = '';
                if (corr.correlation > 0.7) {
                  interpretation = 'Forte corrélation';
                  color = 'var(--warning)';
                } else if (corr.correlation > 0.4) {
                  interpretation = 'Corrélation modérée';
                  color = 'var(--info)';
                } else {
                  interpretation = 'Faible corrélation';
                  color = 'var(--success)';
                }

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{corr.symbol1}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{corr.symbol2}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        background: 'var(--bg-tertiary)',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        {corr.correlation.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color, fontWeight: '500' }}>{interpretation}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
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
          <div className="card" style={{
            maxWidth: '500px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
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

            <h2 className="h2" style={{ marginBottom: '24px' }}>Ajouter une position</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                >
                  <option value="stock">Action</option>
                  <option value="crypto">Cryptomonnaie</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Symbole</label>
                <input
                  type="text"
                  placeholder="Ex: AAPL, BTC-USD"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Quantité</label>
                <input
                  type="number"
                  placeholder="Ex: 10"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Prix d'achat moyen</label>
                <input
                  type="number"
                  placeholder="Ex: 150.50"
                  value={formData.avgPrice}
                  onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                  className="input-field"
                />
              </div>

              <button className="btn-primary" onClick={handleAddPosition} style={{ width: '100%', marginTop: '8px' }}>
                <Plus size={20} />
                Ajouter la position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
