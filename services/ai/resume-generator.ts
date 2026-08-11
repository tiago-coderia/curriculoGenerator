import { getAIProvider } from '@/lib/ai/provider';
import { loadPrompt } from '@/lib/ai/prompt-loader';
import { FullSourceOfTruth } from '@/types/candidate';
import { JobAnalysisData } from '@/types/job';
import { ResumeDocument } from '@/types/resume';

export async function generateTargetedResume(
  sot: FullSourceOfTruth,
  jobDescription: string,
  jobAnalysis: JobAnalysisData
): Promise<ResumeDocument> {
  const provider = getAIProvider();
  const systemPrompt = loadPrompt('resume-generation.md');

  const prompt = `Gere um currículo estritamente alinhado à vaga abaixo, utilizando EXCLUSIVAMENTE informações sustentadas pela Source of Truth do candidato.

SOURCE OF TRUTH DO CANDIDATO:
${JSON.stringify(sot, null, 2)}

ANÁLISE DA VAGA E KEYWORDS DESEJADAS:
${JSON.stringify(jobAnalysis, null, 2)}

DESCRITIVO COMPLETO DA VAGA:
"""
${jobDescription}
"""

Instruções finais:
1. NUNCA invente métricas, tecnologias, empresas ou habilidades que não constem na Source of Truth.
2. Formate o resumo profissional em 3 a 5 linhas conectando as competências reais aos requisitos da vaga.
3. Organize as skills por categorias relevantes (AI & Automation, Programming, Database, Cloud, Soft Skills, etc).
4. Escreva os bullet points de experiência no formato: Ação + Tarefa/Escopo + Tecnologia/Método + Resultado real sustentado.
5. Retorne a resposta estritamente como JSON válido no modelo ResumeDocument.`;

  const result = await provider.generateJSON<ResumeDocument>(prompt, { systemPrompt });
  return result;
}
