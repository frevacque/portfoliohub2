import yfinance as yf
import pandas as pd
import numpy as np
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class YahooFinanceService:
    """Service for fetching data from Yahoo Finance"""
    
    @staticmethod
    def get_current_price(symbol: str) -> Optional[float]:
        """Get current price for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period='1d')
            if data.empty:
                return None
            return float(data['Close'].iloc[-1])
        except Exception as e:
            logger.error(f"Error fetching price for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    def get_ticker_info(symbol: str) -> Optional[Dict]:
        """Get ticker information"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            return {
                'symbol': symbol,
                'name': info.get('longName', info.get('shortName', symbol)),
                'price': info.get('currentPrice', info.get('regularMarketPrice', 0)),
                'change': info.get('regularMarketChange', 0),
                'change_percent': info.get('regularMarketChangePercent', 0),
                'volume': info.get('volume', 0)
            }
        except Exception as e:
            logger.error(f"Error fetching info for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    def get_historical_data(symbol: str, period: str = '1y') -> Optional[pd.DataFrame]:
        """Get historical data for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period)
            return data
        except Exception as e:
            logger.error(f"Error fetching historical data for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    def calculate_returns(prices: pd.Series) -> pd.Series:
        """Calculate returns from prices"""
        return prices.pct_change().dropna()
    
    @staticmethod
    def calculate_volatility(returns: pd.Series, annualize: bool = True) -> float:
        """Calculate volatility (standard deviation of returns)"""
        vol = returns.std()
        if annualize:
            # Annualize based on trading days
            vol = vol * np.sqrt(252)
        return float(vol * 100)  # Convert to percentage
    
    @staticmethod
    def calculate_beta(asset_returns: pd.Series, market_returns: pd.Series) -> float:
        """Calculate beta relative to market"""
        try:
            # Align the series
            aligned = pd.DataFrame({
                'asset': asset_returns,
                'market': market_returns
            }).dropna()
            
            if len(aligned) < 2:
                return 1.0
            
            covariance = aligned['asset'].cov(aligned['market'])
            market_variance = aligned['market'].var()
            
            if market_variance == 0:
                return 1.0
            
            beta = covariance / market_variance
            return float(beta)
        except Exception as e:
            logger.error(f"Error calculating beta: {str(e)}")
            return 1.0
    
    @staticmethod
    def calculate_correlation(returns1: pd.Series, returns2: pd.Series) -> float:
        """Calculate correlation between two return series"""
        try:
            aligned = pd.DataFrame({
                'r1': returns1,
                'r2': returns2
            }).dropna()
            
            if len(aligned) < 2:
                return 0.0
            
            correlation = aligned['r1'].corr(aligned['r2'])
            return float(correlation)
        except Exception as e:
            logger.error(f"Error calculating correlation: {str(e)}")
            return 0.0
    
    @staticmethod
    def calculate_sharpe_ratio(returns: pd.Series, risk_free_rate: float = 0.02) -> float:
        """Calculate Sharpe ratio"""
        try:
            excess_returns = returns - (risk_free_rate / 252)  # Daily risk-free rate
            sharpe = excess_returns.mean() / returns.std()
            return float(sharpe * np.sqrt(252))  # Annualize
        except Exception as e:
            logger.error(f"Error calculating Sharpe ratio: {str(e)}")
            return 0.0
    
    @staticmethod
    def get_market_data(symbol: str = '^GSPC', period: str = '1y') -> Optional[pd.Series]:
        """Get market index data (default S&P 500)"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period)
            return data['Close']
        except Exception as e:
            logger.error(f"Error fetching market data: {str(e)}")
            return None
    
    @staticmethod
    def search_ticker(query: str) -> List[Dict]:
        """Search for tickers (basic implementation)"""
        # Note: yfinance doesn't have a built-in search, so this is a simplified version
        # In production, you might want to use a proper search API
        try:
            ticker = yf.Ticker(query.upper())
            info = ticker.info
            if info:
                return [{
                    'symbol': query.upper(),
                    'name': info.get('longName', info.get('shortName', query)),
                    'type': info.get('quoteType', 'unknown')
                }]
        except:
            pass
        return []
