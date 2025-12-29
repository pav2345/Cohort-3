import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Bookmark } from 'lucide-react';
import api from '@/lib/axios';
import { Food } from '@/types';
import Layout from '@/components/Layout';
import ReelCard from '@/components/ReelCard';
import { useToast } from '@/hooks/use-toast';

const Saved: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedFoods = async () => {
      try {
        const { data } = await api.get('/api/food/save');
        setFoods((data.foods || []).map((f: Food) => ({ ...f, isSaved: true })));
      } catch (error) {
        toast({
          title: 'Error loading saved items',
          description: 'Could not load saved food reels.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedFoods();
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
    }
  }, []);

  const handleSave = useCallback(async (foodId: string) => {
    // Remove from list when unsaved
    const food = foods.find((f) => f._id === foodId);
    if (food?.isSaved) {
      setFoods((prev) => prev.filter((f) => f._id !== foodId));
    }

    try {
      await api.post('/api/food/save', { foodId });
      toast({
        title: 'Removed from saved',
        description: 'Item has been removed from your saved list.',
      });
    } catch (error) {
      // Re-add on error
      if (food) {
        setFoods((prev) => [...prev, food]);
      }
      toast({
        title: 'Error',
        description: 'Could not update saved item.',
        variant: 'destructive',
      });
    }
  }, [foods, toast]);

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
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="p-6 rounded-full bg-muted mb-4">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No saved items</h2>
          <p className="text-muted-foreground">Start saving food reels to see them here!</p>
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

export default Saved;
