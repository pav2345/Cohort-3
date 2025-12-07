import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { BarChart3, Activity } from 'lucide-react';

interface VolumeData {
  date: string;
  volume: number;
}

interface VolumeChartProps {
  data?: VolumeData[];
  currentVolume?: number;
}

const formatVolume = (value: number) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-mono text-sm text-foreground">
          Volume: {formatVolume(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const VolumeChart = ({ data, currentVolume }: VolumeChartProps) => {
  return (
    <Card className="glass-card p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Trading Volume</h3>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              tickFormatter={formatVolume}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="volume"
              fill="hsl(var(--primary))"
              opacity={0.8}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Display */}
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Volume: </span>
          <span className="text-xl font-bold font-mono text-foreground">
            {currentVolume ? formatVolume(currentVolume) : '—'} shares
          </span>
        </div>
      </div>
    </Card>
  );
};

export default VolumeChart;
