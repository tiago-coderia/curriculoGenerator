import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutoResume ATS - Sistema de Geração de Currículos com Base em Conhecimento',
  description: 'Gerador local-first de currículos otimizados para ATS Workday baseados exclusivamente na Source of Truth profissional do candidato.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-x-hidden`}>
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
