import { useEffect, useRef } from 'react';
import { resumeData } from '../../data/resume';
import { Trophy } from 'lucide-react';

export const Achievements = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
        gsap.from('.ach-header', {
          scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
          y: 36,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
        });
        gsap.from('.ach-card', {
          scrollTrigger: { trigger: containerRef.current, start: 'top 72%' },
          y: 44,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }, containerRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="achievements" ref={containerRef} className="relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="ach-header max-w-3xl mb-16">
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
            Achievements
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Hackathons &amp;
            <span className="text-gradient"> competitions</span>
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Ship logs from recent builds — dual-track wins, governance UX, infra, and Solana-native
            agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resumeData.achievements.map((a) => (
            <div
              key={a.name}
              className="ach-card flex gap-5 p-6 md:p-7 rounded-2xl border border-zinc-800 bg-[#09090b] hover:border-zinc-600 transition-colors"
            >
              <div className="shrink-0 p-3 rounded-xl bg-zinc-900 border border-zinc-800 h-fit">
                <Trophy className="w-6 h-6 text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white mb-2">{a.name}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{a.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
