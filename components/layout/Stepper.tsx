'use client';

import { CheckCircle2, Circle } from 'lucide-react';

interface StepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
}

const steps = [
  { id: 1, name: '1. Meu Conhecimento' },
  { id: 2, name: '2. Descrição da Vaga' },
  { id: 3, name: '3. Análise ATS' },
  { id: 4, name: '4. Currículo' },
  { id: 5, name: '5. Download' },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto text-xs font-medium">
        {steps.map((step, idx) => {
          const isDone = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
                <span>{step.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-6 h-0.5 ${step.id < currentStep ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-800'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
