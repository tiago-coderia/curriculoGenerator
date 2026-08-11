export interface CandidateProfileData {
  id?: string;
  name: string;
  headline?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
}

export interface ProfessionalExperienceData {
  id?: string;
  candidateId?: string;
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  achievements: string[]; // Parsed array
  technologies: string[]; // Parsed array
}

export interface EducationData {
  id?: string;
  candidateId?: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface SkillData {
  id?: string;
  candidateId?: string;
  name: string;
  category: 'Technical' | 'AI' | 'Programming' | 'Database' | 'Cloud' | 'Automation' | 'Framework' | 'Tools' | 'Soft Skills' | 'Management' | 'Other';
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  description?: string;
}

export interface ProjectData {
  id?: string;
  candidateId?: string;
  name: string;
  description?: string;
  role?: string;
  technologies: string[];
  achievements: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface CertificationData {
  id?: string;
  candidateId?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface KnowledgeItemData {
  id?: string;
  candidateId?: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  source?: string;
  confidence?: number;
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
