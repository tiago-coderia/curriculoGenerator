import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateTargetedResume } from '@/services/ai/resume-generator';
import { validateResumeFacts } from '@/services/ai/fact-checker';
import { analyzeATSScore } from '@/services/ai/ats-analyzer';
import { FullSourceOfTruth } from '@/types/candidate';

export async function GET() {
  try {
    const resumes = await prisma.generatedResume.findMany({
      include: {
        job: { select: { title: true, company: true } },
        candidate: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(resumes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { candidateId, jobId } = await req.json();

    if (!candidateId || !jobId) {
      return NextResponse.json({ error: 'candidateId e jobId são obrigatórios' }, { status: 400 });
    }

    // 1. Fetch Candidate SoT
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

    if (!candidate) {
      return NextResponse.json({ error: 'Candidato não encontrado' }, { status: 404 });
    }

    const sot: FullSourceOfTruth = {
      profile: candidate,
      experiences: candidate.experiences.map(e => ({
        ...e,
        achievements: JSON.parse(e.achievements || '[]'),
        technologies: JSON.parse(e.technologies || '[]'),
      })),
      educations: candidate.educations,
      skills: candidate.skills as any,
      projects: candidate.projects.map(p => ({
        ...p,
        achievements: JSON.parse(p.achievements || '[]'),
        technologies: JSON.parse(p.technologies || '[]'),
      })),
      certifications: candidate.certifications,
      knowledgeItems: candidate.knowledgeItems.map(k => ({
        ...k,
        tags: JSON.parse(k.tags || '[]'),
      })),
    };

    // 2. Fetch Job & JobAnalysis
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { analysis: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
    }

    const jobAnalysisParsed = job.analysis ? {
      ...job.analysis,
      requiredSkills: JSON.parse(job.analysis.requiredSkills || '[]'),
      preferredSkills: JSON.parse(job.analysis.preferredSkills || '[]'),
      keywords: JSON.parse(job.analysis.keywords || '[]'),
      responsibilities: JSON.parse(job.analysis.responsibilities || '[]'),
      technologies: JSON.parse(job.analysis.technologies || '[]'),
      softSkills: JSON.parse(job.analysis.softSkills || '[]'),
      educationRequirements: JSON.parse(job.analysis.educationRequirements || '[]'),
      languageRequirements: JSON.parse(job.analysis.languageRequirements || '[]'),
      atsRecommendations: JSON.parse(job.analysis.atsRecommendations || '[]'),
    } : { requiredSkills: [], preferredSkills: [], keywords: [], responsibilities: [], technologies: [], softSkills: [], educationRequirements: [], languageRequirements: [], atsRecommendations: [], matchScore: 80 };

    // 3. Generate Targeted Resume via AI
    let generatedDoc;
    try {
      generatedDoc = await generateTargetedResume(sot, job.rawDescription, jobAnalysisParsed as any);
    } catch (e) {
      console.warn('Fallback resume generation triggered:', e);
      generatedDoc = {
        personalInfo: {
          name: candidate.name,
          headline: candidate.headline || 'Desenvolvedor de Software',
          email: candidate.email,
          phone: candidate.phone || '',
          location: candidate.location || '',
          linkedin: candidate.linkedin || '',
          github: candidate.github || '',
        },
        professionalSummary: candidate.summary || 'Profissional com sólida experiência em tecnologia e desenvolvimento de software.',
        skillGroups: [
          { category: 'Técnicas', skills: candidate.skills.map(s => s.name) },
        ],
        experience: candidate.experiences.map(e => ({
          company: e.company,
          role: e.role,
          location: e.location || '',
          dates: `${e.startDate} - ${e.endDate || 'Atual'}`,
          bullets: JSON.parse(e.achievements || '[]'),
        })),
        education: candidate.educations.map(ed => ({
          institution: ed.institution,
          degree: ed.degree,
          field: ed.field || '',
          dates: `${ed.startDate} - ${ed.endDate || ''}`,
        })),
        certifications: candidate.certifications.map(c => ({
          name: c.name,
          issuer: c.issuer,
          date: c.issueDate || '',
        })),
      };
    }

    // 4. Run Fact Validation Engine
    const factCheck = await validateResumeFacts(generatedDoc, sot);

    // 5. Run ATS Analyzer Engine
    const atsResult = await analyzeATSScore(generatedDoc, job.rawDescription, jobAnalysisParsed as any);

    // 6. Save Generated Resume in DB
    const title = `${job.title} - ${job.company}`;
    const newResume = await prisma.generatedResume.create({
      data: {
        candidateId,
        jobId,
        title,
        content: JSON.stringify(generatedDoc),
        atsScore: atsResult.overallScore || 90,
        keywordMatchScore: atsResult.keywordMatchScore || 90,
        factCheckStatus: factCheck.passed ? 'Passed' : 'Warnings',
        factCheckDetails: JSON.stringify(factCheck),
        atsFeedback: JSON.stringify(atsResult),
      },
    });

    return NextResponse.json({
      resume: newResume,
      document: generatedDoc,
      factCheck,
      atsResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
