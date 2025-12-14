import { Canvas } from '@react-three/fiber';
import { HoloParticles } from './HoloParticles';
import { SceneEffects } from '../effects/SceneEffects';
import { Suspense } from 'react';

export const CyberBackground = () => {
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
        dpr={[1, 1.5]} // Limit DPR for performance and retro feel
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

