import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer' || target.tagName === 'A' || target.tagName === 'BUTTON');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Main Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-neon-blue rounded-full pointer-events-none z-[100] mix-blend-difference transition-transform duration-75"
        style={{ 
          transform: `translate(${position.x - 4}px, ${position.y - 4}px) scale(${isPointer ? 1.5 : 1})` 
        }}
      />
      
      {/* Outer Ring */}
      <div 
        className="fixed top-0 left-0 w-8 h-8 border border-neon-blue rounded-full pointer-events-none z-[100] transition-all duration-300 ease-out mix-blend-difference"
        style={{ 
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`,
          opacity: isPointer ? 0.8 : 0.4
        }}
      />
    </>
  );
};

