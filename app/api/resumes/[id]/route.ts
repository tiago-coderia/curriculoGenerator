import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const resume = await prisma.generatedResume.findUnique({
      where: { id },
      include: {
        job: { include: { analysis: true } },
        candidate: true,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      ...resume,
      contentParsed: JSON.parse(resume.content || '{}'),
      factCheckParsed: JSON.parse(resume.factCheckDetails || '{}'),
      atsFeedbackParsed: JSON.parse(resume.atsFeedback || '{}'),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { content, title } = await req.json();

    const updated = await prisma.generatedResume.update({
      where: { id },
      data: {
        title: title || undefined,
        content: typeof content === 'object' ? JSON.stringify(content) : content,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.generatedResume.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
