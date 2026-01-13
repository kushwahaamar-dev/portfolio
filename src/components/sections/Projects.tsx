import { useRef, useEffect, useState } from 'react';
import { resumeData } from '../../data/resume';
import { Github, ExternalLink, ArrowUpRight, Folder, Star } from 'lucide-react';
const ProjectCard = ({ project }: { project: typeof resumeData.projects[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const div = cardRef.current;
    const rect = div.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateX = (mouseY - height / 2) / 20;
    const rotateY = (mouseX - width / 2) / 20;
    setRotation({ x: rotateX, y: -rotateY });
    setOpacity(1);
  };
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setOpacity(0);
  };
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="project-card group relative h-full rounded-2xl border border-zinc-800 bg-[#09090b] transition-all duration-200"
      style={{
        transform: `perspective(1000px) rotateX(${-rotation.x}deg) rotateY(${-rotation.y}deg)`,
      }}
    >
      {/* Gradient Glow Effect on Hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${50 + rotation.y * 3}% ${50 + rotation.x * 3}%, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      <div className="relative p-5 flex flex-col h-full transform-style-3d">
        {/* Top Bar */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors"
            >
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-all leading-tight">
                {project.title}
              </h3>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider mt-0.5 text-zinc-500"
              >
                {project.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 z-10">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-900 hover:bg-white hover:text-black text-zinc-400 transition-all border border-zinc-800"
                title="View Source"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-900 hover:bg-white hover:text-black text-zinc-400 transition-all border border-zinc-800"
                title="Live Demo"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3 flex-grow">
          {project.description}
        </p>
        <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          {/* Tech Stack - Minimal Text */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.tech.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium"
              >
                <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-white transition-colors" />
                {tech}
              </span>
            ))}
          </div>
          {project.featured && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
              <Star className="w-2.5 h-2.5 text-white fill-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Featured</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export const Projects = () => {
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
        gsap.from(".project-header", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
        // Only animate Y position, not opacity - prevents cards from staying dim
        gsap.from(".project-card", {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 40,
          duration: 0.6,
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
    <section id="projects" ref={containerRef} className="relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="project-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div className="max-w-2xl">
            <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
              Projects
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Things I've
              <span className="text-gradient"> built</span>
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Real projects, real users, real impact.
            </p>
          </div>
          <a
            href="https://github.com/kushwahaamar-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black transition-all font-medium"
          >
            <span>View GitHub Profile</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
        {/* Projects Grid - 2x4 Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {resumeData.projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
        {/* Bottom CTA */}
        <div className="project-header mt-20 text-center">
          <p className="text-zinc-500 mb-6 text-lg">
            More on GitHub
          </p>
          <a
            href="https://github.com/kushwahaamar-dev?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-zinc-700 text-white hover:bg-zinc-800 transition-colors font-medium"
          >
            <span>View Repository Archive</span>
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
