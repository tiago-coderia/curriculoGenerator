'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCheck, Sparkles, Briefcase, FileText, Settings, FileSearch, ShieldCheck } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Meu Perfil (SoT)', href: '/profile', icon: UserCheck },
  { name: 'Importar com IA', href: '/knowledge', icon: Sparkles },
  { name: 'Vagas & Matching', href: '/jobs', icon: Briefcase },
  { name: 'Meus Currículos', href: '/resumes', icon: FileText },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <FileSearch className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            AutoResume <span className="text-[10px] uppercase tracking-wider font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">Workday ATS</span>
          </h1>
          <p className="text-xs text-slate-400">Source of Truth Engine</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* ATS Quality Badge */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Factual Security</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Garantia de 0% alucinações. O currículo gerado é validado estritamente contra a sua Source of Truth.
        </p>
      </div>
    </aside>
  );
}
