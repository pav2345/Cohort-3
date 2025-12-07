import { useState } from 'react';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

const popularStocks = ['AAPL', 'TSLA', 'GOOG', 'MSFT', 'AMZN', 'NVDA'];

const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  const handleQuickSelect = (stock: string) => {
    setSymbol(stock);
    onSearch(stock);
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Stock Analysis</h2>
          <p className="text-sm text-muted-foreground">Enter a ticker symbol to analyze</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter symbol (e.g., TSLA)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary font-mono text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !symbol.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground mr-2">Quick select:</span>
        {popularStocks.map((stock) => (
          <button
            key={stock}
            onClick={() => handleQuickSelect(stock)}
            className="px-3 py-1 text-xs font-mono rounded-md bg-secondary/50 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
          >
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockSearch;
