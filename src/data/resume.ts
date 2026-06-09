import type { ResumeData } from '../types';

export const resumeData: ResumeData = {
  personal: {
    name: "Amar Kushwaha",
    title: "CS @ Texas Tech · Agentic AI & Neurotech",
    email: "amkushwa@ttu.edu",
    location: "Lubbock, TX",
    linkedin: "https://www.linkedin.com/in/kushwaha-amar",
    x: "https://x.com/amarkushwaha__",
    instagram: "https://www.instagram.com/_a__m_a_r_/",
    phone: "806-559-5600",
    summary:
      "I design and ship LLM systems end-to-end: retrieval + tool calling, multi-agent orchestration, evaluations, and production integrations. At Texas Tech I model large-scale brain networks for epilepsy research (Frontiers co-author). Incoming Applied Scientist Intern (Agentic AI) at Tempora Labs — summer 2026.",
  },
  education: {
    school: "Texas Tech University",
    degree: "B.S. Computer Science, Minor in Mathematics, Honors College",
    graduation: "Dec 2027",
    gpa: "4.0",
  },
  experience: [
    {
      role: "Applied Scientist Intern — Agentic AI",
      company: "Tempora Labs",
      period: "May 25, 2026 — Aug 7, 2026",
      location: "Remote · Lubbock, TX",
      statusLabel: "Incoming · Summer 2026",
      description: [
        "Shipping user-facing agent workflows: planning, tool-augmented reasoning, multi-agent orchestration, and human-in-the-loop review with clear failure modes.",
        "Building retrieval-augmented, tool-calling LLM stacks for automated digital-asset investment flows — structured calls, ReAct-style reasoning, planner–executor patterns, reflection, and specialist agents.",
        "Improving model quality with fine-tuning, prompt design, offline/online evaluations, and inference optimization (attention, positional encodings, KV cache); integrating market and on-chain data behind guarded interfaces.",
        "Partnering with engineering, research, and product on fast iteration; translating architecture and tradeoffs via specs, deep-dives, and demos.",
      ],
    },
    {
      role: "Undergraduate Research Scholar",
      company: "TTU ECE · Honors College · TrUE Program",
      period: "Mar 2025 — Present",
      location: "Lubbock, TX",
      statusLabel: "Current",
      description: [
        "Simulating seizure propagation with Epileptor 6D on 76–998 region connectomes using reproducible, large-scale computational pipelines.",
        "Accelerating experiments with Numba JIT (~1000×) and transmission-delay models for closed-loop control prototypes.",
        "Combining Human Connectome Project tractography with interactive 3D tooling to support surgical planning workflows.",
        "Co-author on peer-reviewed work in Frontiers in Network Physiology — Fractal Physiology.",
      ],
    },
  ],
  achievements: [
    {
      name: "Hook 'Em Hacks",
      result:
        "Winner · Best Use of Solana — Oath: pre-commitment & enforcement protocol for AI agents",
    },
    {
      name: "ETHDenver 2026",
      result:
        "Dual-track winner with Kayden — Nouns Builder (governance UX & community tooling) + ADI Foundation track",
    },
    {
      name: "TAMU Datathon 2025",
      result:
        "Winner, HackMLH — enterprise document workflow with Gemini AI, structured extraction, Solana audit logging",
    },
    {
      name: "HackWesTX VI",
      result:
        "Dual winner — Best Use of Gemini API + 1st place Best Use of Web3 (Solana)",
    },
  ],
  projects: [
    {
      title: "Universal Sentinel",
      description:
        "Full-stack disaster response: GDACS / NASA / NOAA ingestion, FastAPI services, React UI, AI-gated payouts, and auditable on-chain treasury flows with NGO verification.",
      tech: ["Python", "FastAPI", "React", "Solana", "Gemini"],
      category: "Web3",
      featured: true,
      link: "https://github.com/amarkushwaha/universal-sentinel",
      github: "https://github.com/amarkushwaha/universal-sentinel",
    },
    {
      title: "git0x-cli",
      description:
        "Production CLI secret scanner: 70+ patterns, SARIF + JSON, GitHub Actions, pre-commit hooks, baseline allowlists for low noise in enterprise CI.",
      tech: ["Node.js", "JavaScript", "SARIF", "GitHub Actions"],
      category: "DevSecOps",
      featured: true,
      link: "https://www.npmjs.com/package/git0x",
      github: "https://github.com/kushwahaamar-dev/git0x-cli",
    },
    {
      title: "Kayden",
      description:
        "Autonomous AI agent stack on Base — agents as iNFTs with Token Bound Accounts, ERC-4337 paymaster, Nouns Builder DAO governance (ETHDenver build).",
      tech: ["Solidity", "Next.js", "Foundry", "ERC-6551", "wagmi"],
      category: "Web3",
      featured: true,
      link: "https://kayden-dao.vercel.app",
      github: "https://github.com/kushwahaamar-dev/kayden",
    },
    {
      title: "Oath",
      description:
        "Solana-side pre-commitment and enforcement for AI agents — Hook 'Em Hacks Best Use of Solana winner.",
      tech: ["Solana", "Rust", "Anchor", "TypeScript"],
      category: "Web3",
      featured: true,
      link: "https://oa-th.wiki",
      github: "https://github.com/kushwahaamar-dev/oath",
    },
    {
      title: "ZeroGate",
      description:
        "Local-first Polkadot paywall: in-browser Smoldot light client, trustless verification, creator-first economics (Blockspace Church winner).",
      tech: ["Next.js", "Polkadot", "Smoldot", "Framer Motion"],
      category: "Web3",
      featured: true,
      link: "https://v0id-one.vercel.app",
      github: "https://github.com/kushwahaamar-dev/v0id",
    },
    {
      title: "NEXUS",
      description:
        "9-model EEG motor-imagery ensemble (76.66% 4-class accuracy); Euclidean Alignment + deep nets + CSP/SVM with Dirichlet weight search.",
      tech: ["PyTorch", "SciPy", "scikit-learn", "EEGNet"],
      category: "Neurotech/BCI",
      featured: true,
      link: "https://github.com/kushwahaamar-dev/nexus",
      github: "https://github.com/kushwahaamar-dev/nexus",
    },
    {
      title: "TruthBlink",
      description:
        "Browser extension + dApp: Solana Blinks for prediction markets from social feeds; Gemini-assisted flows.",
      tech: ["Solana", "Anchor", "Next.js", "Gemini API"],
      category: "Web3",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/truth",
      github: "https://github.com/kushwahaamar-dev/truth",
    },
    {
      title: "Enterprise Doc Classifier",
      description:
        "Gemini-powered document classification with RAG/CAG-style pipelines and Solana audit trails (TAMU Datathon / HackMLH lineage).",
      tech: ["Gemini", "Python", "React", "Solana"],
      category: "AI/ML",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/doc-classifier",
      github: "https://github.com/kushwahaamar-dev/doc-classifier",
    },
    {
      title: "VEP Brain Modeling",
      description:
        "Virtual epileptic patient simulations: Epileptor 6D, delays, TVB-adjacent workflows, 3D visualization for intervention planning.",
      tech: ["Python", "Numba", "Plotly", "NumPy"],
      category: "Research",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/brain-modeling-research",
      github: "https://github.com/kushwahaamar-dev/brain-modeling-research",
    },
    {
      title: "LogX+",
      description:
        "Log → insight web app with client-side RAG (TF-IDF + cosine) and Gemini augmentation.",
      tech: ["React", "Gemini", "TF-IDF"],
      category: "Full Stack",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/logx-",
      github: "https://github.com/kushwahaamar-dev/logx-",
    },
    {
      title: "BCI Signal Lab",
      description:
        "EEG motor-imagery pipeline: artifacts, ERD/ERS, PSD, multifractal / MFDFA-style analyses.",
      tech: ["Python", "scikit-learn", "MNE"],
      category: "Research",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/bci_eeg_mfdfa",
      github: "https://github.com/kushwahaamar-dev/bci_eeg_mfdfa",
    },
    {
      title: "Website RAG",
      description:
        "Streamlit RAG over site content with vector search and local / API LLM backends.",
      tech: ["Streamlit", "LangChain", "FAISS"],
      category: "AI/ML",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/WebRAG-",
      github: "https://github.com/kushwahaamar-dev/WebRAG-",
    },
    {
      title: "RLM prototype",
      description:
        "Multi-step reasoning / chain-style language model experiments on PyTorch.",
      tech: ["Python", "PyTorch", "Transformers"],
      category: "AI/ML",
      featured: false,
      link: "https://github.com/kushwahaamar-dev/rlms",
      github: "https://github.com/kushwahaamar-dev/rlms",
    },
    {
      title: "Sorting Barrier Viz",
      description:
        "Interactive shortest-path vs barrier algorithms on real map tiles (TypeScript + Leaflet).",
      tech: ["TypeScript", "Leaflet", "Vite"],
      category: "Research",
      featured: false,
      link: "https://sorting-barrier.vercel.app/",
      github: "https://github.com/kushwahaamar-dev/sorting-barrier",
    },
  ],
  skills: [
    { name: "Python", level: 95, category: "Languages" },
    { name: "TypeScript", level: 92, category: "Languages" },
    { name: "JavaScript", level: 90, category: "Languages" },
    { name: "SQL", level: 88, category: "Languages" },
    { name: "C", level: 85, category: "Languages" },
    { name: "Rust", level: 76, category: "Languages" },

    { name: "LangChain", level: 92, category: "AI/ML" },
    { name: "Gemini API", level: 94, category: "AI/ML" },
    { name: "RAG / tool calling", level: 93, category: "AI/ML" },
    { name: "PyTorch", level: 88, category: "AI/ML" },
    { name: "TensorFlow", level: 84, category: "AI/ML" },
    { name: "scikit-learn", level: 88, category: "AI/ML" },
    { name: "FAISS", level: 86, category: "AI/ML" },
    { name: "NumPy / scientific Python", level: 92, category: "AI/ML" },

    { name: "React", level: 93, category: "Web" },
    { name: "Next.js", level: 90, category: "Web" },
    { name: "Node.js", level: 89, category: "Web" },
    { name: "FastAPI", level: 90, category: "Web" },
    { name: "Tailwind CSS", level: 91, category: "Web" },
    { name: "Vite", level: 90, category: "Web" },
    { name: "Three.js / R3F", level: 82, category: "Web" },
    { name: "Solana / Anchor", level: 80, category: "Web" },

    { name: "Git / GitHub", level: 95, category: "Tools" },
    { name: "Docker", level: 86, category: "Tools" },
    { name: "GitHub Actions / CI", level: 90, category: "Tools" },
    { name: "PostgreSQL", level: 84, category: "Tools" },
    { name: "Linux", level: 88, category: "Tools" },
    { name: "GSAP", level: 82, category: "Tools" },
  ],
  publications: [
    {
      title:
        "Quantifying Cognitive Effort's Impact on Suppression of Epilepsy-Associated After Discharges",
      journal: "Frontiers in Network Physiology — Fractal Physiology",
      authors: [
        "Pavan Beeram",
        "Matthew Farris",
        "Samir Hossain",
        "Nicholas Rethans",
        "Amar Kushwaha",
        "Shruti Dayanand Chougule",
        "Joon Y. Kang",
        "Emily A. Pereira",
      ],
      status: "in review",
      year: 2025,
    },
  ],
};
