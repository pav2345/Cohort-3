import { MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SentimentCardProps {
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence?: number;
  signal?: 'BUY' | 'SELL' | 'HOLD';
}

const SentimentCard = ({ sentiment, confidence, signal }: SentimentCardProps) => {
  const getSentimentConfig = () => {
    switch (sentiment) {
      case 'POSITIVE':
        return {
          icon: <ThumbsUp className="w-6 h-6" />,
          bgClass: 'bg-success/10 border-success/30',
          textClass: 'text-success',
          gradient: 'from-success/20 to-success/5',
        };
      case 'NEGATIVE':
        return {
          icon: <ThumbsDown className="w-6 h-6" />,
          bgClass: 'bg-destructive/10 border-destructive/30',
          textClass: 'text-destructive',
          gradient: 'from-destructive/20 to-destructive/5',
        };
      default:
        return {
          icon: <Minus className="w-6 h-6" />,
          bgClass: 'bg-warning/10 border-warning/30',
          textClass: 'text-warning',
          gradient: 'from-warning/20 to-warning/5',
        };
    }
  };

  const getSignalConfig = () => {
    switch (signal) {
      case 'BUY':
        return { text: 'BUY', class: 'bg-success/20 text-success' };
      case 'SELL':
        return { text: 'SELL', class: 'bg-destructive/20 text-destructive' };
      default:
        return { text: 'HOLD', class: 'bg-warning/20 text-warning' };
    }
  };

  const sentimentConfig = getSentimentConfig();
  const signalConfig = getSignalConfig();

  return (
    <Card className={`glass-card p-5 ${sentimentConfig.bgClass} animate-slide-up overflow-hidden relative`} style={{ animationDelay: '0.4s' }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${sentimentConfig.gradient} pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-card/50">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Sentiment Analysis</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sentiment</p>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${sentimentConfig.bgClass}`}>
              {sentimentConfig.icon}
              <span className={`font-bold ${sentimentConfig.textClass}`}>
                {sentiment || 'ANALYZING'}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Signal</p>
            <span className={`inline-block px-4 py-2 rounded-lg font-bold ${signalConfig.class}`}>
              {signalConfig.text}
            </span>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Confidence</p>
            <p className={`text-2xl font-bold font-mono ${sentimentConfig.textClass}`}>
              {confidence !== undefined ? `${confidence.toFixed(1)}%` : '—'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SentimentCard;
