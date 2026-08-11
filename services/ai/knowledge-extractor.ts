import { getAIProvider } from '@/lib/ai/provider';
import { loadPrompt } from '@/lib/ai/prompt-loader';
import { FullSourceOfTruth } from '@/types/candidate';

export interface ExtractedKnowledgeResult {
  skills: { name: string; category: string; level?: string; description?: string }[];
  experience: { company: string; role: string; startDate?: string; endDate?: string; current?: boolean; description?: string; achievements?: string[]; technologies?: string[] }[];
  projects: { name: string; description?: string; role?: string; technologies?: string[]; achievements?: string[] }[];
  educations: { institution: string; degree: string; field?: string }[];
  certifications: { name: string; issuer: string }[];
  knowledgeItems: { category: string; title: string; content: string; tags?: string[] }[];
}

export async function extractKnowledgeFromFreeText(userText: string): Promise<ExtractedKnowledgeResult> {
  const provider = getAIProvider();
  const systemPrompt = loadPrompt('knowledge-extraction.md');

  const prompt = `Analise o texto livre de histórico profissional abaixo e extraia todas as informações factualmentes sustentadas no formato JSON solicitado:

TEXTO FORNECIDO PELO USUÁRIO:
"""
${userText}
"""`;

  try {
    const result = await provider.generateJSON<ExtractedKnowledgeResult>(prompt, { systemPrompt });
    return result;
  } catch (error) {
    console.error('Erro na extração de conhecimento livre:', error);
    throw new Error('Falha ao processar texto com a IA.');
  }
}
