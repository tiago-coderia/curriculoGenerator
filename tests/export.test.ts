import { describe, it, expect } from 'vitest';
import { generateDocxBuffer } from '../lib/export/docx-exporter';
import { generatePdfBuffer } from '../lib/export/pdf-exporter';
import { ResumeDocument } from '../types/resume';

const sampleResumeDoc: ResumeDocument = {
  personalInfo: {
    name: 'Alexandre Silva',
    headline: 'Senior Full Stack & AI Specialist',
    email: 'alex.silva@example.com',
    phone: '+55 11 99999-9999',
    location: 'São Paulo, SP',
  },
  professionalSummary: 'Engenheiro de Software Sênior com 8 anos de experiência em Node.js, TypeScript e React.',
  skillGroups: [
    { category: 'AI & Automation', skills: ['LLM APIs', 'LangChain', 'n8n'] },
    { category: 'Web Development', skills: ['TypeScript', 'Node.js', 'React', 'Next.js'] },
  ],
  experience: [
    {
      company: 'TechInnovate',
      role: 'Senior Engineer',
      dates: '2022 - Atual',
      bullets: ['Desenvolvi agentes de IA com LangChain reduzindo tarefas operacionais em 45%.'],
    },
  ],
  education: [
    {
      institution: 'USP',
      degree: 'Bacharelado',
      field: 'Sistemas de Informação',
      dates: '2013 - 2017',
    },
  ],
};

describe('Document Export Buffers', () => {
  it('should generate valid non-empty DOCX buffer', async () => {
    const docxBuf = await generateDocxBuffer(sampleResumeDoc);
    expect(docxBuf).toBeDefined();
    expect(docxBuf.length).toBeGreaterThan(1000);
  });

  it('should generate valid non-empty PDF buffer', async () => {
    const pdfBuf = await generatePdfBuffer(sampleResumeDoc);
    expect(pdfBuf).toBeDefined();
    expect(pdfBuf.length).toBeGreaterThan(500);
  });
});
