import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { Stepper } from '@/components/layout/Stepper';
import { UserCheck, Briefcase, FileText, Award, Plus, Sparkles, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function DashboardPage() {
  const candidate = await prisma.candidateProfile.findFirst({
    include: {
      experiences: true,
      educations: true,
      skills: true,
      projects: true,
      certifications: true,
      knowledgeItems: true,
    },
  });

  const jobsCount = await prisma.job.count();
  const resumesCount = await prisma.generatedResume.count();

  const bestResume = await prisma.generatedResume.findFirst({
    orderBy: { atsScore: 'desc' },
  });

  const recentResumes = await prisma.generatedResume.findMany({
    take: 5,
    include: { job: true },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate profile completeness score
  let completeness = 0;
  if (candidate) {
    if (candidate.name && candidate.email) completeness += 20;
    if (candidate.summary) completeness += 10;
    if (candidate.experiences.length > 0) completeness += 30;
    if (candidate.skills.length > 0) completeness += 20;
    if (candidate.educations.length > 0) completeness += 10;
    if (candidate.projects.length > 0 || candidate.certifications.length > 0) completeness += 10;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Stepper currentStep={1} />

      <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 rounded-2xl text-white shadow-lg border border-slate-700/50">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Workday ATS Reference Engine
            </span>
            <h1 className="text-2xl font-bold mt-2">
              Olá, {candidate?.name || 'Candidato'}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Gere currículos de alto impacto otimizados para ATS com base exclusiva no seu histórico profissional real. Zero inventividade, 100% factualidade.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Importar Conhecimento (IA)</span>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Analisar Nova Vaga</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-100 dark:border-blue-900">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Profile Completeness</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{completeness}%</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Source of Truth ativa</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-100 dark:border-indigo-900">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Vagas Analisadas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{jobsCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Keywords & Gaps extraídos</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-100 dark:border-emerald-900">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Currículos Gerados</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{resumesCount}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Validados contra alucinação</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-100 dark:border-amber-900">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Maior ATS Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {bestResume ? `${bestResume.atsScore}%` : 'N/A'}
              </p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">Workday Parsing Standard</p>
            </div>
          </div>
        </div>

        {/* Source of Truth Overview & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SoT Summary */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Source of Truth</span>
              </h2>
              <Link href="/profile" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                <span>Editar Perfil</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Base de fatos permanentes utilizada para alimentar a geração de todos os seus currículos.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Experiências Profissionais</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {candidate?.experiences.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Competências / Skills</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {candidate?.skills.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Projetos Destacados</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {candidate?.projects.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Formações & Certificações</span>
                <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {(candidate?.educations.length || 0) + (candidate?.certifications.length || 0)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/knowledge"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Adicionar texto livre com IA</span>
              </Link>
            </div>
          </div>

          {/* Recent Resumes Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Currículos Otimizados Recentes</span>
              </h2>
              <Link href="/resumes" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                <span>Ver Todos</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentResumes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Nenhum currículo gerado ainda. <br />
                <Link href="/jobs" className="text-blue-600 underline font-medium mt-2 inline-block">
                  Cadastre uma vaga para gerar seu primeiro currículo ATS!
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentResumes.map((res) => (
                  <div key={res.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {res.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{res.job.company}</span>
                        <span>•</span>
                        <span>{new Date(res.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Fato Auditado
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                          {res.atsScore}% ATS
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/resumes/${res.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                          Ver / Editar
                        </Link>
                        <a
                          href={`/api/resumes/${res.id}/export?format=pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
                          title="Baixar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
