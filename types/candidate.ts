export interface CandidateProfileData {
  id?: string;
  name: string;
  headline?: string | null;
  email: string;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  summary?: string | null;
}

export interface ProfessionalExperienceData {
  id?: string;
  candidateId?: string;
  company: string;
  role: string;
  employmentType?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  achievements: string[]; // Parsed array
  technologies: string[]; // Parsed array
}

export interface EducationData {
  id?: string;
  candidateId?: string;
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface SkillData {
  id?: string;
  candidateId?: string;
  name: string;
  category: 'Technical' | 'AI' | 'Programming' | 'Database' | 'Cloud' | 'Automation' | 'Framework' | 'Tools' | 'Soft Skills' | 'Management' | 'Other' | string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string | null;
  yearsOfExperience?: number | null;
  description?: string | null;
}

export interface ProjectData {
  id?: string;
  candidateId?: string;
  name: string;
  description?: string | null;
  role?: string | null;
  technologies: string[];
  achievements: string[];
  url?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CertificationData {
  id?: string;
  candidateId?: string;
  name: string;
  issuer: string;
  issueDate?: string | null;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
}

export interface KnowledgeItemData {
  id?: string;
  candidateId?: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  source?: string | null;
  confidence?: number | null;
}

export interface FullSourceOfTruth {
  profile: CandidateProfileData;
  experiences: ProfessionalExperienceData[];
  educations: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
  certifications: CertificationData[];
  knowledgeItems: KnowledgeItemData[];
}
