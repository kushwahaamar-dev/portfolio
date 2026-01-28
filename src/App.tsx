import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { useEffect, useMemo, useRef, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Publications } from './components/sections/Publications';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';
import { CustomCursor } from './components/ui/CustomCursor';
import { ArrowUp, Github, Linkedin, Mail, Instagram } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    aria-hidden="true" 
    className={className} 
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { resumeData } from './data/resume';

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const lastShowRef = useRef(false);

  const shouldShowCustomCursor = useMemo(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    // Only show on desktop-like pointers.
    return window.matchMedia('(pointer: fine)').matches;
  }, []);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const raw = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      const progress = Math.max(0, Math.min(1, raw));

      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform = `scaleX(${progress})`;
      }

      const shouldShow = window.scrollY > 500;
      if (shouldShow !== lastShowRef.current) {
        lastShowRef.current = shouldShow;
        setShowBackToTop(shouldShow);
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress" 
        ref={scrollProgressRef}
      />

      {shouldShowCustomCursor && <CustomCursor />}
      
      <Analytics />
      <SpeedInsights />
      
      <MainLayout>
        <Hero />
        <About />
        <Skills />
        <Publications />
        <Projects />
        <Experience />
        <Contact />
        
        {/* Footer */}
        <footer className="py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              {/* Brand */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Amar<span className="text-gradient">.</span>
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Computer Science Engineer & AI Researcher building 
                  the future of human-computer interaction.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                    <li key={item}>
                      <a 
                        href={`#${item.toLowerCase()}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector(`#${item.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-gray-500 hover:text-white transition-colors link-underline"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
      <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Connect
                </h4>
                <div className="flex gap-4">
                  <a 
                    href={`mailto:${resumeData.personal.email}`}
                    className="p-3 rounded-lg bg-white/5 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-all"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a 
                    href={resumeData.personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 text-gray-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
        </a>
                  <a 
                    href={resumeData.personal.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="X (Twitter)"
                  >
                    <XIcon className="w-5 h-5" />
                  </a>
                  <a 
                    href={resumeData.personal.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 text-gray-400 hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-all"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://github.com/kushwahaamar-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
        </a>
      </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} Amar Kushwaha. All rights reserved.
              </p>
              <p className="text-gray-700 text-xs font-mono">
                Designed & Built with React, Three.js & GSAP
        </p>
      </div>
          </div>
        </footer>
      </MainLayout>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-neon-blue text-cyber-black transition-all duration-300 z-50 hover:scale-110 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ boxShadow: '0 0 20px rgba(0, 243, 255, 0.3)' }}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}

export default App;
