'use client';

import { useState, useEffect } from 'react';
import { Stepper } from '@/components/layout/Stepper';
import { Briefcase, Plus, Sparkles, CheckCircle2, AlertTriangle, XCircle, ArrowRight, FileText, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [candidate, setCandidate] = useState<any>(null);

  // New Job Form State
  const [form, setForm] = useState({
    title: '',
    company: '',
    url: '',
    rawDescription: '',
  });

  const [selectedJobResult, setSelectedJobResult] = useState<any>(null);

  const fetchJobsAndProfile = async () => {
    setLoading(true);
    try {
      const [jRes, pRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/profile'),
      ]);
      const jData = await jRes.json();
      const pData = await pRes.json();
      setJobs(jData);
      setCandidate(pData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndProfile();
  }, []);

  const handleAnalyzeJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rawDescription.trim() || !candidate?.id) return;
    setAnalyzing(true);
    setSelectedJobResult(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, candidateId: candidate.id }),
      });
      const data = await res.json();
      if (data.job) {
        setSelectedJobResult(data);
        fetchJobsAndProfile();
      }
    } catch (err) {
      alert('Erro ao analisar vaga.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateResumeForJob = async (jobId: string) => {
    if (!candidate?.id) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate.id, jobId }),
      });
      const data = await res.json();
      if (data.resume?.id) {
        router.push(`/resumes/${data.resume.id}`);
      }
    } catch (e) {
      alert('Erro ao gerar currículo.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Stepper currentStep={selectedJobResult ? 3 : 2} />

      <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Fase 2 — Job Description & Matching
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" /> Vagas & Análise de Palavras-Chave ATS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Insira o descritivo de uma vaga para extrair palavras-chave, requisitos e calcular a aderência (Job Match) com a sua Source of Truth.
          </p>
        </div>

        {/* New Job Form */}
        <form onSubmit={handleAnalyzeJob} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" /> Analisar Nova Vaga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Título do Cargo</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Senior AI Full Stack Engineer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Empresa</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Ex: Google / Microsoft"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">URL da Vaga (Opcional)</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descrição Completa da Vaga (Raw Description):
            </label>
            <textarea
              rows={6}
              value={form.rawDescription}
              onChange={(e) => setForm({ ...form, rawDescription: e.target.value })}
              placeholder="Cole o texto original da vaga fornecido no LinkedIn, Workday ou site da empresa..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando Vaga & Calculando Job Match...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Executar Análise ATS & Job Match</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Selected / Newly Analyzed Job Results & Match Score Panel */}
        {selectedJobResult && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-xl space-y-6 animate-fadeIn">
            {/* Match Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                  Resultado da Análise & Job Match
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedJobResult.job.title} — <span className="text-blue-600">{selectedJobResult.job.company}</span>
                </h2>
              </div>

              {/* Job Match Score Badge */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Job Match Score</p>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedJobResult.matchComparison?.matchScore || selectedJobResult.analysis?.matchScore || 85}%
                  </p>
                </div>
                <button
                  onClick={() => handleGenerateResumeForJob(selectedJobResult.job.id)}
                  disabled={analyzing}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>[Generate Targeted Resume]</span>
                </button>
              </div>
            </div>

            {/* Match Details: Strong Matches, Partial Matches, Gaps */}
            {selectedJobResult.matchComparison && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Strong Matches */}
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strong Matches
                    </h3>
                    <span className="text-xs font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedJobResult.matchComparison.strongMatches.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {selectedJobResult.matchComparison.strongMatches.map((m: any, i: number) => (
                      <div key={i} className="text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900">
                        <p className="font-bold text-emerald-900 dark:text-emerald-200">{m.term}</p>
                        <p className="text-[10px] text-slate-500">{m.sourceOfTruthEvidence}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partial Matches */}
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Partial Matches
                    </h3>
                    <span className="text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
                      {selectedJobResult.matchComparison.partialMatches.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {selectedJobResult.matchComparison.partialMatches.map((m: any, i: number) => (
                      <div key={i} className="text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-amber-100 dark:border-amber-900">
                        <p className="font-bold text-amber-900 dark:text-amber-200">{m.term}</p>
                        <p className="text-[10px] text-slate-500">{m.relatedKnowledge}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills / Gaps */}
                <div className="bg-rose-50/60 dark:bg-rose-950/30 p-4 rounded-xl border border-rose-200 dark:border-rose-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" /> Gaps na Source of Truth
                    </h3>
                    <span className="text-xs font-bold bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100 px-2 py-0.5 rounded-full">
                      {selectedJobResult.matchComparison.gaps.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {selectedJobResult.matchComparison.gaps.length === 0 ? (
                      <p className="text-xs text-emerald-600 font-medium p-2">Nenhum gap detectado!</p>
                    ) : (
                      selectedJobResult.matchComparison.gaps.map((g: any, i: number) => (
                        <div key={i} className="text-xs p-2 bg-white dark:bg-slate-900 rounded-lg border border-rose-100 dark:border-rose-900">
                          <p className="font-bold text-rose-900 dark:text-rose-200">{g.term}</p>
                          <p className="text-[10px] text-rose-600 font-medium">⚠ Não encontrado na Source of Truth</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Jobs List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" /> Vagas Cadastradas Anteriores ({jobs.length})
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {jobs.map((job) => (
              <div key={job.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.company} • Cadastrado em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {job.analysis && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                      Match: {job.analysis.matchScore}%
                    </span>
                  )}
                  <button
                    onClick={() => handleGenerateResumeForJob(job.id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gerar Currículo ATS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
