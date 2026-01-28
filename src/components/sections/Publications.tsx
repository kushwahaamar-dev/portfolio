import { useRef, useEffect } from 'react';
import { resumeData } from '../../data/resume';
import { FileText, Users, Calendar, ExternalLink } from 'lucide-react';

export const Publications = () => {
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
        gsap.from(".pub-header", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });

        gsap.from(".pub-card", {
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
      }, containerRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  if (!resumeData.publications || resumeData.publications.length === 0) {
    return null;
  }

  return (
    <section id="publications" ref={containerRef} className="py-32 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="pub-header text-center mb-16">
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
            Academic Work
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Publications & 
            <span className="text-gradient"> Papers</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Contributing to scientific research and knowledge.
          </p>
        </div>

        {/* Publications Grid */}
        <div className="space-y-6">
          {resumeData.publications.map((pub, idx) => (
            <div 
              key={idx}
              className="pub-card glass-card p-8 rounded-2xl group hover:border-zinc-600 transition-all duration-300 bg-[#09090b] border border-zinc-800 hover:bg-zinc-900/50"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shrink-0 self-start">
                  <FileText className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-zinc-200 transition-all leading-tight mb-3">
                    {pub.title}
                  </h3>

                  {/* Journal */}
                  <p className="text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="text-zinc-500">Journal:</span>
                    <span className="text-zinc-300">{pub.journal}</span>
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border ${
                      pub.status === 'in review' 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' 
                        : pub.status === 'published'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        pub.status === 'in review' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                      }`} />
                      {pub.status === 'in review' ? 'In Review' : pub.status === 'published' ? 'Published' : 'Preprint'}
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-700 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {pub.year}
                    </span>
                    {pub.link && (
                      <a 
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-700 text-sm font-medium hover:text-white hover:border-zinc-500 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Paper
                      </a>
                    )}
                  </div>

                  {/* Authors */}
                  <div className="flex flex-col gap-2">
                    {/* Your contribution callout */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                        Contributing Author
                      </span>
                      <span className="text-zinc-400 text-sm">Amar Kushwaha</span>
                    </div>
                    
                    {/* Full author list (collapsible style) */}
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="w-4 h-4 text-zinc-600 shrink-0 mt-1" />
                      <p className="text-zinc-600 leading-relaxed">
                        {pub.authors[0]}, {pub.authors[1]} <span className="text-zinc-700">+ {pub.authors.length - 2} co-authors</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
