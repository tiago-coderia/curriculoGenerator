import { describe, it, expect } from 'vitest';
import { prisma } from '../lib/db/prisma';

describe('Prisma Database Models Integrity Test', () => {
  it('should create and retrieve a CandidateProfile with relation models', async () => {
    const testCandidate = await prisma.candidateProfile.create({
      data: {
        name: 'Candidato Teste Vitest',
        email: 'vitest.test@example.com',
        headline: 'Software Test Engineer',
        experiences: {
          create: [
            {
              company: 'TestCorp',
              role: 'QA Engineer',
              startDate: '2022-01',
              achievements: JSON.stringify(['Automated 100+ tests']),
            },
          ],
        },
        skills: {
          create: [{ name: 'Vitest', category: 'Technical', level: 'Expert' }],
        },
      },
      include: { experiences: true, skills: true },
    });

    expect(testCandidate.id).toBeDefined();
    expect(testCandidate.name).toBe('Candidato Teste Vitest');
    expect(testCandidate.experiences).toHaveLength(1);
    expect(testCandidate.skills).toHaveLength(1);

    // Clean up test candidate
    await prisma.candidateProfile.delete({ where: { id: testCandidate.id } });
  });
});
