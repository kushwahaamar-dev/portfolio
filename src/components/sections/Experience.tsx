import { useRef, useEffect } from 'react';
import { resumeData } from '../../data/resume';
import { Briefcase, Calendar, MapPin, ArrowUpRight, FileText, Users } from 'lucide-react';

export const Experience = () => {
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
        gsap.from(".exp-header", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });

        gsap.from(".exp-card", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 65%",
          },
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        });

        gsap.from(".timeline-line", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
          scaleY: 0,
          transformOrigin: "top",
          duration: 1.5,
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
    <section ref={containerRef} className="relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="exp-header text-center mb-20">
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
            Career Path
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Experience & 
            <span className="text-gradient"> Research</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            My journey through cutting-edge research and development.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div 
            className="timeline-line absolute left-0 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-zinc-800"
          />

          <div className="space-y-12">
            {resumeData.experience.map((exp, idx) => (
              <div 
                key={idx} 
                className={`exp-card relative grid md:grid-cols-2 gap-8 ${
                  idx % 2 === 0 ? '' : 'md:direction-rtl'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 md:-translate-x-1/2 z-10">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-zinc-600 bg-[#09090b]"
                  />
                </div>

                {/* Date - Hidden on mobile, shown on desktop */}
                <div className={`hidden md:flex items-start ${idx % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12 md:order-2'}`}>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-sm">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`pl-8 md:pl-0 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:order-1'}`}>
                  <div className="glass-card p-8 rounded-2xl group hover:border-zinc-600 transition-colors bg-[#09090b] border border-zinc-800">
                    {/* Mobile Date */}
                    <div className="md:hidden flex items-center gap-2 text-zinc-400 font-mono text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </div>

                    {/* Role & Company */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-all">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-medium mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Current Position
                    </span>

                    {/* Description */}
                    <ul className="space-y-3">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex gap-3 text-zinc-400 leading-relaxed">
                          <ArrowUpRight className="w-4 h-4 text-zinc-500 shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publications Section */}
        {resumeData.publications && resumeData.publications.length > 0 && (
          <div className="mt-24">
            <div className="exp-header text-center mb-16">
              <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
                Academic Work
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Publications & 
                <span className="text-gradient"> Papers</span>
              </h3>
            </div>

            <div className="space-y-6">
              {resumeData.publications.map((pub, idx) => (
                <div 
                  key={idx}
                  className="exp-card glass-card p-8 rounded-2xl group hover:border-zinc-600 transition-colors bg-[#09090b] border border-zinc-800"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-bold text-white group-hover:text-zinc-200 transition-all leading-tight">
                        {pub.title}
                      </h4>
                      <p className="text-zinc-400 text-sm mt-2">
                        {pub.journal}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      pub.status === 'in review' 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                        : pub.status === 'published'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        pub.status === 'in review' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                      }`} />
                      {pub.status === 'in review' ? 'In Review' : pub.status === 'published' ? 'Published' : 'Preprint'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs font-medium">
                      <Calendar className="w-3 h-3" />
                      {pub.year}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-zinc-500 text-sm">
                    <Users className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {pub.authors.map((author, i) => (
                        <span key={i}>
                          <span className={author === 'Amar Kushwaha' ? 'text-white font-medium' : ''}>
                            {author}
                          </span>
                          {i < pub.authors.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
