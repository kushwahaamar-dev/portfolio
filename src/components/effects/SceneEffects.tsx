// @ts-nocheck
import { EffectComposer, Bloom, Noise, Vignette, Scanline, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export const SceneEffects = () => {
  return (
    <EffectComposer disableNormalPass>
      {/* Neon Glow */}
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.4}
      />
      
      {/* Cyberpunk Gritty Noise - Simulates Dither */}
      <Noise 
        opacity={0.15} 
        blendFunction={BlendFunction.OVERLAY} 
      />
      
      {/* CRT Scanlines */}
      <Scanline 
        density={1.5} 
        opacity={0.15} 
        blendFunction={BlendFunction.OVERLAY}
      />
      
      {/* Holographic Fringe */}
      <ChromaticAberration 
        offset={new THREE.Vector2(0.002, 0.002)}
        radialModulation={false}
        modulationOffset={0}
      />
      
      {/* Cinematic Edges */}
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={1.1} 
      />
    </EffectComposer>
  );
};
