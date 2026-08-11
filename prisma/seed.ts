import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando populamento do banco de dados (Seed)...');

  // Clear existing data
  await prisma.generatedResume.deleteMany();
  await prisma.jobAnalysis.deleteMany();
  await prisma.job.deleteMany();
  await prisma.knowledgeItem.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.professionalExperience.deleteMany();
  await prisma.candidateProfile.deleteMany();

  // Create Candidate Profile
  const candidate = await prisma.candidateProfile.create({
    data: {
      name: 'Alexandre (Alex) Silva',
      headline: 'Senior Full Stack & AI Automation Engineer',
      email: 'alex.silva.dev@example.com',
      phone: '+55 (11) 98765-4321',
      location: 'São Paulo, SP - Brasil (Remoto)',
      linkedin: 'https://linkedin.com/in/alexsilvadev',
      github: 'https://github.com/alexsilvadev',
      portfolio: 'https://alexsilva.dev',
      summary: 'Engenheiro de Software Sênior com mais de 8 anos de experiência desenvolvendo aplicações web escaláveis, arquiteturas orientadas a eventos e automações inteligentes com IA Generativa, Node.js, React, Python e LLMs.',
    },
  });

  console.log(`Candidato criado: ${candidate.name} (${candidate.id})`);

  // Experiences
  await prisma.professionalExperience.createMany({
    data: [
      {
        candidateId: candidate.id,
        company: 'TechInnovate Solutions',
        role: 'Senior Full Stack & AI Specialist',
        employmentType: 'Full-time',
        location: 'São Paulo, SP (Remoto)',
        startDate: '2022-03',
        endDate: null,
        current: true,
        description: 'Liderança técnica no desenvolvimento de agentes de IA e ecossistema de microserviços em Node.js, Next.js e Python.',
        achievements: JSON.stringify([
          'Arquitetei e implementei sistema de agentes autônomos com LangChain e OpenAI APIs reduzindo tempo operacional em 45%',
          'Liderei a migração de monólito para microsserviços em Node.js e NestJS integrando PostgreSQL e Redis',
          'Implementei pipelines CI/CD automatizados via GitHub Actions e infraestrutura Docker no GCP',
        ]),
        technologies: JSON.stringify(['Node.js', 'TypeScript', 'React', 'Next.js', 'Python', 'LangChain', 'OpenAI API', 'PostgreSQL', 'Docker', 'GCP']),
      },
      {
        candidateId: candidate.id,
        company: 'DataFlow Systems',
        role: 'Full Stack Engineer',
        employmentType: 'Full-time',
        location: 'Campinas, SP',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        description: 'Desenvolvimento de dashboards analíticos e APIs RESTful escaláveis.',
        achievements: JSON.stringify([
          'Desenvolvi dashboards em React com Redux Toolkit consumidos por mais de 50.000 usuários ativos mensais',
          'Otimizei consultas SQL complexas no PostgreSQL aumentando a velocidade de resposta das APIs em 60%',
          'Integrei gateways de pagamento Stripe e Pagar.me garantindo compliance PCI-DSS',
        ]),
        technologies: JSON.stringify(['JavaScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'AWS S3']),
      },
      {
        candidateId: candidate.id,
        company: 'WebSphere Media',
        role: 'Frontend Developer',
        employmentType: 'Full-time',
        location: 'São Paulo, SP',
        startDate: '2017-01',
        endDate: '2019-05',
        current: false,
        description: 'Desenvolvimento de interfaces web responsivas e acessíveis.',
        achievements: JSON.stringify([
          'Construí mais de 20 portais web responsivos com HTML5, CSS3, JavaScript e Vue.js',
          'Implementei boas práticas de SEO e Web Performance atingindo nota 95+ no Google Lighthouse',
        ]),
        technologies: JSON.stringify(['JavaScript', 'Vue.js', 'HTML5', 'CSS3', 'Sass', 'Webpack']),
      },
    ],
  });

  // Skills
  await prisma.skill.createMany({
    data: [
      { candidateId: candidate.id, name: 'TypeScript', category: 'Programming', level: 'Expert', yearsOfExperience: 6 },
      { candidateId: candidate.id, name: 'Node.js', category: 'Backend', level: 'Expert', yearsOfExperience: 7 },
      { candidateId: candidate.id, name: 'React & Next.js', category: 'Frontend', level: 'Expert', yearsOfExperience: 6 },
      { candidateId: candidate.id, name: 'Python', category: 'Programming', level: 'Advanced', yearsOfExperience: 4 },
      { candidateId: candidate.id, name: 'LLM APIs & AI Agents (LangChain, n8n)', category: 'AI', level: 'Advanced', yearsOfExperience: 2 },
      { candidateId: candidate.id, name: 'PostgreSQL & Prisma ORM', category: 'Database', level: 'Expert', yearsOfExperience: 6 },
      { candidateId: candidate.id, name: 'Docker & GCP', category: 'Cloud', level: 'Intermediate', yearsOfExperience: 3 },
      { candidateId: candidate.id, name: 'Tailwind CSS', category: 'Framework', level: 'Expert', yearsOfExperience: 4 },
      { candidateId: candidate.id, name: 'Liderança Técnica & Code Review', category: 'Soft Skills', level: 'Advanced', yearsOfExperience: 3 },
    ],
  });

  // Educations
  await prisma.education.createMany({
    data: [
      {
        candidateId: candidate.id,
        institution: 'Universidade de São Paulo (USP)',
        degree: 'Bacharelado',
        field: 'Sistemas de Informação',
        startDate: '2013-02',
        endDate: '2017-12',
        description: 'Foco em Engenharia de Software, Bancos de Dados e Algoritmos.',
      },
    ],
  });

  // Projects
  await prisma.project.createMany({
    data: [
      {
        candidateId: candidate.id,
        name: 'AutoResume ATS Engine',
        role: 'Criador & Desenvolvedor Principal',
        description: 'Plataforma local-first de otimização de currículos para ATS com validação factual anti-alucinação.',
        technologies: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS', 'OpenAI API']),
        achievements: JSON.stringify([
          'Desenvolvi motor determinístico de Job Match e parsing de palavras-chave',
          'Implementei exportadores nativos de PDF e DOCX com formatação Workday-friendly',
        ]),
        url: 'https://github.com/alexsilvadev/autoresume-ats',
        startDate: '2024-01',
        endDate: '2024-03',
      },
    ],
  });

  // Certifications
  await prisma.certification.createMany({
    data: [
      {
        candidateId: candidate.id,
        name: 'AWS Certified Developer – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-05',
        expirationDate: '2026-05',
        credentialId: 'AWS-DEV-998877',
      },
      {
        candidateId: candidate.id,
        name: 'Deep Learning & LLM Architecture',
        issuer: 'DeepLearning.AI',
        issueDate: '2023-11',
      },
    ],
  });

  // KnowledgeItems
  await prisma.knowledgeItem.createMany({
    data: [
      {
        candidateId: candidate.id,
        category: 'Arquitetura',
        title: 'Padrão de Validação Factual Anti-Alucinação',
        content: 'Domínio de técnicas de grounding e verificação de afirmações contra bases de conhecimento estruturadas para garantir 100% de precisão em respostas da IA.',
        tags: JSON.stringify(['AI', 'LLM', 'Grounding', 'Fact Check']),
        source: 'Manual',
      },
      {
        candidateId: candidate.id,
        category: 'Metodologia',
        title: 'Metodologias Ágeis e Scrum',
        content: 'Experiência como Scrum Master informal e facilitador de Code Reviews diários.',
        tags: JSON.stringify(['Agile', 'Scrum', 'Management']),
        source: 'Manual',
      },
    ],
  });

  // Sample Job
  const job = await prisma.job.create({
    data: {
      title: 'Senior AI Full Stack Engineer',
      company: 'Global AI Solutions',
      source: 'LinkedIn',
      url: 'https://linkedin.com/jobs/view/123456789',
      rawDescription: `
We are looking for a Senior AI Full Stack Engineer to build next-generation enterprise products.

Requirements:
- 5+ years of experience with Node.js, TypeScript, and React / Next.js.
- Strong hands-on experience with LLM integration, OpenAI API, LangChain, or AI agents.
- Proficient with PostgreSQL, Prisma, Redis, and RESTful API design.
- Experience with Docker, cloud providers (GCP or AWS), and CI/CD pipelines.
- Knowledge of ATS optimization systems or Workday parsing is a plus.
- Bachelor's Degree in Computer Science or related field.

Responsibilities:
- Architect and develop high-performance web applications and AI workflows.
- Lead technical design and conduct thorough code reviews.
- Work closely with product managers to ship scalable features.
      `,
    },
  });

  // Sample Job Analysis
  await prisma.jobAnalysis.create({
    data: {
      jobId: job.id,
      seniority: 'Senior',
      requiredSkills: JSON.stringify(['Node.js', 'TypeScript', 'React', 'Next.js', 'LLM', 'PostgreSQL']),
      preferredSkills: JSON.stringify(['LangChain', 'Docker', 'GCP', 'AWS', 'Prisma', 'Redis']),
      keywords: JSON.stringify([
        { term: 'TypeScript', category: 'Programming Language', importance: 'High', required: true },
        { term: 'Node.js', category: 'Technology', importance: 'High', required: true },
        { term: 'React / Next.js', category: 'Framework', importance: 'High', required: true },
        { term: 'LLM & AI Agents', category: 'Technology', importance: 'High', required: true },
        { term: 'PostgreSQL', category: 'Database', importance: 'High', required: true },
        { term: 'Docker & Cloud', category: 'Cloud', importance: 'Medium', required: false },
      ]),
      responsibilities: JSON.stringify([
        'Architect and develop high-performance web applications and AI workflows',
        'Lead technical design and conduct thorough code reviews',
        'Work closely with product managers to ship scalable features',
      ]),
      technologies: JSON.stringify(['Node.js', 'TypeScript', 'React', 'Next.js', 'OpenAI API', 'LangChain', 'PostgreSQL', 'Prisma', 'Docker', 'AWS', 'GCP']),
      softSkills: JSON.stringify(['Technical Leadership', 'Code Review', 'Product Collaboration']),
      educationRequirements: JSON.stringify(["Bachelor's Degree in Computer Science or related field"]),
      languageRequirements: JSON.stringify(['English Professional']),
      atsRecommendations: JSON.stringify([
        'Use standard section titles: PROFESSIONAL SUMMARY, CORE SKILLS, PROFESSIONAL EXPERIENCE',
        'Highlight LLM and Node.js accomplishments in bullet points',
      ]),
      matchScore: 92,
    },
  });

  // Sample Generated Resume
  const sampleResumeDoc = {
    personalInfo: {
      name: 'Alexandre Silva',
      headline: 'Senior AI Full Stack Engineer',
      email: 'alex.silva.dev@example.com',
      phone: '+55 (11) 98765-4321',
      location: 'São Paulo, SP - Brasil',
      linkedin: 'https://linkedin.com/in/alexsilvadev',
      github: 'https://github.com/alexsilvadev',
    },
    professionalSummary: 'Senior Full Stack & AI Engineer with 8+ years of experience architecting scalable Node.js, Next.js, and TypeScript applications. Specialized in embedding LLM APIs, LangChain, and AI agents into enterprise workflows, improving operational efficiency by 45%. Proficient in PostgreSQL, Docker, and GCP cloud infrastructure.',
    skillGroups: [
      { category: 'AI & Automation', skills: ['LLM APIs', 'LangChain', 'n8n', 'AI Agents', 'OpenAI API'] },
      { category: 'Programming & Web', skills: ['TypeScript', 'Node.js', 'React', 'Next.js', 'Python', 'Tailwind CSS'] },
      { category: 'Database & Infrastructure', skills: ['PostgreSQL', 'Prisma ORM', 'Redis', 'Docker', 'GCP', 'AWS'] },
      { category: 'Leadership', skills: ['Technical Architecture', 'Code Review', 'Agile / Scrum'] },
    ],
    experience: [
      {
        company: 'TechInnovate Solutions',
        role: 'Senior Full Stack & AI Specialist',
        location: 'São Paulo, SP (Remote)',
        dates: '2022 - Present',
        bullets: [
          'Architected and deployed autonomous AI agent workflows using LangChain and OpenAI APIs, decreasing manual operational tasks by 45%.',
          'Engineered microservices architecture in Node.js and NestJS backed by PostgreSQL and Redis for high-concurrency systems.',
          'Established automated CI/CD pipelines via GitHub Actions and Docker containerization on Google Cloud Platform (GCP).',
        ],
      },
      {
        company: 'DataFlow Systems',
        role: 'Full Stack Engineer',
        location: 'Campinas, SP',
        dates: '2019 - 2022',
        bullets: [
          'Developed analytics dashboards using React and Redux supporting 50,000+ active monthly users.',
          'Optimized complex PostgreSQL queries and database schemas, improving API response times by 60%.',
        ],
      },
    ],
    projects: [
      {
        name: 'AutoResume ATS Engine',
        role: 'Lead Developer',
        url: 'https://github.com/alexsilvadev/autoresume-ats',
        bullets: [
          'Designed a local-first ATS optimization engine with factual verification against candidate Source of Truth.',
          'Implemented native PDF and DOCX document generators matching Workday parsing requirements.',
        ],
      },
    ],
    education: [
      {
        institution: 'Universidade de São Paulo (USP)',
        degree: 'Bachelor of Science',
        field: 'Information Systems',
        dates: '2013 - 2017',
      },
    ],
    certifications: [
      { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2023' },
      { name: 'Deep Learning & LLM Architecture', issuer: 'DeepLearning.AI', date: '2023' },
    ],
  };

  await prisma.generatedResume.create({
    data: {
      candidateId: candidate.id,
      jobId: job.id,
      title: 'Senior AI Full Stack Engineer - Global AI Solutions',
      content: JSON.stringify(sampleResumeDoc),
      atsScore: 94,
      keywordMatchScore: 95,
      factCheckStatus: 'Passed',
      factCheckDetails: JSON.stringify({ passed: true, score: 100, unsupportedClaims: [] }),
      atsFeedback: JSON.stringify({
        strengths: ['100% Workday single-column structure', 'Excellent LLM and TypeScript keyword coverage'],
        gaps: ['AWS experience is secondary to GCP in recent roles'],
        recommendations: ['Emphasize Next.js in summary section'],
      }),
    },
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
