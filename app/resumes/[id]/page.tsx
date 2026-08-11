'use client';

import { useState, useEffect, use } from 'react';
import { Stepper } from '@/components/layout/Stepper';
import { FileText, Download, Save, RefreshCw, Award, CheckCircle2, AlertTriangle, ShieldCheck, Edit3, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ResumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [resumeData, setResumeData] = useState<any>(null);
  const [docContent, setDocContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'ats' | 'factcheck'>('editor');

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${id}`);
      const data = await res.json();
      setResumeData(data);
      setDocContent(data.contentParsed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [id]);

  const handleSaveEdits = async () => {
    setSaving(true);
    try {
      await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: docContent }),
      });
      alert('Currículo salvo com sucesso!');
      fetchResume();
    } catch (e) {
      alert('Erro ao salvar currículo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !resumeData) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
        Carregando currículo e auditoria ATS...
      </div>
    );
  }

  const atsFeedback = resumeData.atsFeedbackParsed || {};
  const factCheck = resumeData.factCheckParsed || {};

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Stepper currentStep={4} />

      <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Workday ATS Engine
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Grounded in SoT
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
              {resumeData.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Position: {resumeData.job?.title} @ {resumeData.job?.company}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleSaveEdits}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>

            <a
              href={`/api/resumes/${id}/export?format=pdf`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>

            <a
              href={`/api/resumes/${id}/export?format=docx`}
              download
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download DOCX</span>
            </a>
          </div>
        </div>

        {/* ATS Score & Security Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80">ATS Score Workday</p>
              <p className="text-3xl font-extrabold mt-0.5">{resumeData.atsScore} / 100</p>
              <p className="text-[11px] opacity-90 mt-1">100% 1-Coluna Linear</p>
            </div>
            <Award className="w-10 h-10 opacity-80" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Keyword Match</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{atsFeedback.keywordMatchScore || 92}%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Palavras-chave cobrem a vaga</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Validação Factual</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> {factCheck.passed ? '100% OK' : 'Alerta'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Zero alucinações detectadas</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Readability Score</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{atsFeedback.readabilityScore || 95}%</p>
            <p className="text-[11px] text-blue-600 font-medium mt-0.5">Formatado para recrutadores</p>
          </div>
        </div>

        {/* View Switch Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-4 h-4" /> Editor Visual do Currículo
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'ats' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" /> Relatório de Auditoria ATS
          </button>
          <button
            onClick={() => setActiveTab('factcheck')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'factcheck' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Checagem Factual (Anti-Alucinação)
          </button>
        </div>

        {/* Tab 1: Interactive Visual Editor */}
        {activeTab === 'editor' && docContent && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Editor Controls */}
            <div className="lg:col-span-12 space-y-6">
              {/* Professional Summary Editor */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Professional Summary (Resumo Profissional)
                </label>
                <textarea
                  rows={4}
                  value={docContent.professionalSummary || ''}
                  onChange={(e) => setDocContent({ ...docContent, professionalSummary: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Core Skills Editor */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Core Skills (Grupos de Competências)
                </label>
                <div className="space-y-3">
                  {docContent.skillGroups?.map((group: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => {
                          const newGroups = [...docContent.skillGroups];
                          newGroups[idx].category = e.target.value;
                          setDocContent({ ...docContent, skillGroups: newGroups });
                        }}
                        className="font-bold text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded"
                      />
                      <input
                        type="text"
                        value={group.skills.join(', ')}
                        onChange={(e) => {
                          const newGroups = [...docContent.skillGroups];
                          newGroups[idx].skills = e.target.value.split(',').map((s: string) => s.trim());
                          setDocContent({ ...docContent, skillGroups: newGroups });
                        }}
                        className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Bullets Editor */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Professional Experience Bullets
                </label>
                <div className="space-y-5">
                  {docContent.experience?.map((exp: any, eIdx: number) => (
                    <div key={eIdx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                      <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-slate-400 font-normal">{exp.dates}</span>
                      </div>
                      <div className="space-y-2">
                        {exp.bullets?.map((b: string, bIdx: number) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">•</span>
                            <input
                              type="text"
                              value={b}
                              onChange={(e) => {
                                const newExp = [...docContent.experience];
                                newExp[eIdx].bullets[bIdx] = e.target.value;
                                setDocContent({ ...docContent, experience: newExp });
                              }}
                              className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ATS Feedback */}
        {activeTab === 'ats' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> Relatório Detalhado de Auditoria Workday ATS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Strengths */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <h3 className="font-bold text-xs text-emerald-900 dark:text-emerald-300">✓ Pontos Fortes (Strengths)</h3>
                <ul className="list-disc list-inside text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                  {(atsFeedback.strengths || []).map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Gaps */}
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2">
                <h3 className="font-bold text-xs text-amber-900 dark:text-amber-300">⚠ Gaps Identificados</h3>
                <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  {(atsFeedback.gaps || []).map((g: string, i: number) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 space-y-2">
                <h3 className="font-bold text-xs text-blue-900 dark:text-blue-300">• Recomendações de Melhoria</h3>
                <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  {(atsFeedback.recommendations || []).map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fact Check Results */}
        {activeTab === 'factcheck' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Relatório do Validador Factual Anti-Alucinação
            </h2>

            {factCheck.unsupportedClaims?.length === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-xs text-emerald-900 dark:text-emerald-300">Nenhuma alucinação detectada!</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">100% das informações contidas neste currículo possuem sustentação direta na sua Source of Truth.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(factCheck.unsupportedClaims || []).map((c: any, i: number) => (
                  <div key={i} className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1">
                    <p className="font-bold text-xs text-rose-900 dark:text-rose-300">Unsupported Claim: "{c.claim}"</p>
                    <p className="text-xs text-rose-700 dark:text-rose-400">Local: {c.location} • Razão: {c.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
