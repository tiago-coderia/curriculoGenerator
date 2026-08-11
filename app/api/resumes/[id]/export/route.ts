import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generatePdfBuffer } from '@/lib/export/pdf-exporter';
import { generateDocxBuffer } from '@/lib/export/docx-exporter';
import { ResumeDocument } from '@/types/resume';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'pdf';

    const resume = await prisma.generatedResume.findUnique({
      where: { id },
      include: { candidate: true },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
    }

    const documentContent: ResumeDocument = JSON.parse(resume.content);
    const candidateNameClean = (resume.candidate?.name || 'Curriculo').replace(/[^a-zA-Z0-9]/g, '_');

    if (format === 'docx') {
      const docxBuffer = await generateDocxBuffer(documentContent);
      return new NextResponse(new Uint8Array(docxBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${candidateNameClean}_Resume_ATS.docx"`,
        },
      });
    }

    // Default: PDF
    const pdfBuffer = await generatePdfBuffer(documentContent);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${candidateNameClean}_Resume_ATS.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Erro na exportação de documento:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
