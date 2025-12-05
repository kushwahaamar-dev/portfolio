import { useState, useRef, useEffect } from 'react';
import { resumeData } from '../../data/resume';
import { Mail, Linkedin, Github, Send, CheckCircle, Loader2, AlertCircle, ArrowUpRight, Copy, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-fade", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(resumeData.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');
    
    try {
      const response = await fetch("https://formspree.io/f/xanrbbpb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: resumeData.personal.email,
      href: `mailto:${resumeData.personal.email}`,
      color: '#ffffff'
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      value: 'Connect with me',
      href: resumeData.personal.linkedin,
      color: '#0A66C2' // Keep brand color or change to white? Let's keep brand for recognition or white for strict minimalism. White.
    },
    { 
      icon: Github, 
      label: 'GitHub', 
      value: 'View my code',
      href: 'https://github.com/amarkushwaha',
      color: '#ffffff'
    }
  ];

  return (
    <section id="contact" ref={containerRef} className="relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="contact-fade text-center mb-20">
          <p className="text-zinc-400 font-mono text-sm tracking-widest uppercase mb-6">
            Contact
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get in
            <span className="text-gradient"> touch</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Internships, research opportunities, or interesting projects — I'm listening.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            {/* Email Card - Prominent */}
            <div className="contact-fade p-8 rounded-2xl border border-zinc-800 bg-[#09090b]">
              <p className="text-sm text-zinc-400 mb-2">Reach me directly at</p>
              <div className="flex items-center justify-between gap-4">
                <a 
                  href={`mailto:${resumeData.personal.email}`}
                  className="text-lg md:text-xl font-medium text-white hover:text-zinc-300 transition-colors truncate"
                >
                  {resumeData.personal.email}
                </a>
                <button 
                  onClick={copyEmail}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors shrink-0 border border-zinc-800"
                  title="Copy email"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-fade space-y-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  target={link.label !== 'Email' ? '_blank' : undefined}
                  rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="group flex items-center justify-between p-5 rounded-xl border border-zinc-800 bg-[#09090b] hover:border-zinc-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3 rounded-lg bg-zinc-900 border border-zinc-800"
                    >
                      <link.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-zinc-200 transition-colors">
                        {link.label}
                      </p>
                      <p className="text-sm text-zinc-500">{link.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>

            {/* Location */}
            <div className="contact-fade p-6 rounded-xl border border-zinc-800 bg-[#09090b]">
              <p className="text-sm text-zinc-500 mb-1">Based in</p>
              <p className="text-white font-medium">{resumeData.personal.location}</p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <form 
            ref={formRef} 
            onSubmit={handleSubmit}
            action="#"
            method="POST" 
            className="contact-fade p-8 md:p-10 rounded-2xl border border-zinc-800 bg-[#09090b]"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Send a message</h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-3">
                    Your Name
                  </label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required 
                    className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-white focus:ring-1 focus:ring-white focus:bg-zinc-900"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-3">
                    Your Email
                  </label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required 
                    className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 outline-none transition-all duration-300 focus:border-white focus:ring-1 focus:ring-white focus:bg-zinc-900"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-3">
                  Your Message
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows={6}
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-600 outline-none transition-all duration-300 resize-none focus:border-white focus:ring-1 focus:ring-white focus:bg-zinc-900"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  status === 'error' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white hover:bg-zinc-200 text-black'
                }`}
              >
                {status === 'idle' && (
                  <>
                    <span>Send Message</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Message Sent!</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    <span>Try Again</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
