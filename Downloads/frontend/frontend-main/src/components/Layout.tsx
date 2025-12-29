import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullScreen = false }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className={cn(
          isAuthenticated && !fullScreen && "md:ml-64",
          isAuthenticated && !fullScreen && "pb-20 md:pb-0",
          fullScreen && "h-screen"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
