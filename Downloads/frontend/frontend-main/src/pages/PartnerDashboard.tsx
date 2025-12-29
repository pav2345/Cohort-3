import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, Heart, Bookmark, Film, Loader2, TrendingUp } from "lucide-react";
import api from "@/lib/axios";
import { Food } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalReels: number;
  totalLikes: number;
  totalSaves: number;
  avgEngagement: number;
}

const PartnerDashboard: React.FC = () => {
  const { partner } = useAuth();
  const { toast } = useToast();

  const [foods, setFoods] = useState<Food[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalReels: 0,
    totalLikes: 0,
    totalSaves: 0,
    avgEngagement: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!partner?._id) return;

        const [foodsRes, statsRes] = await Promise.all([
          api.get(`/api/food-partner/${partner._id}`),
          api.get("/api/food/partner/stats"),
        ]);

        setFoods(foodsRes.data.foods || []);
        setStats(statsRes.data);
      } catch (error) {
        toast({
          title: "Error loading dashboard",
          description: "Could not load your dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [partner, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {partner?.name} 👋
          </h1>
          <p className="text-muted-foreground">
            Here's how your food reels are performing
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Film} label="Total Reels" value={stats.totalReels} />
          <StatCard icon={Heart} label="Total Likes" value={stats.totalLikes} />
          <StatCard icon={Bookmark} label="Total Saves" value={stats.totalSaves} />
          <StatCard
            icon={TrendingUp}
            label="Avg. Engagement"
            value={stats.avgEngagement}
          />
        </div>

        {/* Upload CTA */}
        <Card className="mb-8 overflow-hidden border-border">
          <CardContent className="p-0">
            <div className="gradient-warm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary-foreground mb-1">
                  Share your latest creation
                </h3>
                <p className="text-primary-foreground/80">
                  Upload a new food reel and reach more food lovers
                </p>
              </div>
              <Link to="/partner/upload">
                <Button variant="secondary" size="lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Reel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Food List */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Your Food Reels
        </h2>

        {foods.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {foods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PartnerDashboard;

/* ------------------- Small Components ------------------- */

const StatCard = ({ icon: Icon, label, value }: any) => (
  <Card className="gradient-card border-border">
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-5 w-5 text-primary" />
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="border-border">
    <CardContent className="p-12 text-center">
      <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No reels yet
      </h3>
      <p className="text-muted-foreground mb-4">
        Start uploading your delicious food content
      </p>
      <Link to="/partner/upload">
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Your First Reel
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const FoodCard = ({ food }: { food: Food }) => (
  <Card className="overflow-hidden border-border">
    <div className="relative aspect-[9/16]">
      <video
        src={food.videoUrl}
        className="w-full h-full object-cover"
        muted
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-sm font-medium text-foreground mb-2 line-clamp-1">
          {food.name}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {food.likes}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="h-3 w-3" />
            {food.saves}
          </span>
        </div>
      </div>
    </div>
  </Card>
);
