export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  category: 'AI/ML' | 'Web3' | 'Full Stack' | 'Research' | 'DevSecOps';
  featured: boolean;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Languages' | 'AI/ML' | 'Web' | 'Tools';
}

export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    location: string;
    linkedin: string;
    x: string;
    instagram: string;
    phone: string;
    summary: string;
  };
  education: {
    school: string;
    degree: string;
    graduation: string;
    gpa: string;
  };
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
}

