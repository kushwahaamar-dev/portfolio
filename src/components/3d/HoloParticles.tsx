import { type ComponentProps, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { inSphere } from 'maath/random';
import * as THREE from 'three';

export const HoloParticles = (props: ComponentProps<typeof Points>) => {
  const ref = useRef<THREE.Points>(null!);
  // Keep this lightweight: compute once, fewer points.
  const sphere = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    const count = isMobile ? 300 : 2500; // Minimal particles on mobile for faster init
    return inSphere(new Float32Array(count * 3), { radius: 1.5 }) as Float32Array;
  }, []);

  useFrame((_state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};
