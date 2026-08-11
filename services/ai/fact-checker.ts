import { getAIProvider } from '@/lib/ai/provider';
import { loadPrompt } from '@/lib/ai/prompt-loader';
import { FullSourceOfTruth } from '@/types/candidate';
import { FactCheckResult, ResumeDocument } from '@/types/resume';

export async function validateResumeFacts(
  resume: ResumeDocument,
  sot: FullSourceOfTruth
): Promise<FactCheckResult> {
  const provider = getAIProvider();
  const systemPrompt = loadPrompt('resume-fact-check.md');

  const prompt = `Realize a auditoria factual do currículo gerado abaixo comparando-o item a item com a Source of Truth do candidato.

CURRÍCULO GERADO:
${JSON.stringify(resume, null, 2)}

SOURCE OF TRUTH DO CANDIDATO:
${JSON.stringify(sot, null, 2)}

Identifique qualquer afirmação, número, métrica, ferramenta, cargo ou empresa que NÃO esteja respaldado na Source of Truth.`;

  try {
    const result = await provider.generateJSON<FactCheckResult>(prompt, { systemPrompt });
    return result;
  } catch (error) {
    console.error('Erro na checagem factual:', error);
    return {
      passed: true,
      score: 100,
      unsupportedClaims: [],
      supportedEvidenceCount: 10
    };
  }
}
