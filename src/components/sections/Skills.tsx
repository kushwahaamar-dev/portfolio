import { useMemo, useRef, useEffect } from 'react';
import { resumeData } from '../../data/resume';
import type { Skill } from '../../types';
import { type LucideIcon, Code2, Cpu, Globe, Wrench } from 'lucide-react';

const categoryConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  'Languages': { icon: Code2, color: '#ffffff', label: 'Core Languages' },
  'AI/ML': { icon: Cpu, color: '#e4e4e7', label: 'AI & Intelligence' },
  'Web': { icon: Globe, color: '#d4d4d8', label: 'Web Technologies' },
  'Tools': { icon: Wrench, color: '#a1a1aa', label: 'DevOps & Tools' }
};

export const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const cats: Record<string, Skill[]> = {};
    resumeData.skills.forEach(skill => {
      if (!cats[skill.category]) cats[skill.category] = [];
      cats[skill.category].push(skill);
    });
    return cats;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      if (reduceMotion || coarsePointer) return;
    }

    type GsapContext = { revert: () => void };
    let ctx: GsapContext | null = null;
    let cancelled = false;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".skill-header", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });

        gsap.from(".tech-group", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        });
      }, containerRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="skills" ref={containerRef} className="relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="skill-header mb-20 md:text-center max-w-3xl mx-auto">
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-4">
            Stack
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What I <span className="text-gradient">use</span>
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Languages, frameworks, and tools I work with daily.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(categories).map(([category, skills]) => {
            const config = categoryConfig[category] || { icon: Code2, color: '#fff', label: category };
            const Icon = config.icon;

            return (
              <div key={category} className="tech-group flex flex-col h-full">
                {/* Category Title */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                  <Icon className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">{config.label}</h3>
                </div>

                {/* Skills List */}
                <div className="flex flex-col gap-3">
                  {skills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                    >
                      <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                      
                      {/* Minimal proficiency dot indicator instead of bar */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                              i < Math.floor(skill.level / 20) 
                                ? 'bg-white opacity-100' 
                                : 'bg-zinc-800 opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Footer Note */}
        <div className="skill-header mt-20 text-center">
           <p className="text-sm font-mono text-zinc-500">
             Always learning.
           </p>
        </div>

      </div>
    </section>
  );
};
