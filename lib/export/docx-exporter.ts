import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat } from 'docx';
import { ResumeDocument } from '@/types/resume';

export async function generateDocxBuffer(resume: ResumeDocument): Promise<Buffer> {
  const children: Paragraph[] = [];

  // Header: Name & Contact Info
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [
        new TextRun({
          text: resume.personalInfo.name.toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: 'Calibri',
        }),
      ],
    })
  );

  if (resume.personalInfo.headline) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: resume.personalInfo.headline,
            italics: true,
            size: 22, // 11pt
            color: '555555',
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // Contact line
  const contacts = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin,
    resume.personalInfo.github,
    resume.personalInfo.portfolio,
  ].filter(Boolean);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: contacts.join('  |  '),
          size: 18, // 9pt
          color: '333333',
          font: 'Calibri',
        }),
      ],
    })
  );

  // Helper for Section Headings
  const addSectionHeading = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            color: '1A365D', // Dark Blue
            font: 'Calibri',
          }),
        ],
      })
    );
  };

  // Professional Summary
  if (resume.professionalSummary) {
    addSectionHeading('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: resume.professionalSummary,
            size: 20, // 10pt
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // Core Skills
  if (resume.skillGroups && resume.skillGroups.length > 0) {
    addSectionHeading('Core Skills');
    for (const group of resume.skillGroups) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `${group.category}: `,
              bold: true,
              size: 20,
              font: 'Calibri',
            }),
            new TextRun({
              text: group.skills.join(', '),
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  // Professional Experience
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeading('Professional Experience');
    for (const exp of resume.experience) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${exp.company}`,
              bold: true,
              color: '4A5568',
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: `  (${exp.dates}${exp.location ? ` | ${exp.location}` : ''})`,
              italics: true,
              size: 18,
              color: '718096',
              font: 'Calibri',
            }),
          ],
        })
      );

      for (const bullet of exp.bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // Selected Projects
  if (resume.projects && resume.projects.length > 0) {
    addSectionHeading('Selected Projects');
    for (const proj of resume.projects) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 20,
              font: 'Calibri',
            }),
            ...(proj.role ? [new TextRun({ text: ` (${proj.role})`, italics: true, size: 20, font: 'Calibri' })] : []),
          ],
        })
      );
      for (const bullet of proj.bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: bullet,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    }
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    addSectionHeading('Education');
    for (const edu of resume.education) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `${edu.degree}${edu.field ? ` em ${edu.field}` : ''}`,
              bold: true,
              size: 20,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${edu.institution} (${edu.dates})`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    addSectionHeading('Certifications');
    for (const cert of resume.certifications) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${cert.name} `,
              bold: true,
              size: 20,
              font: 'Calibri',
            }),
            new TextRun({
              text: `— ${cert.issuer}${cert.date ? ` (${cert.date})` : ''}`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
