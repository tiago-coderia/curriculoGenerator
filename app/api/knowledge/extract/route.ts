import { NextResponse } from 'next/server';
import { extractKnowledgeFromFreeText } from '@/services/ai/knowledge-extractor';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const { text, candidateId, saveConfirmed } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto para análise é obrigatório' }, { status: 400 });
    }

    // Step 1: Extract structure from free text using AI Provider
    const extracted = await extractKnowledgeFromFreeText(text);

    // If user clicked "Confirmar Informações" (saveConfirmed = true)
    if (saveConfirmed && candidateId) {
      // Batch save extracted items into candidate's SoT
      for (const skill of extracted.skills || []) {
        await prisma.skill.create({
          data: {
            candidateId,
            name: skill.name,
            category: skill.category || 'Technical',
            level: skill.level || 'Intermediate',
            description: skill.description,
          },
        });
      }

      for (const exp of extracted.experience || []) {
        await prisma.professionalExperience.create({
          data: {
            candidateId,
            company: exp.company,
            role: exp.role,
            startDate: exp.startDate || '2020-01',
            endDate: exp.endDate || null,
            current: !!exp.current,
            description: exp.description,
            achievements: JSON.stringify(exp.achievements || []),
            technologies: JSON.stringify(exp.technologies || []),
          },
        });
      }

      for (const ki of extracted.knowledgeItems || []) {
        await prisma.knowledgeItem.create({
          data: {
            candidateId,
            category: ki.category || 'Conhecimento',
            title: ki.title,
            content: ki.content,
            tags: JSON.stringify(ki.tags || []),
            source: 'AI Extractor',
          },
        });
      }

      return NextResponse.json({ success: true, message: 'Informações salvas com sucesso na Source of Truth!' });
    }

    // Return extracted items for user review and confirmation UI
    return NextResponse.json({ extracted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
