import { EffectComposer, Bloom, Noise, Vignette, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useEffect, useState } from 'react';

export const SceneEffects = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.4}
      />
      
      <Noise 
        opacity={0.15} 
        blendFunction={BlendFunction.OVERLAY} 
      />
      
      <Scanline 
        density={1.5} 
        opacity={0.15} 
        blendFunction={BlendFunction.OVERLAY}
      />
      
      <ChromaticAberration 
        offset={new THREE.Vector2(0.002, 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />
      
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={1.1} 
      />
    </EffectComposer>
  );
};
