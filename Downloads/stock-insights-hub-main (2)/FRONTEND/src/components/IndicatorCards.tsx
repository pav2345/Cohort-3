import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface IndicatorCardsProps {
  sma20?: number;
  sma50?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  macd?: number;
  bollingerUpper?: number;
  bollingerLower?: number;
  currentPrice?: number;
}

interface IndicatorCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  format?: 'price' | 'percent' | 'number';
  description?: string;
}

const formatValue = (value: number | undefined, format: string) => {
  if (value === undefined) return '—';
  switch (format) {
    case 'price':
      return `$${value.toFixed(2)}`;
    case 'percent':
      return `${value.toFixed(2)}%`;
    default:
      return value.toFixed(2);
  }
};

const IndicatorCard = ({ title, value, icon, format = 'price', description }: IndicatorCardProps) => (
  <Card className="glass-card p-4 hover:border-primary/30 transition-colors group">
    <div className="flex items-start justify-between mb-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
      <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
    </div>
    <div className="font-mono text-xl font-semibold text-foreground">
      {formatValue(value, format)}
    </div>
    {description && (
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    )}
  </Card>
);

const IndicatorCards = ({
  sma20,
  sma50,
  ema20,
  ema50,
  rsi,
  macd,
  bollingerUpper,
  bollingerLower,
  currentPrice,
}: IndicatorCardsProps) => {
  const getRsiStatus = (rsi: number | undefined) => {
    if (!rsi) return '';
    if (rsi < 30) return 'Oversold';
    if (rsi > 70) return 'Overbought';
    return 'Neutral';
  };

  const getMacdStatus = (macd: number | undefined) => {
    if (!macd) return '';
    return macd > 0 ? 'Bullish' : 'Bearish';
  };

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Technical Indicators</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IndicatorCard
          title="SMA 20"
          value={sma20}
          icon={<TrendingUp className="w-4 h-4" />}
          description="20-day Simple MA"
        />
        <IndicatorCard
          title="SMA 50"
          value={sma50}
          icon={<TrendingUp className="w-4 h-4" />}
          description="50-day Simple MA"
        />
        <IndicatorCard
          title="EMA 20"
          value={ema20}
          icon={<TrendingDown className="w-4 h-4" />}
          description="20-day Exponential MA"
        />
        <IndicatorCard
          title="EMA 50"
          value={ema50}
          icon={<TrendingDown className="w-4 h-4" />}
          description="50-day Exponential MA"
        />
        <IndicatorCard
          title="RSI"
          value={rsi}
          icon={<Activity className="w-4 h-4" />}
          format="number"
          description={getRsiStatus(rsi)}
        />
        <IndicatorCard
          title="MACD"
          value={macd}
          icon={<BarChart3 className="w-4 h-4" />}
          format="number"
          description={getMacdStatus(macd)}
        />
        <IndicatorCard
          title="Bollinger Upper"
          value={bollingerUpper}
          icon={<TrendingUp className="w-4 h-4" />}
          description="Upper Band"
        />
        <IndicatorCard
          title="Bollinger Lower"
          value={bollingerLower}
          icon={<TrendingDown className="w-4 h-4" />}
          description="Lower Band"
        />
      </div>
    </div>
  );
};

export default IndicatorCards;
