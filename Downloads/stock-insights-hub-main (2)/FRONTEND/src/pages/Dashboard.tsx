import { useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/layouts/DashboardLayout';
import StockSearch from '@/components/StockSearch';
import IndicatorCards from '@/components/IndicatorCards';
import SignalCard from '@/components/SignalCard';
import PredictionCards from '@/components/PredictionCards';
import SentimentCard from '@/components/SentimentCard';
import CandleChart from '@/charts/CandleChart';
import VolumeChart from '@/charts/VolumeChart';
import PredictionChart from '@/charts/PredictionChart';
import { fetchAllData, IndicatorsBasicResponse, SignalsResponse, PredictionResponse, SentimentResponse } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface StockData {
  indicators: IndicatorsBasicResponse;
  signals: SignalsResponse;
  predictions: {
    arima: PredictionResponse;
    prophet: PredictionResponse;
    sma: PredictionResponse;
    linear: PredictionResponse;
    lstm: PredictionResponse;
  };
  sentiment: SentimentResponse;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockData | null>(null);

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    setCurrentSymbol(symbol);
    
    try {
      const data = await fetchAllData(symbol);
      setStockData(data);
      toast.success(`Analysis complete for ${symbol}`, {
        description: 'All indicators and predictions have been loaded.',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to analyze ${symbol}`, {
        description: 'Please check if the backend server is running.',
      });
      
      // Generate mock data for demo purposes
      setStockData(generateMockData());
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data generator for demo
  const generateMockData = (): StockData => {
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const basePrice = 150 + Math.random() * 100;
    const candlestick = dates.map((date, i) => {
      const change = (Math.random() - 0.5) * 10;
      const open = basePrice + change + i * 0.5;
      const close = open + (Math.random() - 0.5) * 8;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      return { date, open, high, low, close, volume: Math.floor(Math.random() * 50000000) + 10000000 };
    });

    const currentPrice = candlestick[candlestick.length - 1].close;

    return {
      indicators: {
        candlestick,
        volume: candlestick.map(c => c.volume),
        sma20: candlestick.map(c => c.close * (0.98 + Math.random() * 0.04)),
        sma50: candlestick.map(c => c.close * (0.95 + Math.random() * 0.1)),
        ema20: candlestick.map(c => c.close * (0.98 + Math.random() * 0.04)),
        ema50: candlestick.map(c => c.close * (0.95 + Math.random() * 0.1)),
        rsi: candlestick.map(() => 30 + Math.random() * 40),
        macd: candlestick.map(() => (Math.random() - 0.5) * 5),
        macd_signal: candlestick.map(() => (Math.random() - 0.5) * 4),
        bollinger_upper: candlestick.map(c => c.close * 1.05),
        bollinger_lower: candlestick.map(c => c.close * 0.95),
        current_price: currentPrice,
        current_volume: candlestick[candlestick.length - 1].volume,
      },
      signals: {
        signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as 'BUY' | 'SELL' | 'HOLD',
        confidence: 65 + Math.random() * 30,
        reasons: [
          'RSI indicates oversold conditions',
          'MACD showing bullish crossover',
          'Price near lower Bollinger Band',
          'Strong volume support',
        ],
      },
      predictions: {
        arima: {
          predicted_price: currentPrice * (1 + (Math.random() - 0.3) * 0.1),
          trend: Math.random() > 0.3 ? 'up' : 'neutral',
          chart_data: dates.slice(-14).map((date, i) => ({
            date,
            price: currentPrice * (1 + (Math.random() - 0.4) * 0.05 + i * 0.002),
          })),
        },
        prophet: {
          predicted_price: currentPrice * (1 + (Math.random() - 0.3) * 0.1),
          trend: Math.random() > 0.3 ? 'up' : 'neutral',
          chart_data: dates.slice(-14).map((date, i) => ({
            date,
            price: currentPrice * (1 + (Math.random() - 0.4) * 0.05 + i * 0.003),
          })),
        },
        sma: {
          predicted_price: currentPrice * (1 + (Math.random() - 0.5) * 0.05),
          trend: 'neutral',
        },
        linear: {
          predicted_price: currentPrice * (1 + (Math.random() - 0.3) * 0.08),
          trend: 'up',
        },
        lstm: {
          predicted_price: currentPrice * (1 + (Math.random() - 0.2) * 0.12),
          trend: 'up',
        },
      },
      sentiment: {
        sentiment: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'][Math.floor(Math.random() * 3)] as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
        confidence: 80 + Math.random() * 15,
        signal: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)] as 'BUY' | 'SELL' | 'HOLD',
      },
    };
  };

  const volumeData = stockData?.indicators.candlestick.map((c) => ({
    date: c.date,
    volume: c.volume,
  }));

  const lastIndicator = stockData?.indicators;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Search Section */}
        <StockSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing {currentSymbol}...</p>
            <p className="text-xs text-muted-foreground mt-1">Fetching data from multiple AI models</p>
          </div>
        )}

        {/* Data Display */}
        {!isLoading && stockData && (
          <div className="space-y-6">
            {/* Current Symbol Header */}
            <div className="flex items-center gap-4 animate-slide-up">
              <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-mono text-xl font-bold text-primary">{currentSymbol}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-mono">
                  ${stockData.indicators.current_price?.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Current Price</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CandleChart
                data={stockData.indicators.candlestick}
                currentPrice={stockData.indicators.current_price}
                sma20={stockData.indicators.sma20}
                sma50={stockData.indicators.sma50}
              />
              <VolumeChart
                data={volumeData}
                currentVolume={stockData.indicators.current_volume}
              />
            </div>

            {/* Prediction Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictionChart
                title="ARIMA Forecast"
                data={stockData.predictions.arima.chart_data}
                predictedPrice={stockData.predictions.arima.predicted_price}
                color="hsl(var(--chart-1))"
                type="arima"
              />
              <PredictionChart
                title="Prophet Forecast"
                data={stockData.predictions.prophet.chart_data}
                predictedPrice={stockData.predictions.prophet.predicted_price}
                color="hsl(var(--chart-2))"
                type="prophet"
              />
            </div>

            {/* Technical Indicators */}
            <IndicatorCards
              sma20={lastIndicator?.sma20?.[lastIndicator.sma20.length - 1]}
              sma50={lastIndicator?.sma50?.[lastIndicator.sma50.length - 1]}
              ema20={lastIndicator?.ema20?.[lastIndicator.ema20.length - 1]}
              ema50={lastIndicator?.ema50?.[lastIndicator.ema50.length - 1]}
              rsi={lastIndicator?.rsi?.[lastIndicator.rsi.length - 1]}
              macd={lastIndicator?.macd?.[lastIndicator.macd.length - 1]}
              bollingerUpper={lastIndicator?.bollinger_upper?.[lastIndicator.bollinger_upper.length - 1]}
              bollingerLower={lastIndicator?.bollinger_lower?.[lastIndicator.bollinger_lower.length - 1]}
              currentPrice={stockData.indicators.current_price}
            />

            {/* Signal and Sentiment Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SignalCard
                signal={stockData.signals.signal}
                confidence={stockData.signals.confidence}
                reasons={stockData.signals.reasons}
              />
              <SentimentCard
                sentiment={stockData.sentiment.sentiment}
                confidence={stockData.sentiment.confidence}
                signal={stockData.sentiment.signal}
              />
            </div>

            {/* AI Predictions */}
            <PredictionCards
              arima={stockData.predictions.arima}
              prophet={stockData.predictions.prophet}
              sma={stockData.predictions.sma}
              linear={stockData.predictions.linear}
              lstm={stockData.predictions.lstm}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !stockData && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary/10 mb-4">
              <TrendingUpIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Enter a Stock Symbol to Begin
            </h3>
            <p className="text-muted-foreground max-w-md">
              Search for any stock ticker (e.g., AAPL, TSLA, GOOG) to view comprehensive
              technical analysis, AI predictions, and sentiment data.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default Dashboard;
