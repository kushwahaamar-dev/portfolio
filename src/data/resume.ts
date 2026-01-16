import type { ResumeData } from '../types';

export const resumeData: ResumeData = {
  personal: {
    name: "Amar Kushwaha",
    title: "CS Student & Builder",
    email: "amkushwa@ttu.edu",
    location: "Austin/SF",
    linkedin: "https://www.linkedin.com/in/kushwaha-amar",
    x: "https://x.com/amarkushwaha__",
    instagram: "https://www.instagram.com/_a__m_a_r_/",
    phone: "806-559-5600",
    summary: "I build AI systems that work. Currently researching brain-computer interfaces at Texas Tech while shipping production-grade LLM applications. When I'm not in the lab, I'm probably winning hackathons."
  },
  education: {
    school: "Texas Tech University",
    degree: "Bachelor of Science in Computer Science, Engineering, Honors College",
    graduation: "May 2028",
    gpa: "4.0"
  },
  experience: [
    {
      role: "Undergraduate Research Scholar",
      company: "TTU ECE | Honors College | TrUE",
      period: "March 2025 - Present",
      description: [
        "Conducting EEG data analysis focused on quantifying the impact of cognitive effort on seizure suppression.",
        "Developing, tuning, and evaluating machine learning algorithms for predictive modeling, with emphasis on robust validation."
      ]
    }
  ],
  projects: [
    {
      title: "Git0X CLI",
      description: "CLI tool to scan code for exposed secrets before committing. 70+ detection patterns for AI keys, cloud providers, databases, and more. Pre-commit hooks, SARIF output, CI/CD ready.",
      tech: ["Node.js", "CLI", "Security", "NPM"],
      category: "DevSecOps",
      featured: true,
      link: "https://www.npmjs.com/package/git0x",
      github: "https://github.com/kushwahaamar-dev/git0x-cli"
    },
    {
      title: "TruthBlink ",
      description: "A browser extension and dApp that bridges Web2 social media with Web3 prediction markets using Solana Blinks. Place USDC bets on viral claims directly from Twitter/X.",
      tech: ["Solana", "Next.js", "Anchor", "Plasmo", "Gemini 1.5 Flash"],
      category: "Web3",
      featured: true,
      link: "https://github.com/kushwahaamar-dev/truth",
      github: "https://github.com/kushwahaamar-dev/truth"
    },
    {
      title: "Torpe Hitachi Classifier",
      description: "Enterprise-grade AI document classification platform using Google Gemini 2.0 Flash. Integrates RAG/CAG pipelines and Solana blockchain for immutable audit trails.",
      tech: ["Gemini 2.0", "Solana", "RAG", "Python", "React"],
      category: "AI/ML",
      featured: true,
      link: "https://github.com/kushwahaamar-dev/doc-classifier",
      github: "https://github.com/kushwahaamar-dev/doc-classifier"
    },
    {
      title: "LogX+ AI Platform",
      description: "AI web app converting raw logs into structured insights. Features client-side RAG using TF-IDF + cosine similarity over localStorage.",
      tech: ["React", "Gemini API", "TF-IDF", "LocalStorage"],
      category: "Full Stack",
      featured: true,
      link: "https://github.com/kushwahaamar-dev/logx-",
      github: "https://github.com/kushwahaamar-dev/logx-"
    },
    {
      title: "BCI Signal Analysis",
      description: "Comprehensive Python pipeline for EEG motor imagery analysis. Implemented Artifact detection, ERD, PSD, and Multifractal Detrended Fluctuation Analysis (MFDFA).",
      tech: ["Python", "EEG", "Scikit-learn", "MFDFA", "LDA"],
      category: "Research",
      featured: true,
      link: "https://github.com/kushwahaamar-dev/bci_eeg_mfdfa",
      github: "https://github.com/kushwahaamar-dev/bci_eeg_mfdfa"
    },
    {
      title: "Website RAG Query System",
      description: "RAG-based query system using Streamlit and DeepSeek-R1 for context-aware website content querying.",
      tech: ["Streamlit", "LangChain", "FAISS", "Ollama"],
      category: "AI/ML",
      featured: false,
      link: "http://github.com/kushwahaamar-dev/WebRAG-/",
      github: "http://github.com/kushwahaamar-dev/WebRAG-/"
    },
    {
      title: "RLM Implementation",
      description: "Reasoning Language Model implementation with multi-step inference and chain-of-thought capabilities for enhanced AI reasoning.",
      tech: ["Python", "PyTorch", "Transformers", "LangChain"],
      category: "AI/ML",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/rlms",
      github: "https://github.com/kushwahaamar-dev/rlms"
    },
    {
      title: "Tsinghua Sorting Barrier",
      description: "Interactive algorithm visualization comparing Dijkstra's shortest path with optimized barrier algorithms on real-world map data.",
      tech: ["TypeScript", "Leaflet", "OpenStreetMap", "Vite"],
      category: "Research",
      featured: false,
      link: "https://sorting-barrier.vercel.app/",
      github: "https://github.com/kushwahaamar-dev/sorting-barrier"
    }
  ],
  skills: [
    // Languages
    { name: "Python", level: 95, category: "Languages" },
    { name: "TypeScript", level: 92, category: "Languages" },
    { name: "JavaScript", level: 90, category: "Languages" },
    { name: "C", level: 85, category: "Languages" },
    { name: "SQL", level: 85, category: "Languages" },
    { name: "Rust", level: 75, category: "Languages" },

    // AI/ML
    { name: "Gemini API", level: 95, category: "AI/ML" },
    { name: "LangChain", level: 90, category: "AI/ML" },
    { name: "RAG Pipelines", level: 92, category: "AI/ML" },
    { name: "TensorFlow", level: 85, category: "AI/ML" },
    { name: "PyTorch", level: 82, category: "AI/ML" },
    { name: "Scikit-learn", level: 88, category: "AI/ML" },
    { name: "FAISS", level: 85, category: "AI/ML" },
    { name: "NumPy/Pandas", level: 92, category: "AI/ML" },
    { name: "Ollama", level: 80, category: "AI/ML" },

    // Web
    { name: "React", level: 92, category: "Web" },
    { name: "Node.js", level: 88, category: "Web" },
    { name: "Flask", level: 85, category: "Web" },
    { name: "Vite", level: 90, category: "Web" },
    { name: "Tailwind CSS", level: 92, category: "Web" },
    { name: "Three.js/R3F", level: 80, category: "Web" },
    { name: "Streamlit", level: 85, category: "Web" },
    { name: "Solana/Anchor", level: 78, category: "Web" },

    // Tools
    { name: "Git/GitHub", level: 95, category: "Tools" },
    { name: "Docker", level: 85, category: "Tools" },
    { name: "SQLAlchemy", level: 82, category: "Tools" },
    { name: "Pydantic", level: 85, category: "Tools" },
    { name: "Turborepo", level: 78, category: "Tools" },
    { name: "GSAP", level: 80, category: "Tools" }
  ]
};
