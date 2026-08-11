import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    let candidate = await prisma.candidateProfile.findFirst({
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        educations: { orderBy: { startDate: 'desc' } },
        skills: { orderBy: { category: 'asc' } },
        projects: { orderBy: { startDate: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } },
        knowledgeItems: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!candidate) {
      candidate = await prisma.candidateProfile.create({
        data: {
          name: 'Seu Nome',
          email: 'seu.email@exemplo.com',
          headline: 'Desenvolvedor de Software',
        },
        include: {
          experiences: true,
          educations: true,
          skills: true,
          projects: true,
          certifications: true,
          knowledgeItems: true,
        },
      });
    }

    return NextResponse.json(candidate);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, data, candidateId } = body;

    if (!candidateId) {
      return NextResponse.json({ error: 'candidateId é obrigatório' }, { status: 400 });
    }

    if (section === 'profile') {
      const updated = await prisma.candidateProfile.update({
        where: { id: candidateId },
        data: {
          name: data.name,
          headline: data.headline,
          email: data.email,
          phone: data.phone,
          location: data.location,
          linkedin: data.linkedin,
          github: data.github,
          portfolio: data.portfolio,
          summary: data.summary,
        },
      });
      return NextResponse.json(updated);
    }

    if (section === 'experience') {
      const exp = await prisma.professionalExperience.create({
        data: {
          candidateId,
          company: data.company,
          role: data.role,
          employmentType: data.employmentType,
          location: data.location,
          startDate: data.startDate,
          endDate: data.endDate || null,
          current: !!data.current,
          description: data.description,
          achievements: JSON.stringify(data.achievements || []),
          technologies: JSON.stringify(data.technologies || []),
        },
      });
      return NextResponse.json(exp);
    }

    if (section === 'skill') {
      const skill = await prisma.skill.create({
        data: {
          candidateId,
          name: data.name,
          category: data.category || 'Technical',
          level: data.level || 'Intermediate',
          yearsOfExperience: Number(data.yearsOfExperience) || 1,
          description: data.description,
        },
      });
      return NextResponse.json(skill);
    }

    if (section === 'education') {
      const edu = await prisma.education.create({
        data: {
          candidateId,
          institution: data.institution,
          degree: data.degree,
          field: data.field,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
        },
      });
      return NextResponse.json(edu);
    }

    if (section === 'project') {
      const proj = await prisma.project.create({
        data: {
          candidateId,
          name: data.name,
          description: data.description,
          role: data.role,
          technologies: JSON.stringify(data.technologies || []),
          achievements: JSON.stringify(data.achievements || []),
          url: data.url,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      });
      return NextResponse.json(proj);
    }

    if (section === 'certification') {
      const cert = await prisma.certification.create({
        data: {
          candidateId,
          name: data.name,
          issuer: data.issuer,
          issueDate: data.issueDate,
          expirationDate: data.expirationDate,
          credentialId: data.credentialId,
          credentialUrl: data.credentialUrl,
        },
      });
      return NextResponse.json(cert);
    }

    if (section === 'knowledgeItem') {
      const item = await prisma.knowledgeItem.create({
        data: {
          candidateId,
          category: data.category || 'Conhecimento',
          title: data.title,
          content: data.content,
          tags: JSON.stringify(data.tags || []),
          source: 'Manual',
        },
      });
      return NextResponse.json(item);
    }

    return NextResponse.json({ error: 'Seção não suportada' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { section, data } = body;

    if (!data?.id) {
      return NextResponse.json({ error: 'id do item é obrigatório para atualização' }, { status: 400 });
    }

    if (section === 'experience') {
      const updated = await prisma.professionalExperience.update({
        where: { id: data.id },
        data: {
          company: data.company,
          role: data.role,
          employmentType: data.employmentType,
          location: data.location,
          startDate: data.startDate,
          endDate: data.endDate || null,
          current: !!data.current,
          description: data.description,
          achievements: JSON.stringify(data.achievements || []),
          technologies: JSON.stringify(data.technologies || []),
        },
      });
      return NextResponse.json(updated);
    }

    if (section === 'skill') {
      const updated = await prisma.skill.update({
        where: { id: data.id },
        data: {
          name: data.name,
          category: data.category,
          level: data.level,
          yearsOfExperience: Number(data.yearsOfExperience) || 1,
          description: data.description,
        },
      });
      return NextResponse.json(updated);
    }

    if (section === 'education') {
      const updated = await prisma.education.update({
        where: { id: data.id },
        data: {
          institution: data.institution,
          degree: data.degree,
          field: data.field,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
        },
      });
      return NextResponse.json(updated);
    }

    if (section === 'project') {
      const updated = await prisma.project.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          role: data.role,
          technologies: JSON.stringify(data.technologies || []),
          achievements: JSON.stringify(data.achievements || []),
          url: data.url,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      });
      return NextResponse.json(updated);
    }

    if (section === 'certification') {
      const updated = await prisma.certification.update({
        where: { id: data.id },
        data: {
          name: data.name,
          issuer: data.issuer,
          issueDate: data.issueDate,
          expirationDate: data.expirationDate,
          credentialId: data.credentialId,
          credentialUrl: data.credentialUrl,
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Seção inválida para edição' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const id = searchParams.get('id');

    if (!section || !id) {
      return NextResponse.json({ error: 'section e id são obrigatórios para exclusão' }, { status: 400 });
    }

    if (section === 'experience') {
      await prisma.professionalExperience.delete({ where: { id } });
    } else if (section === 'skill') {
      await prisma.skill.delete({ where: { id } });
    } else if (section === 'education') {
      await prisma.education.delete({ where: { id } });
    } else if (section === 'project') {
      await prisma.project.delete({ where: { id } });
    } else if (section === 'certification') {
      await prisma.certification.delete({ where: { id } });
    } else if (section === 'knowledgeItem') {
      await prisma.knowledgeItem.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: 'Seção inválida' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Item excluído da Source of Truth.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
