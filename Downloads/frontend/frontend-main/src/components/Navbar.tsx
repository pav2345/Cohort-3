import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bookmark, User, LogOut, Upload, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path: string) => location.pathname === path;

  const userLinks = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const partnerLinks = [
    { path: '/partner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/partner/upload', icon: Upload, label: 'Upload' },
  ];

  const links = role === 'user' ? userLinks : partnerLinks;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/80 backdrop-blur-xl border-t border-border px-4 py-2 safe-area-inset-bottom">
          <div className="flex items-center justify-around">
            {links.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive(path) 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive(path) && "animate-scale-in")} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-muted-foreground hover:text-destructive transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex-col z-50">
        <div className="p-6">
          <Link to={role === 'user' ? '/feed' : '/partner/dashboard'} className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl gradient-warm flex items-center justify-center">
              <span className="text-xl">🍜</span>
            </div>
            <span className="text-xl font-bold text-gradient">FoodReels</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {links.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive(path)
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
