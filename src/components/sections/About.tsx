import { useRef, useEffect } from 'react';
import { resumeData } from '../../data/resume';
import { Code2, Brain, Database, Rocket, GraduationCap, Trophy, Target } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  { icon: GraduationCap, label: "GPA", value: resumeData.education.gpa, color: "#ffffff" },
  { icon: Trophy, label: "Hackathon Wins", value: "3x", color: "#e4e4e7" },
  { icon: Target, label: "Research Focus", value: "BCI", color: "#d4d4d8" },
];

const expertise = [
  {
    icon: Brain,
    title: "BCI Research",
    description: "Analyzing EEG signals to predict cognitive states. Published work on seizure suppression patterns.",
    color: "#ffffff"
  },
  {
    icon: Database,
    title: "LLM Applications",
    description: "Production RAG systems with Gemini, LangChain, and vector databases. Not just demos.",
    color: "#e4e4e7"
  },
  {
    icon: Code2,
    title: "Full-Stack",
    description: "React, TypeScript, Python. I ship fast and iterate faster.",
    color: "#d4d4d8"
  },
  {
    icon: Rocket,
    title: "Web3",
    description: "Solana programs in Rust. Built audit trail systems on-chain.",
    color: "#a1a1aa"
  }
];

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in animations
      gsap.from(".about-fade", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="about-fade max-w-3xl mb-20">
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
            About
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            I build things that
            <span className="text-gradient"> matter</span>
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            {resumeData.personal.summary}
          </p>
        </div>

        {/* Stats Row */}
        <div className="about-fade grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {highlights.map((item) => (
            <div 
              key={item.label}
              className="p-8 rounded-2xl text-center group hover:scale-[1.02] transition-transform duration-300 border border-zinc-800 bg-[#09090b]"
            >
              <div 
                className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-zinc-900 border border-zinc-800"
              >
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{item.value}</p>
              <p className="text-sm text-zinc-500 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {expertise.map((item, index) => (
            <div 
              key={item.title}
              className="about-fade p-8 rounded-2xl group border border-zinc-800 bg-[#09090b] hover:border-zinc-600 transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                <div 
                  className="p-4 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110 bg-zinc-900 border border-zinc-800"
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-200 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education Card */}
        <div className="about-fade mt-12 p-8 md:p-10 rounded-2xl border border-zinc-800 bg-[#09090b]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{resumeData.education.school}</h3>
                <p className="text-zinc-400">{resumeData.education.degree}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{resumeData.education.gpa}</p>
                <p className="text-sm text-zinc-500">GPA</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white">{resumeData.education.graduation}</p>
                <p className="text-sm text-zinc-500">Expected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
