import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Store } from 'lucide-react';
import { Food } from '@/types';
import VideoPlayer from './VideoPlayer';
import { cn } from '@/lib/utils';

interface ReelCardProps {
  food: Food;
  isActive: boolean;
  onLike: (foodId: string) => void;
  onSave: (foodId: string) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ food, isActive, onLike, onSave }) => {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(food._id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(food._id);
  };

  // ✅ SAFE FALLBACKS
  const partnerId = food.foodPartner?._id;
  const partnerName = food.foodPartner?.name || "Unknown";
  const partnerInitial = partnerName.charAt(0).toUpperCase();

  return (
    <div className="reel-item relative">
      <VideoPlayer src={food.videoUrl} isActive={isActive} />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 md:bottom-24 flex flex-col items-center gap-6">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={cn(
              "p-3 rounded-full transition-all duration-200",
              food.isLiked
                ? "bg-primary/20 text-primary"
                : "bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50"
            )}
          >
            <Heart
              className={cn(
                "h-7 w-7 transition-transform",
                food.isLiked && "fill-primary animate-heart-pop"
              )}
            />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {food.likes ?? 0}
          </span>
        </button>

        <button
          onClick={handleSave}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={cn(
              "p-3 rounded-full transition-all duration-200",
              food.isSaved
                ? "bg-accent/20 text-accent"
                : "bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50"
            )}
          >
            <Bookmark
              className={cn(
                "h-7 w-7 transition-transform",
                food.isSaved && "fill-accent"
              )}
            />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {food.saves ?? 0}
          </span>
        </button>

        {/* Partner link (only if exists) */}
        {partnerId && (
          <Link
            to={`/food-partner/${partnerId}`}
            className="flex flex-col items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-all duration-200">
              <Store className="h-7 w-7" />
            </div>
          </Link>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 right-20 bottom-8 md:bottom-6 space-y-3">
        {partnerId ? (
          <Link
            to={`/food-partner/${partnerId}`}
            className="inline-flex items-center gap-2 group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-10 w-10 rounded-full gradient-warm flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                {partnerInitial}
              </span>
            </div>
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {partnerName}
            </span>
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">
                ?
              </span>
            </div>
            <span className="font-semibold text-muted-foreground">
              Unknown Partner
            </span>
          </div>
        )}

        <h2 className="text-lg font-bold text-foreground">
          {food.name || "Unnamed food"}
        </h2>

        {food.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {food.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReelCard;
