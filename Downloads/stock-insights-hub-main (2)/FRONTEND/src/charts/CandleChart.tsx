import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { CandlestickChart, DollarSign } from 'lucide-react';

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleChartProps {
  data?: CandlestickData[];
  currentPrice?: number;
  sma20?: number[];
  sma50?: number[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-mono text-foreground">${data.open?.toFixed(2)}</span>
          <span className="text-muted-foreground">High:</span>
          <span className="font-mono text-success">${data.high?.toFixed(2)}</span>
          <span className="text-muted-foreground">Low:</span>
          <span className="font-mono text-destructive">${data.low?.toFixed(2)}</span>
          <span className="text-muted-foreground">Close:</span>
          <span className="font-mono text-foreground">${data.close?.toFixed(2)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CandleChart = ({ data, currentPrice, sma20, sma50 }: CandleChartProps) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((d, i) => ({
      ...d,
      candleBody: [d.open, d.close],
      candleWick: [d.low, d.high],
      isGreen: d.close >= d.open,
      bodyStart: Math.min(d.open, d.close),
      bodyHeight: Math.abs(d.close - d.open),
      sma20: sma20?.[i],
      sma50: sma50?.[i],
    }));
  }, [data, sma20, sma50]);

  const minPrice = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.min(...chartData.map((d) => d.low)) * 0.995;
  }, [chartData]);

  const maxPrice = useMemo(() => {
    if (!chartData.length) return 100;
    return Math.max(...chartData.map((d) => d.high)) * 1.005;
  }, [chartData]);

  return (
    <Card className="glass-card p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CandlestickChart className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Price Chart</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-chart-1 rounded" />
            <span className="text-muted-foreground">SMA 20</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-chart-2 rounded" />
            <span className="text-muted-foreground">SMA 50</span>
          </div>
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Candlestick wicks (high-low) */}
            <Bar
              dataKey="high"
              fill="transparent"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              barSize={1}
            />
            
            {/* Candlestick bodies */}
            {chartData.map((entry, index) => (
              <ReferenceLine
                key={index}
                segment={[
                  { x: entry.date, y: entry.low },
                  { x: entry.date, y: entry.high },
                ]}
                stroke={entry.isGreen ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                strokeWidth={1}
              />
            ))}
            
            <Bar
              dataKey="bodyHeight"
              stackId="candle"
              fill="transparent"
            />
            
            <Line
              type="monotone"
              dataKey="close"
              stroke={chartData.length > 0 && chartData[chartData.length - 1]?.isGreen ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="hsl(var(--chart-1))"
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
            
            <Line
              type="monotone"
              dataKey="sma50"
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Price Display */}
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Current Price: </span>
          <span className="text-2xl font-bold font-mono text-foreground">
            ${currentPrice?.toFixed(2) || '—'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CandleChart;
