// Mock data for portfolio management

export const mockUser = {
  id: '1',
  name: 'Jean Dupont',
  email: 'jean.dupont@example.com'
};

export const mockPortfolio = {
  totalValue: 45750.80,
  totalInvested: 40000,
  totalGainLoss: 5750.80,
  gainLossPercent: 14.38,
  dailyChange: 324.50,
  dailyChangePercent: 0.71,
  volatility: {
    daily: 1.24,
    monthly: 4.89,
    historical: 18.45
  },
  beta: 1.12,
  sharpeRatio: 1.45
};

export const mockPositions = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    quantity: 50,
    avgPrice: 150.25,
    currentPrice: 178.50,
    totalValue: 8925.00,
    invested: 7512.50,
    gainLoss: 1412.50,
    gainLossPercent: 18.80,
    weight: 19.5,
    beta: 1.25,
    volatility: 22.5,
    lastUpdate: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'stock',
    quantity: 25,
    avgPrice: 245.00,
    currentPrice: 268.75,
    totalValue: 6718.75,
    invested: 6125.00,
    gainLoss: 593.75,
    gainLossPercent: 9.69,
    weight: 14.7,
    beta: 1.95,
    volatility: 45.2,
    lastUpdate: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    symbol: 'BTC-USD',
    name: 'Bitcoin USD',
    type: 'crypto',
    quantity: 0.5,
    avgPrice: 42000.00,
    currentPrice: 45250.00,
    totalValue: 22625.00,
    invested: 21000.00,
    gainLoss: 1625.00,
    gainLossPercent: 7.74,
    weight: 49.4,
    beta: 2.45,
    volatility: 68.5,
    lastUpdate: '2025-01-15T10:30:00Z'
  },
  {
    id: '4',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    quantity: 20,
    avgPrice: 320.00,
    currentPrice: 378.15,
    totalValue: 7563.00,
    invested: 6400.00,
    gainLoss: 1163.00,
    gainLossPercent: 18.17,
    weight: 16.4,
    beta: 1.08,
    volatility: 19.8,
    lastUpdate: '2025-01-15T10:30:00Z'
  }
];

export const mockCorrelationMatrix = [
  { symbol1: 'AAPL', symbol2: 'MSFT', correlation: 0.78 },
  { symbol1: 'AAPL', symbol2: 'TSLA', correlation: 0.45 },
  { symbol1: 'AAPL', symbol2: 'BTC-USD', correlation: 0.32 },
  { symbol1: 'MSFT', symbol2: 'TSLA', correlation: 0.51 },
  { symbol1: 'MSFT', symbol2: 'BTC-USD', correlation: 0.28 },
  { symbol1: 'TSLA', symbol2: 'BTC-USD', correlation: 0.55 }
];

export const mockHistoricalData = [
  { date: '2024-07-01', value: 38500 },
  { date: '2024-08-01', value: 39200 },
  { date: '2024-09-01', value: 40100 },
  { date: '2024-10-01', value: 41500 },
  { date: '2024-11-01', value: 42800 },
  { date: '2024-12-01', value: 44200 },
  { date: '2025-01-01', value: 45750 }
];

export const mockRecommendations = [
  {
    id: '1',
    type: 'warning',
    title: 'Concentration élevée',
    description: 'Bitcoin représente 49.4% de votre portefeuille. Considérez diversifier davantage.',
    priority: 'high'
  },
  {
    id: '2',
    type: 'info',
    title: 'Volatilité élevée',
    description: 'Tesla a une volatilité de 45.2%. Surveillez cette position de près.',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'success',
    title: 'Bonne diversification',
    description: 'Votre bêta de portefeuille (1.12) indique une exposition équilibrée au marché.',
    priority: 'low'
  },
  {
    id: '4',
    type: 'info',
    title: 'Corrélation modérée',
    description: 'AAPL et MSFT sont fortement corrélés (0.78). Envisagez d\'autres secteurs.',
    priority: 'medium'
  }
];

export const mockTransactions = [
  {
    id: '1',
    symbol: 'AAPL',
    type: 'buy',
    quantity: 50,
    price: 150.25,
    total: 7512.50,
    date: '2024-06-15T14:30:00Z'
  },
  {
    id: '2',
    symbol: 'BTC-USD',
    type: 'buy',
    quantity: 0.5,
    price: 42000.00,
    total: 21000.00,
    date: '2024-07-20T09:15:00Z'
  },
  {
    id: '3',
    symbol: 'TSLA',
    type: 'buy',
    quantity: 25,
    price: 245.00,
    total: 6125.00,
    date: '2024-08-10T11:45:00Z'
  },
  {
    id: '4',
    symbol: 'MSFT',
    type: 'buy',
    quantity: 20,
    price: 320.00,
    total: 6400.00,
    date: '2024-09-05T16:20:00Z'
  }
];
