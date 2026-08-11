export interface KeywordInfo {
  term: string;
  category: 'Technology' | 'Framework' | 'Programming Language' | 'Cloud' | 'Database' | 'Methodology' | 'Job Title' | 'Domain' | 'Soft Skill' | 'Certification' | 'Business Term' | 'Action Verb';
  importance: 'High' | 'Medium' | 'Low';
  context?: string;
  required: boolean;
}

export interface JobAnalysisData {
  id?: string;
  jobId?: string;
  title?: string;
  company?: string;
  seniority?: string;
  location?: string;
  workModel?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: KeywordInfo[];
  responsibilities: string[];
  technologies: string[];
  softSkills: string[];
  educationRequirements: string[];
  languageRequirements: string[];
  atsRecommendations: string[];
  matchScore: number;
}

export interface JobMatchComparison {
  matchScore: number;
  strongMatches: {
    term: string;
    category: string;
    sourceOfTruthEvidence: string;
  }[];
  partialMatches: {
    term: string;
    category: string;
    relatedKnowledge: string;
  }[];
  gaps: {
    term: string;
    category: string;
    required: boolean;
    note: string;
  }[];
}
