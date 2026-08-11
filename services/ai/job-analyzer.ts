import { getAIProvider } from '@/lib/ai/provider';
import { loadPrompt } from '@/lib/ai/prompt-loader';
import { JobAnalysisData, JobMatchComparison, KeywordInfo } from '@/types/job';
import { FullSourceOfTruth } from '@/types/candidate';

export async function analyzeJobDescription(rawDescription: string): Promise<JobAnalysisData> {
  const provider = getAIProvider();
  const systemPrompt = loadPrompt('job-analysis.md');

  const prompt = `Analise detalhadamente a seguinte Descrição de Vaga (Job Description) e extraia todos os elementos estruturados:

JOB DESCRIPTION:
"""
${rawDescription}
"""`;

  const result = await provider.generateJSON<JobAnalysisData>(prompt, { systemPrompt });
  return result;
}

export function computeJobMatch(analysis: JobAnalysisData, sot: FullSourceOfTruth): JobMatchComparison {
  const sotSkills = sot.skills.map(s => s.name.toLowerCase());
  const sotTechnologies = [
    ...sot.skills.map(s => s.name.toLowerCase()),
    ...sot.experiences.flatMap(e => (e.technologies || []).map(t => t.toLowerCase())),
    ...sot.projects.flatMap(p => (p.technologies || []).map(t => t.toLowerCase())),
  ];
  const sotTitles = sot.experiences.map(e => e.role.toLowerCase());
  const sotText = JSON.stringify(sot).toLowerCase();

  const strongMatches: JobMatchComparison['strongMatches'] = [];
  const partialMatches: JobMatchComparison['partialMatches'] = [];
  const gaps: JobMatchComparison['gaps'] = [];

  // Evaluate keywords
  const keywordsToEvaluate = analysis.keywords.length > 0
    ? analysis.keywords
    : (analysis.requiredSkills || []).map(s => ({ term: s, category: 'Technology' as const, importance: 'High' as const, required: true }));

  for (const kw of keywordsToEvaluate) {
    const termLower = kw.term.toLowerCase();
    
    // Check direct strong match
    const hasExactSkill = sotSkills.some(s => s === termLower || s.includes(termLower) || termLower.includes(s));
    const hasExactTech = sotTechnologies.some(t => t === termLower || t.includes(termLower) || termLower.includes(t));
    const hasExactTitle = kw.category === 'Job Title' && sotTitles.some(t => t.includes(termLower) || termLower.includes(t));

    if (hasExactSkill || hasExactTech || hasExactTitle) {
      strongMatches.push({
        term: kw.term,
        category: kw.category,
        sourceOfTruthEvidence: `Confirmado no perfil (${hasExactSkill ? 'Skill' : hasExactTech ? 'Tecnologia' : 'Cargo'})`
      });
    } else if (sotText.includes(termLower)) {
      partialMatches.push({
        term: kw.term,
        category: kw.category,
        relatedKnowledge: `Mencionado no histórico profissional ou projetos`
      });
    } else {
      gaps.push({
        term: kw.term,
        category: kw.category,
        required: kw.required ?? (kw.importance === 'High'),
        note: `Não encontrado na Source of Truth`
      });
    }
  }

  // Calculate Match Score
  const totalKeywords = keywordsToEvaluate.length || 1;
  const strongWeight = 1.0;
  const partialWeight = 0.5;
  const score = Math.round(
    ((strongMatches.length * strongWeight + partialMatches.length * partialWeight) / totalKeywords) * 100
  );

  const boundedScore = Math.min(100, Math.max(0, score));

  return {
    matchScore: boundedScore,
    strongMatches,
    partialMatches,
    gaps
  };
}
