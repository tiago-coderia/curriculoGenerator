export interface ResumeExperienceItem {
  company: string;
  role: string;
  location?: string;
  dates: string;
  bullets: string[];
}

export interface ResumeProjectItem {
  name: string;
  role?: string;
  url?: string;
  bullets: string[];
}

export interface ResumeEducationItem {
  institution: string;
  degree: string;
  field?: string;
  dates: string;
  details?: string;
}

export interface ResumeCertificationItem {
  name: string;
  issuer: string;
  date?: string;
}

export interface ResumeSkillCategoryGroup {
  category: string;
  skills: string[];
}

export interface ResumeDocument {
  personalInfo: {
    name: string;
    headline?: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  professionalSummary: string;
  skillGroups: ResumeSkillCategoryGroup[];
  experience: ResumeExperienceItem[];
  projects?: ResumeProjectItem[];
  education: ResumeEducationItem[];
  certifications?: ResumeCertificationItem[];
  languages?: string[];
}

export interface FactCheckResult {
  passed: boolean;
  score: number;
  unsupportedClaims: {
    claim: string;
    location: string;
    reason: string;
  }[];
  supportedEvidenceCount: number;
}
