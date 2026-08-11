export interface ATSScoreBreakdown {
  overallScore: number;
  keywordMatchScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  jobTitleMatchScore: number;
  semanticMatchScore: number;
  structureScore: number;
  readabilityScore: number;
  atsCompatibilityScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}
