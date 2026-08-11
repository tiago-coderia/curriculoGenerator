'use client';

import { useState } from 'react';
import { Stepper } from '@/components/layout/Stepper';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Save, Edit3, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function KnowledgeImportPage() {
  const [freeText, setFreeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeText.trim()) return;
    setAnalyzing(true);
    setExtractedData(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/knowledge/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: freeText }),
      });
      const data = await res.json();
      if (data.extracted) {
        setExtractedData(data.extracted);
      }
    } catch (e) {
      alert('Erro ao analisar texto com a IA.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmSave = async () => {
    // Get candidate ID
    const profRes = await fetch('/api/profile');
    const profile = await profRes.json();
    if (!profile?.id) return;

    setSaving(true);
    try {
      const res = await fetch('/api/knowledge/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: freeText, candidateId: profile.id, saveConfirmed: true }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
      }
    } catch (e) {
      alert('Erro ao salvar informações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Stepper currentStep={1} />

      <div className="p-8 max-w-5xl w-full mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Inteligência de Extração Factual
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" /> Entrada de Conhecimento por IA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cole seu resumo, trajetória de carreira ou notas em texto livre. A IA irá estruturar suas qualificações para validação antes de integrar à sua Source of Truth.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleExtract} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Cole seu texto profissional livre:
          </label>
          <textarea
            rows={6}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Ex: Trabalho há mais de 8 anos com tecnologia. Comecei desenvolvendo sites em PHP e Vue.js, depois migrei para ecossistema Node.js, React e TypeScript na DataFlow. Recentemente liderei automações de IA com LangChain e n8n na TechInnovate reduzindo tempo manual em 45%..."
            className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Regra Absoluta: Informações só são salvas na SoT com a sua confirmação explícita.</span>
            </div>
            <button
              type="submit"
              disabled={analyzing}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Analisando com IA...' : 'Estruturar Informações'}</span>
            </button>
          </div>
        </form>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Informações Salvas na Source of Truth!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">Seu histórico profissional foi enriquecido e está pronto para geração de currículos.</p>
              </div>
            </div>
            <Link
              href="/profile"
              className="bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-emerald-500 transition-all"
            >
              Ver Meu Perfil
            </Link>
          </div>
        )}

        {/* Confirmation Screen / Informações Identificadas */}
        {extractedData && !savedSuccess && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-lg space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                  Revisão Factual Obrigatória
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Informações Identificadas pela IA
                </h2>
                <p className="text-xs text-slate-500">
                  Verifique se todos os itens abaixo são verdadeiros antes de confirmar a adição à Source of Truth.
                </p>
              </div>
            </div>

            {/* Extracted Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              {extractedData.skills?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Competências / Skills ({extractedData.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.map((s: any, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {s.name} <span className="text-[10px] opacity-75">({s.category})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences */}
              {extractedData.experience?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Experiências Profissionais ({extractedData.experience.length})
                  </h3>
                  <div className="space-y-2">
                    {extractedData.experience.map((e: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                        <p className="font-bold text-slate-900 dark:text-white">✓ {e.role} @ {e.company}</p>
                        <p className="text-slate-500 text-[11px]">{e.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Items */}
              {extractedData.knowledgeItems?.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Conhecimentos Genéricos Identificados ({extractedData.knowledgeItems.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extractedData.knowledgeItems.map((k: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                        <p className="font-bold text-blue-600 dark:text-blue-400">✓ {k.title}</p>
                        <p className="text-slate-600 dark:text-slate-300">{k.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setExtractedData(null)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Texto Inicial
              </button>

              <button
                onClick={handleConfirmSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Gravando na SoT...' : '[Confirmar Informações Factuais]'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
