import { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu, Layers, User, Mail } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'About', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Cpu },
  { name: 'Projects', href: '#projects', icon: Layers },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => item.href.substring(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={clsx(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled 
        ? "bg-cyber-black/80 backdrop-blur-xl border-b border-white/5" 
        : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-3 group" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block text-white">
              Amar<span className="text-zinc-500">.</span>
            </span>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  activeSection === item.href.substring(1) 
                    ? "text-white bg-white/10" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={clsx(
        "md:hidden absolute top-full left-0 w-full bg-[#09090b]/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                activeSection === item.href.substring(1)
                  ? "text-white bg-white/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
