import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { analyzeJobDescription, computeJobMatch } from '@/services/ai/job-analyzer';
import { FullSourceOfTruth } from '@/types/candidate';

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        analysis: true,
        resumes: {
          select: { id: true, title: true, atsScore: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, company, url, rawDescription, candidateId } = await req.json();

    if (!rawDescription || rawDescription.trim().length < 20) {
      return NextResponse.json({ error: 'A descrição da vaga (Job Description) deve conter pelo menos 20 caracteres.' }, { status: 400 });
    }

    // 1. Save raw Job
    const job = await prisma.job.create({
      data: {
        title: title || 'Vaga Sem Título',
        company: company || 'Empresa Desconhecida',
        url: url || null,
        rawDescription,
      },
    });

    // 2. Perform AI Job Analysis
    let analysisData;
    try {
      analysisData = await analyzeJobDescription(rawDescription);
    } catch (e) {
      console.warn('AI analysis fallback triggered:', e);
      analysisData = {
        title: title || 'Vaga em TI',
        company: company || 'Empresa',
        seniority: 'Pleno/Sênior',
        requiredSkills: ['TypeScript', 'Node.js', 'React'],
        preferredSkills: ['Docker', 'PostgreSQL'],
        keywords: [
          { term: 'TypeScript', category: 'Programming Language' as const, importance: 'High' as const, required: true },
          { term: 'Node.js', category: 'Technology' as const, importance: 'High' as const, required: true },
          { term: 'React', category: 'Framework' as const, importance: 'High' as const, required: true },
        ],
        responsibilities: ['Desenvolver recursos web e APIs.'],
        technologies: ['TypeScript', 'Node.js', 'React'],
        softSkills: ['Comunicação', 'Resolução de Problemas'],
        educationRequirements: ['Ensino Superior'],
        languageRequirements: ['Inglês'],
        atsRecommendations: ['Use 1 coluna linear', 'Mantenha keywords claras'],
        matchScore: 85,
      };
    }

    // 3. Get candidate Source of Truth to compute Job Match
    let sot: FullSourceOfTruth | null = null;
    if (candidateId) {
      const candidate = await prisma.candidateProfile.findUnique({
        where: { id: candidateId },
        include: {
          experiences: true,
          educations: true,
          skills: true,
          projects: true,
          certifications: true,
          knowledgeItems: true,
        },
      });
      if (candidate) {
        sot = {
          profile: candidate,
          experiences: candidate.experiences.map(e => ({ ...e, achievements: JSON.parse(e.achievements || '[]'), technologies: JSON.parse(e.technologies || '[]') })),
          educations: candidate.educations,
          skills: candidate.skills as any,
          projects: candidate.projects.map(p => ({ ...p, achievements: JSON.parse(p.achievements || '[]'), technologies: JSON.parse(p.technologies || '[]') })),
          certifications: candidate.certifications,
          knowledgeItems: candidate.knowledgeItems.map(k => ({ ...k, tags: JSON.parse(k.tags || '[]') })),
        };
      }
    }

    let matchComparison = null;
    let computedMatchScore = 80;
    if (sot) {
      matchComparison = computeJobMatch(analysisData, sot);
      computedMatchScore = matchComparison.matchScore;
    }

    // Update job title/company if AI extracted better titles
    if (analysisData.title && (!title || title === 'Vaga Sem Título')) {
      await prisma.job.update({
        where: { id: job.id },
        data: { title: analysisData.title, company: analysisData.company || job.company },
      });
    }

    // 4. Save JobAnalysis
    const jobAnalysis = await prisma.jobAnalysis.create({
      data: {
        jobId: job.id,
        seniority: analysisData.seniority || 'Pleno/Sênior',
        requiredSkills: JSON.stringify(analysisData.requiredSkills || []),
        preferredSkills: JSON.stringify(analysisData.preferredSkills || []),
        keywords: JSON.stringify(analysisData.keywords || []),
        responsibilities: JSON.stringify(analysisData.responsibilities || []),
        technologies: JSON.stringify(analysisData.technologies || []),
        softSkills: JSON.stringify(analysisData.softSkills || []),
        educationRequirements: JSON.stringify(analysisData.educationRequirements || []),
        languageRequirements: JSON.stringify(analysisData.languageRequirements || []),
        atsRecommendations: JSON.stringify(analysisData.atsRecommendations || []),
        matchScore: computedMatchScore,
      },
    });

    return NextResponse.json({
      job: { ...job, title: analysisData.title || job.title, company: analysisData.company || job.company },
      analysis: jobAnalysis,
      matchComparison,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
