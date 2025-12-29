import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChefHat, Users, Heart, Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'user') {
        navigate('/feed');
      } else if (role === 'foodPartner') {
        navigate('/partner/dashboard');
      }
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-warm flex items-center justify-center shadow-glow animate-pulse-glow">
              <span className="text-4xl">🍜</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-foreground">Discover</span>
            <br />
            <span className="text-gradient">Delicious Stories</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Scroll through mouth-watering food reels from your favorite restaurants and food partners
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/login">
              <Button size="xl" className="w-full sm:w-auto">
                <Play className="h-5 w-5" />
                Start Watching
              </Button>
            </Link>
            <Link to="/food-partner/register">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                <ChefHat className="h-5 w-5" />
                Become a Partner
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Food Reels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Food Lovers</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-muted-foreground rounded-full" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-24 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Why FoodReels?
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Experience food like never before with our immersive video platform
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-5 shadow-glow">
                <Utensils className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Discover Dishes
              </h3>
              <p className="text-muted-foreground">
                Explore thousands of food reels from restaurants near you
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-5 shadow-glow">
                <Heart className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Save Favorites
              </h3>
              <p className="text-muted-foreground">
                Like and save the dishes you want to try later
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-5 shadow-glow">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Connect with Partners
              </h3>
              <p className="text-muted-foreground">
                Find and follow your favorite food creators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍜</span>
            <span className="font-bold text-foreground">FoodReels</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FoodReels. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
