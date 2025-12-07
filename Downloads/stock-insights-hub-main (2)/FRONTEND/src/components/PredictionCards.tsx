import { Brain, TrendingUp, TrendingDown, Minus, Sparkles, LineChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PredictionData {
  predicted_price: number;
  trend: 'up' | 'down' | 'neutral';
}

interface PredictionCardsProps {
  arima?: PredictionData;
  prophet?: PredictionData;
  sma?: PredictionData;
  linear?: PredictionData;
  lstm?: PredictionData;
}

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-success" />;
    case 'down':
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    default:
      return <Minus className="w-4 h-4 text-warning" />;
  }
};

const getTrendSymbol = (trend?: string) => {
  switch (trend) {
    case 'up':
      return '↑';
    default:
      return '→';
  }
};

const getTrendClass = (trend?: string) => {
  switch (trend) {
    case 'up':
      return 'trend-up';
    case 'down':
      return 'trend-down';
    default:
      return 'trend-neutral';
  }
};

interface PredictionCardItemProps {
  title: string;
  price?: number;
  trend?: string;
  icon: React.ReactNode;
  description: string;
}

const PredictionCardItem = ({ title, price, trend, icon, description }: PredictionCardItemProps) => (
  <Card className="glass-card p-4 hover:border-primary/30 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {getTrendIcon(trend)}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold font-mono text-foreground">
        {price !== undefined ? `$${price.toFixed(2)}` : '—'}
      </span>
      <span className={`text-sm font-semibold ${getTrendClass(trend)}`}>
        {getTrendSymbol(trend)}
      </span>
    </div>
  </Card>
);

const PredictionCards = ({ arima, prophet, sma, linear, lstm }: PredictionCardsProps) => {
  const predictions = [
    { name: 'ARIMA', data: arima, icon: <LineChart className="w-4 h-4" />, desc: 'Time Series' },
    { name: 'Prophet', data: prophet, icon: <Sparkles className="w-4 h-4" />, desc: 'Meta AI Model' },
    { name: 'SMA(7)', data: sma, icon: <TrendingUp className="w-4 h-4" />, desc: 'Moving Average' },
    { name: 'Linear Regression', data: linear, icon: <LineChart className="w-4 h-4" />, desc: 'Statistical' },
    { name: 'LSTM', data: lstm, icon: <Brain className="w-4 h-4" />, desc: 'Neural Network' },
  ];

  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      {/* Card Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Predictions</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {predictions.map((pred) => (
            <PredictionCardItem
              key={pred.name}
              title={pred.name}
              price={pred.data?.predicted_price}
              trend={pred.data?.trend}
              icon={pred.icon}
              description={pred.desc}
            />
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <Card className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <LineChart className="w-4 h-4 text-primary" />
            Prediction Comparison
          </h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">Model</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">Predicted Price</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((pred) => (
              <TableRow key={pred.name} className="border-border/30 hover:bg-secondary/30">
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-primary/10 text-primary">
                      {pred.icon}
                    </span>
                    {pred.name}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-foreground">
                  {pred.data?.predicted_price !== undefined
                    ? `$${pred.data.predicted_price.toFixed(2)}`
                    : '—'}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    pred.data?.trend === 'up'
                      ? 'bg-success/20 text-success'
                      : pred.data?.trend === 'down'
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {getTrendIcon(pred.data?.trend)}
                    {pred.data?.trend === 'up' ? '↑' : pred.data?.trend === 'down' ? '↓' : '→'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default PredictionCards;
