import { type ReactNode, Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from '../ui/Navbar';

const CyberBackground = lazy(() => import('../3d/CyberBackground').then(module => ({ default: module.CyberBackground })));

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-cyber-black text-white overflow-hidden">
      {/* WebGL Background Layer */}
      {isMounted && (
        <Suspense fallback={null}>
          <CyberBackground />
        </Suspense>
      )}

      {/* Static CSS Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-neon-orange/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};
