import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowRight, Download, Activity, Cpu, MapPin, Globe } from 'lucide-react';
import { resumeData } from '../../data/resume';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      
      // Staggered reveal animation
      tl.fromTo(".hero-line", 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 }
      )
      .fromTo(".hero-subtitle",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6"
      )
      .fromTo(".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        "-=0.4"
      )
      .fromTo(".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient orbs - Subtle Monochrome */}
      <div 
        className="absolute top-1/4 -left-32 w-96 h-96 bg-white/5 rounded-full blur-[120px] transition-transform duration-1000"
        style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
      />
      <div 
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-zinc-500/5 rounded-full blur-[120px] transition-transform duration-1000"
        style={{ transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)` }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-8">
            {/* Status indicator */}
            <div className="hero-line flex items-center gap-3 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-500"></span>
              </span>
              <span className="text-sm font-mono text-zinc-500 tracking-wider">
                Available for opportunities
              </span>
            </div>

            {/* Main heading - Large and impactful */}
            <div className="space-y-2 mb-8">
              <div className="overflow-hidden">
                <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                  <span className="text-white">Hi, I'm </span>
                  <span className="text-gradient">{resumeData.personal.name.split(' ')[0]}</span>
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white">
                  {resumeData.personal.name.split(' ')[1]}
                  <span className="text-gradient">.</span>
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              CS @ <span className="text-white font-medium">Texas Tech</span> · Building 
              <span className="text-white"> AI that ships</span> · Research in
              <span className="text-zinc-300"> Brain-Computer Interfaces</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={scrollToProjects}
                className="hero-cta btn-primary bg-white text-black hover:bg-zinc-200 border-none"
              >
                <span>View My Work</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={scrollToContact}
                className="hero-cta btn-secondary border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600"
              >
                <span>Get in Touch</span>
              </button>

              <a 
                href="https://drive.google.com/uc?export=download&id=15x1jK4om4k-l7p46QovCn3zL55yYcZv7" 
                target="_blank"
                rel="noopener noreferrer"
                download
                className="hero-cta flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Resume</span>
              </a>
            </div>
          </div>

          {/* Right side - Mission Control Panel */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="hero-cta relative group">
              {/* Background Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white to-zinc-500 opacity-10 blur-lg group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="relative p-6 rounded-2xl bg-[#09090b] border border-zinc-800 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2 text-white">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-mono font-bold tracking-widest">SYSTEM STATUS</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  </div>
                </div>

                {/* Current Task */}
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Current Mission</p>
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Building & Researching</p>
                      <p className="text-xs text-zinc-400">Neural Architectures</p>
                    </div>
                  </div>
                </div>

                {/* Latest Commit / Activity */}
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Latest Activity</p>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <p className="font-mono text-xs text-zinc-400 mb-1">git commit -m</p>
                    <p className="text-sm text-zinc-300">"feat: pushed truthblink for the MBC hackathon"</p>
                  </div>
                </div>

                {/* Location & Load */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">Location</span>
                    </div>
                    <p className="text-sm font-medium text-white">Austin / SF</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                      <Globe className="w-3 h-3" />
                      <span className="text-xs">Focus</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-white w-[98%] animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-gray-600 flex items-start justify-center p-2">
          <ArrowDown className="w-3 h-3 text-gray-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
