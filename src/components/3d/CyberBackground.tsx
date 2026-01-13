import { Canvas } from '@react-three/fiber';
import { HoloParticles } from './HoloParticles';
import { SceneEffects } from '../effects/SceneEffects';
import { Suspense, useMemo } from 'react';

export const CyberBackground = () => {
  // Detect mobile for lower DPR
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1.5] }}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false, // Important for pixel/dither look
          stencil: false,
          depth: false
        }}
        dpr={isMobile ? 1 : [1, 1.5]} // Lower DPR on mobile for faster rendering
      >
        <color attach="background" args={['#09090b']} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <HoloParticles />
          <SceneEffects />
        </Suspense>
      </Canvas>
    </div>
  );
};

