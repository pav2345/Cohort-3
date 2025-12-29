import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { Food } from '@/types';
import Layout from '@/components/Layout';
import ReelCard from '@/components/ReelCard';
import { useToast } from '@/hooks/use-toast';

const Feed: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get('/api/food');
        setFoods(data.foods || []);
      } catch (error) {
        toast({
          title: 'Error loading feed',
          description: 'Could not load food reels. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, [toast]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  const handleLike = useCallback(async (foodId: string) => {
    // Optimistic update
    setFoods((prev) =>
      prev.map((food) =>
        food._id === foodId
          ? {
              ...food,
              isLiked: !food.isLiked,
              likes: food.isLiked ? food.likes - 1 : food.likes + 1,
            }
          : food
      )
    );

    try {
      await api.post('/api/food/like', { foodId });
    } catch (error) {
      // Revert on error
      setFoods((prev) =>
        prev.map((food) =>
          food._id === foodId
            ? {
                ...food,
                isLiked: !food.isLiked,
                likes: food.isLiked ? food.likes - 1 : food.likes + 1,
              }
            : food
        )
      );
      toast({
        title: 'Error',
        description: 'Could not like this item.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleSave = useCallback(async (foodId: string) => {
    // Optimistic update
    setFoods((prev) =>
      prev.map((food) =>
        food._id === foodId
          ? {
              ...food,
              isSaved: !food.isSaved,
              saves: food.isSaved ? food.saves - 1 : food.saves + 1,
            }
          : food
      )
    );

    try {
      await api.post('/api/food/save', { foodId });
    } catch (error) {
      // Revert on error
      setFoods((prev) =>
        prev.map((food) =>
          food._id === foodId
            ? {
                ...food,
                isSaved: !food.isSaved,
                saves: food.isSaved ? food.saves - 1 : food.saves + 1,
              }
            : food
        )
      );
      toast({
        title: 'Error',
        description: 'Could not save this item.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  if (isLoading) {
    return (
      <Layout fullScreen>
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (foods.length === 0) {
    return (
      <Layout fullScreen>
        <div className="h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl mb-4">🍜</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No food reels yet</h2>
          <p className="text-muted-foreground">Check back later for delicious content!</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullScreen>
      <div ref={containerRef} className="reel-container md:ml-64">
        {foods.map((food, index) => (
          <ReelCard
            key={food._id}
            food={food}
            isActive={index === activeIndex}
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Feed;
