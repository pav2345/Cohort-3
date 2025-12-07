import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SignalCardProps {
  signal?: 'BUY' | 'SELL' | 'HOLD';
  confidence?: number;
  reasons?: string[];
}

const SignalCard = ({ signal, confidence, reasons }: SignalCardProps) => {
  const getSignalConfig = () => {
    switch (signal) {
      case 'BUY':
        return {
          bgClass: 'bg-success/10 border-success/30',
          textClass: 'text-success',
          icon: <TrendingUp className="w-8 h-8" />,
          gradient: 'from-success/20 to-success/5',
        };
      case 'SELL':
        return {
          bgClass: 'bg-destructive/10 border-destructive/30',
          textClass: 'text-destructive',
          icon: <TrendingDown className="w-8 h-8" />,
          gradient: 'from-destructive/20 to-destructive/5',
        };
      default:
        return {
          bgClass: 'bg-warning/10 border-warning/30',
          textClass: 'text-warning',
          icon: <Minus className="w-8 h-8" />,
          gradient: 'from-warning/20 to-warning/5',
        };
    }
  };

  const config = getSignalConfig();

  return (
    <Card className={`glass-card p-6 ${config.bgClass} animate-slide-up overflow-hidden relative`} style={{ animationDelay: '0.2s' }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${config.bgClass}`}>
              {config.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Final Signal</p>
              <h3 className={`text-3xl font-bold ${config.textClass}`}>
                {signal || 'ANALYZING'}
              </h3>
            </div>
          </div>
          
          {confidence !== undefined && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</p>
              <p className={`text-2xl font-bold font-mono ${config.textClass}`}>
                {confidence.toFixed(1)}%
              </p>
            </div>
          )}
        </div>

        {reasons && reasons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Analysis Reasons
              </span>
            </div>
            <ul className="space-y-2">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.textClass} bg-current flex-shrink-0`} />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SignalCard;
