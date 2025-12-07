import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { TrendingUp, Brain, Sparkles, DollarSign } from 'lucide-react';

interface ChartData {
  date: string;
  price: number;
}

interface PredictionChartProps {
  title: string;
  data?: ChartData[];
  predictedPrice?: number;
  color?: string;
  type?: 'arima' | 'prophet';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-mono text-sm text-foreground">
          Price: ${payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const PredictionChart = ({
  title,
  data,
  predictedPrice,
  color = 'hsl(var(--chart-1))',
  type = 'arima',
}: PredictionChartProps) => {
  const Icon = type === 'prophet' ? Sparkles : Brain;

  return (
    <Card className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              fill={`url(#gradient-${type})`}
              stroke="transparent"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: color, fill: 'hsl(var(--card))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Predicted Price Display */}
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-3">
        <div className="p-2 rounded-lg bg-success/10">
          <DollarSign className="w-5 h-5 text-success" />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Predicted Price: </span>
          <span className="text-xl font-bold font-mono text-success">
            ${predictedPrice?.toFixed(2) || '—'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PredictionChart;
