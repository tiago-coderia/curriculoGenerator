'use client';

import { useState } from 'react';
import { Settings, ShieldCheck, Key, Cpu, Cloud, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [provider, setProvider] = useState('azure');

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <div className="p-8 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> Configurações de Provedores de IA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie o provedor de modelos de linguagem da sua aplicação local. As chaves são mantidas estritamente no seu arquivo .env local.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Provedor Ativo (AI_PROVIDER)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setProvider('azure')}
                className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  provider === 'azure'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Cloud className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold">Azure Foundry</p>
                  <p className="text-[10px] opacity-75">gpt-5.2 (Custom Endpoint)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Cpu className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs font-bold">Google Gemini</p>
                  <p className="text-[10px] opacity-75">gemini-1.5-flash</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  provider === 'openai'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Key className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold">OpenAI Direct</p>
                  <p className="text-[10px] opacity-75">gpt-4o-mini</p>
                </div>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-2 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Endpoint Azure Configurado
            </div>
            <p className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 break-all text-slate-800 dark:text-slate-200">
              https://ineditta-agent-resource.cognitiveservices.azure.com/openai/deployments/gpt-5.2/chat/completions?api-version=2024-05-01-preview
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              Insira sua chave no arquivo <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[10px]">.env</code> na variável <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[10px]">AZURE_OPENAI_API_KEY</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
