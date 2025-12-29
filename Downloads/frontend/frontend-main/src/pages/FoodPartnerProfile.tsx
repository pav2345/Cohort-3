import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Play, Heart, Bookmark, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { FoodPartner, Food } from '@/types';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const FoodPartnerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<FoodPartner | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const { data } = await api.get(`/api/food-partner/${id}`);
        setPartner(data.partner);
        setFoods(data.foods || []);
      } catch (error) {
        toast({
          title: 'Error loading profile',
          description: 'Could not load partner profile.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!partner) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Partner not found</h2>
          <Link to="/feed">
            <Button variant="outline">Back to Feed</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 pb-24">
        {/* Back Button */}
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        {/* Profile Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl gradient-warm flex items-center justify-center shadow-glow">
              <span className="text-3xl font-bold text-primary-foreground">
                {partner.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{partner.name}</h1>
              <p className="text-muted-foreground">{foods.length} food reels</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            {partner.address && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{partner.address}</span>
              </div>
            )}
            {partner.phone && (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{partner.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{partner.email}</span>
            </div>
          </div>
        </div>

        {/* Food Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Food Reels</h2>
          {foods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No food reels yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden bg-card group cursor-pointer"
                >
                  <video
                    src={food.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 rounded-full bg-background/30 backdrop-blur-sm">
                      <Play className="h-6 w-6 text-foreground" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-sm font-medium text-foreground mb-1 line-clamp-1">
                      {food.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FoodPartnerProfile;
