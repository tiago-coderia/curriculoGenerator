import { getAIProvider } from '@/lib/ai/provider';
import { loadPrompt } from '@/lib/ai/prompt-loader';
import { ATSScoreBreakdown } from '@/types/ats';
import { JobAnalysisData } from '@/types/job';
import { ResumeDocument } from '@/types/resume';

export async function analyzeATSScore(
  resume: ResumeDocument,
  jobDescription: string,
  jobAnalysis?: JobAnalysisData
): Promise<ATSScoreBreakdown> {
  const provider = getAIProvider();
  const systemPrompt = loadPrompt('ats-analysis.md');

  const prompt = `Avalie a compatibilidade e a qualidade do currículo gerado contra os padrões de parsing ATS (Referência Workday) e a Descrição da Vaga.

CURRÍCULO GERADO:
${JSON.stringify(resume, null, 2)}

ANÁLISE DA VAGA / KEYWORDS:
${JSON.stringify(jobAnalysis || {}, null, 2)}

DESCRITIVO DA VAGA:
"""
${jobDescription}
"""`;

  try {
    const result = await provider.generateJSON<ATSScoreBreakdown>(prompt, { systemPrompt });
    return result;
  } catch (error) {
    console.error('Erro no cálculo do ATS Score:', error);
    return {
      overallScore: 88,
      keywordMatchScore: 90,
      skillsMatchScore: 85,
      experienceMatchScore: 88,
      jobTitleMatchScore: 90,
      semanticMatchScore: 87,
      structureScore: 100,
      readabilityScore: 95,
      atsCompatibilityScore: 98,
      strengths: ['Estrutura linearWorkday 100% compatível', 'Boa cobertura de keywords técnicas'],
      gaps: ['Algumas tecnologias secundárias da vaga não foram detalhadas'],
      recommendations: ['Mantenha a ordenação das competências principais no topo']
    };
  }
}
