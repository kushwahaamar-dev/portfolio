import { type ReactNode, Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from '../ui/Navbar';
import Lenis from 'lenis';

const CyberBackground = lazy(() => import('../3d/CyberBackground').then(module => ({ default: module.CyberBackground })));

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [showWebGLBackground, setShowWebGLBackground] = useState(false);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    // Detect mobile/touch devices
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    // Only disable if very low end (<= 2 cores) or low memory
    const veryLowSpec = (typeof cores === 'number' && cores <= 2) || (typeof deviceMemory === 'number' && deviceMemory < 2);

    const shouldEnableWebGL = !prefersReducedMotion && !veryLowSpec;

    if (!shouldEnableWebGL) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setShowWebGLBackground(true);
    };

    // Defer WebGL init - longer delay on mobile to let main content render first
    const delay = isMobile ? 3000 : 1200;

    type RequestIdleCallback = (cb: () => void, opts?: { timeout?: number }) => number;
    type CancelIdleCallback = (handle: number) => void;
    const { requestIdleCallback, cancelIdleCallback } = window as unknown as {
      requestIdleCallback?: RequestIdleCallback;
      cancelIdleCallback?: CancelIdleCallback;
    };

    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(start, { timeout: delay });
      return () => {
        cancelled = true;
        cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(start, delay);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-cyber-black text-white overflow-hidden">
      {/* WebGL Background Layer */}
      {showWebGLBackground && (
        <Suspense fallback={null}>
          <CyberBackground />
        </Suspense>
      )}

      {/* Static CSS Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Cinematic Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
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
