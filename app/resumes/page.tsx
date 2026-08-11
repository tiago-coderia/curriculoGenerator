'use client';

import { useState, useEffect } from 'react';
import { Stepper } from '@/components/layout/Stepper';
import { FileText, Download, Eye, Edit3, Trash2, ShieldCheck, Award, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ResumesListPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      setResumes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este currículo gerado?')) return;
    try {
      await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      fetchResumes();
    } catch (e) {
      alert('Erro ao excluir currículo.');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Stepper currentStep={5} />

      <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" /> Meus Currículos Otimizados
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Histórico de documentos criados e ajustados para vagas específicas com auditoria factual ativada.
            </p>
          </div>
          <Link
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar Novo Currículo</span>
          </Link>
        </div>

        {/* Resumes Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Carregando currículos...</div>
          ) : resumes.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nenhum currículo encontrado</p>
              <p className="text-xs text-slate-500">Analise uma vaga na aba Vagas & Matching para gerar seu primeiro documento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Cargo & Empresa</th>
                    <th className="p-4">ATS Score</th>
                    <th className="p-4">Validação Factual</th>
                    <th className="p-4">Criado Em</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {resumes.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <div>
                          <p className="text-sm">{res.title}</p>
                          <p className="text-xs font-normal text-slate-500">{res.job?.company || 'Empresa'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                          <Award className="w-3.5 h-3.5" />
                          {res.atsScore}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Auditado (SoT Ok)
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(res.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/resumes/${res.id}`}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Editor Visual
                          </Link>
                          <a
                            href={`/api/resumes/${res.id}/export?format=pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </a>
                          <a
                            href={`/api/resumes/${res.id}/export?format=docx`}
                            download
                            className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold text-xs flex items-center gap-1"
                            title="Download DOCX"
                          >
                            <Download className="w-3.5 h-3.5" /> DOCX
                          </a>
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
