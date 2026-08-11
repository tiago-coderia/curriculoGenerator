import { describe, it, expect } from 'vitest';
import { computeJobMatch } from '../services/ai/job-analyzer';
import { JobAnalysisData } from '../types/job';
import { FullSourceOfTruth } from '../types/candidate';

describe('Job Match & Keyword Analysis Engine', () => {
  it('should compute high match score when skills match Source of Truth', () => {
    const mockAnalysis: JobAnalysisData = {
      requiredSkills: ['Node.js', 'TypeScript', 'React'],
      preferredSkills: ['PostgreSQL'],
      keywords: [
        { term: 'Node.js', category: 'Technology', importance: 'High', required: true },
        { term: 'TypeScript', category: 'Programming Language', importance: 'High', required: true },
        { term: 'React', category: 'Framework', importance: 'High', required: true },
      ],
      responsibilities: [],
      technologies: [],
      softSkills: [],
      educationRequirements: [],
      languageRequirements: [],
      atsRecommendations: [],
      matchScore: 0,
    };

    const mockSoT: FullSourceOfTruth = {
      profile: { name: 'Alex Silva', email: 'alex@example.com' },
      experiences: [
        { company: 'TechCorp', role: 'Full Stack Engineer', startDate: '2020', current: true, achievements: [], technologies: ['Node.js', 'TypeScript', 'React'] },
      ],
      educations: [],
      skills: [
        { name: 'Node.js', category: 'Technical' },
        { name: 'TypeScript', category: 'Programming' },
        { name: 'React', category: 'Framework' },
      ],
      projects: [],
      certifications: [],
      knowledgeItems: [],
    };

    const result = computeJobMatch(mockAnalysis, mockSoT);
    expect(result.matchScore).toBeGreaterThanOrEqual(90);
    expect(result.strongMatches.length).toBe(3);
    expect(result.gaps.length).toBe(0);
  });

  it('should detect gaps when required skills are missing in Source of Truth', () => {
    const mockAnalysis: JobAnalysisData = {
      requiredSkills: ['Kubernetes', 'AWS'],
      preferredSkills: [],
      keywords: [
        { term: 'Kubernetes', category: 'Cloud', importance: 'High', required: true },
        { term: 'AWS', category: 'Cloud', importance: 'High', required: true },
      ],
      responsibilities: [],
      technologies: [],
      softSkills: [],
      educationRequirements: [],
      languageRequirements: [],
      atsRecommendations: [],
      matchScore: 0,
    };

    const mockSoT: FullSourceOfTruth = {
      profile: { name: 'Alex Silva', email: 'alex@example.com' },
      experiences: [],
      educations: [],
      skills: [{ name: 'React', category: 'Frontend' }],
      projects: [],
      certifications: [],
      knowledgeItems: [],
    };

    const result = computeJobMatch(mockAnalysis, mockSoT);
    expect(result.gaps.length).toBe(2);
    expect(result.matchScore).toBeLessThan(50);
  });
});
