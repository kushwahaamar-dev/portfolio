import { useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';
import { CustomCursor } from './components/ui/CustomCursor';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { resumeData } from './data/resume';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
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
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <CustomCursor />
      
      <MainLayout>
        <Hero />
        <About />
        <Skills />
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
                    href="https://github.com/amarkushwaha"
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
