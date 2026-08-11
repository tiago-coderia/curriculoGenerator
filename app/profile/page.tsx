'use client';

import { useState, useEffect } from 'react';
import { Stepper } from '@/components/layout/Stepper';
import { UserCheck, Briefcase, GraduationCap, Code2, FolderGit2, Award, Plus, Save, Trash2, Edit3, XCircle } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'experiences' | 'skills' | 'educations' | 'projects' | 'certifications'>('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Editing States
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);

  // Form states
  const [infoForm, setInfoForm] = useState({ name: '', headline: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' });
  const [expForm, setExpForm] = useState({ company: '', role: '', employmentType: 'Full-time', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '', technologies: '' });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Technical', level: 'Intermediate', yearsOfExperience: 2 });
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
  const [projForm, setProjForm] = useState({ name: '', description: '', role: '', technologies: '', achievements: '', url: '' });
  const [certForm, setCertForm] = useState({ name: '', issuer: '', issueDate: '', expirationDate: '', credentialId: '', credentialUrl: '' });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data);
      if (data) {
        setInfoForm({
          name: data.name || '',
          headline: data.headline || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          portfolio: data.portfolio || '',
          summary: data.summary || '',
        });
      }
    } catch (e) {
      console.error('Erro ao buscar perfil:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'profile', candidateId: profile.id, data: infoForm }),
      });
      await fetchProfile();
      alert('Informações pessoais salvas na Source of Truth!');
    } catch (err) {
      alert('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  // --- EXPERIENCE ---
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !expForm.company || !expForm.role) return;
    setSaving(true);
    try {
      const payload = {
        section: 'experience',
        candidateId: profile.id,
        data: {
          id: editingExpId || undefined,
          ...expForm,
          achievements: expForm.achievements.split('\n').filter(Boolean),
          technologies: expForm.technologies.split(',').map(s => s.trim()).filter(Boolean),
        },
      };

      await fetch('/api/profile', {
        method: editingExpId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      cancelExpEdit();
      await fetchProfile();
    } catch (err) {
      alert('Erro ao salvar experiência.');
    } finally {
      setSaving(false);
    }
  };

  const startExpEdit = (exp: any) => {
    setEditingExpId(exp.id);
    let achText = '';
    try {
      achText = JSON.parse(exp.achievements || '[]').join('\n');
    } catch {
      achText = exp.achievements || '';
    }

    let techText = '';
    try {
      techText = JSON.parse(exp.technologies || '[]').join(', ');
    } catch {
      techText = exp.technologies || '';
    }

    setExpForm({
      company: exp.company || '',
      role: exp.role || '',
      employmentType: exp.employmentType || 'Full-time',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: !!exp.current,
      description: exp.description || '',
      achievements: achText,
      technologies: techText,
    });
  };

  const cancelExpEdit = () => {
    setEditingExpId(null);
    setExpForm({ company: '', role: '', employmentType: 'Full-time', location: '', startDate: '', endDate: '', current: false, description: '', achievements: '', technologies: '' });
  };

  // --- SKILL ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !skillForm.name) return;
    setSaving(true);
    try {
      const payload = {
        section: 'skill',
        candidateId: profile.id,
        data: {
          id: editingSkillId || undefined,
          ...skillForm,
        },
      };

      await fetch('/api/profile', {
        method: editingSkillId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      cancelSkillEdit();
      await fetchProfile();
    } catch (err) {
      alert('Erro ao salvar skill.');
    } finally {
      setSaving(false);
    }
  };

  const startSkillEdit = (skill: any) => {
    setEditingSkillId(skill.id);
    setSkillForm({
      name: skill.name || '',
      category: skill.category || 'Technical',
      level: skill.level || 'Intermediate',
      yearsOfExperience: skill.yearsOfExperience || 2,
    });
  };

  const cancelSkillEdit = () => {
    setEditingSkillId(null);
    setSkillForm({ name: '', category: 'Technical', level: 'Intermediate', yearsOfExperience: 2 });
  };

  // --- EDUCATION ---
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !eduForm.institution || !eduForm.degree) return;
    setSaving(true);
    try {
      const payload = {
        section: 'education',
        candidateId: profile.id,
        data: {
          id: editingEduId || undefined,
          ...eduForm,
        },
      };

      await fetch('/api/profile', {
        method: editingEduId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      cancelEduEdit();
      await fetchProfile();
    } catch (err) {
      alert('Erro ao salvar formação.');
    } finally {
      setSaving(false);
    }
  };

  const startEduEdit = (edu: any) => {
    setEditingEduId(edu.id);
    setEduForm({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || '',
    });
  };

  const cancelEduEdit = () => {
    setEditingEduId(null);
    setEduForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
  };

  // --- PROJECT ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !projForm.name) return;
    setSaving(true);
    try {
      const payload = {
        section: 'project',
        candidateId: profile.id,
        data: {
          id: editingProjId || undefined,
          ...projForm,
          technologies: projForm.technologies.split(',').map(s => s.trim()).filter(Boolean),
          achievements: projForm.achievements.split('\n').filter(Boolean),
        },
      };

      await fetch('/api/profile', {
        method: editingProjId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      cancelProjEdit();
      await fetchProfile();
    } catch (err) {
      alert('Erro ao salvar projeto.');
    } finally {
      setSaving(false);
    }
  };

  const startProjEdit = (proj: any) => {
    setEditingProjId(proj.id);
    let techText = '';
    try {
      techText = JSON.parse(proj.technologies || '[]').join(', ');
    } catch {
      techText = proj.technologies || '';
    }

    setProjForm({
      name: proj.name || '',
      role: proj.role || '',
      description: proj.description || '',
      technologies: techText,
      achievements: '',
      url: proj.url || '',
    });
  };

  const cancelProjEdit = () => {
    setEditingProjId(null);
    setProjForm({ name: '', description: '', role: '', technologies: '', achievements: '', url: '' });
  };

  // --- CERTIFICATION ---
  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !certForm.name || !certForm.issuer) return;
    setSaving(true);
    try {
      const payload = {
        section: 'certification',
        candidateId: profile.id,
        data: {
          id: editingCertId || undefined,
          ...certForm,
        },
      };

      await fetch('/api/profile', {
        method: editingCertId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      cancelCertEdit();
      await fetchProfile();
    } catch (err) {
      alert('Erro ao salvar certificação.');
    } finally {
      setSaving(false);
    }
  };

  const startCertEdit = (cert: any) => {
    setEditingCertId(cert.id);
    setCertForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
    });
  };

  const cancelCertEdit = () => {
    setEditingCertId(null);
    setCertForm({ name: '', issuer: '', issueDate: '', expirationDate: '', credentialId: '', credentialUrl: '' });
  };

  const handleDeleteItem = async (section: string, id: string, label: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${label}" da sua Source of Truth?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/profile?section=${section}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchProfile();
      } else {
        alert('Erro ao excluir item.');
      }
    } catch (e) {
      alert('Erro ao excluir item.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
        Carregando Source of Truth...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Stepper currentStep={1} />

      <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Meu Perfil — Source of Truth Profissional</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cadastre e edite seu histórico profissional real. O gerador de currículos consumirá apenas estas informações para criar seus documentos ATS sem inventar dados.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'info' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Informações Pessoais
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'experiences' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Experiências ({profile?.experiences?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'skills' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" /> Skills ({profile?.skills?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('educations')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'educations' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Formação ({profile?.educations?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'projects' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> Projetos ({profile?.projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'certifications' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" /> Certificações ({profile?.certifications?.length || 0})
          </button>
        </div>

        {/* Tab 1: Personal Info */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Título Profissional (Headline)</label>
                <input
                  type="text"
                  value={infoForm.headline}
                  onChange={(e) => setInfoForm({ ...infoForm, headline: e.target.value })}
                  placeholder="Ex: Senior Full Stack Engineer & AI Specialist"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                <input
                  type="email"
                  value={infoForm.email}
                  onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                <input
                  type="text"
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                  placeholder="+55 (11) 99999-9999"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Localização</label>
                <input
                  type="text"
                  value={infoForm.location}
                  onChange={(e) => setInfoForm({ ...infoForm, location: e.target.value })}
                  placeholder="São Paulo, SP - Brasil"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={infoForm.linkedin}
                  onChange={(e) => setInfoForm({ ...infoForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/usuario"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={infoForm.github}
                  onChange={(e) => setInfoForm({ ...infoForm, github: e.target.value })}
                  placeholder="https://github.com/seu-usuario"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portfolio / Site Pessoal URL</label>
                <input
                  type="text"
                  value={infoForm.portfolio}
                  onChange={(e) => setInfoForm({ ...infoForm, portfolio: e.target.value })}
                  placeholder="https://seu-portfolio.dev"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resumo Profissional Geral</label>
              <textarea
                rows={4}
                value={infoForm.summary}
                onChange={(e) => setInfoForm({ ...infoForm, summary: e.target.value })}
                placeholder="Descreva brevemente suas conquistas gerais e foco de carreira..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Experiences */}
        {activeTab === 'experiences' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveExperience} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {editingExpId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-blue-600" />}
                  <span>{editingExpId ? 'Editar Experiência Profissional' : 'Adicionar Nova Experiência Profissional'}</span>
                </h2>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={cancelExpEdit}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancelar Edição
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Data Início (YYYY-MM)</label>
                  <input
                    type="text"
                    value={expForm.startDate}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    placeholder="2021-03"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Data Fim (deixe vazio se atual)</label>
                  <input
                    type="text"
                    value={expForm.endDate}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    placeholder="2023-12"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Conquistas & Responsabilidades (uma por linha)</label>
                <textarea
                  rows={3}
                  value={expForm.achievements}
                  onChange={(e) => setExpForm({ ...expForm, achievements: e.target.value })}
                  placeholder="Desenvolvi microserviço em Node.js aumentando throughput em 40%&#10;Liderei equipe de 4 desenvolvedores"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tecnologias Utilizadas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={expForm.technologies}
                  onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                  placeholder="Node.js, TypeScript, React, Docker, GCP"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className={`${editingExpId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-medium px-4 py-2 rounded-xl text-xs transition-all`}
                >
                  {editingExpId ? 'Salvar Alterações da Experiência' : 'Adicionar Experiência'}
                </button>
              </div>
            </form>

            {/* List Existing */}
            <div className="space-y-3">
              {profile?.experiences?.map((exp: any) => (
                <div key={exp.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border ${editingExpId === exp.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-slate-800'} shadow-sm space-y-2`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {exp.role} <span className="text-blue-600 font-normal">@ {exp.company}</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 mr-2">{exp.startDate} - {exp.endDate || 'Atual'}</span>
                      <button
                        onClick={() => startExpEdit(exp)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        title="Editar Experiência"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('experience', exp.id, `${exp.role} @ ${exp.company}`)}
                        disabled={deletingId === exp.id}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Deletar Experiência"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {exp.achievements && (
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1">
                      {JSON.parse(exp.achievements || '[]').map((ach: string, idx: number) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSkill} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {editingSkillId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-blue-600" />}
                  <span>{editingSkillId ? 'Editar Skill' : 'Adicionar Nova Skill'}</span>
                </h2>
                {editingSkillId && (
                  <button type="button" onClick={cancelSkillEdit} className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Cancelar
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nome da Skill / Tecnologia</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="Ex: PostgreSQL, LangChain, React, Node.js"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div className="w-52">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Categoria (Tipo)</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  >
                    <option value="AI">AI & Automação</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Programming">Linguagem / Programação</option>
                    <option value="Database">Banco de Dados</option>
                    <option value="Cloud">Cloud & Infraestrutura</option>
                    <option value="Automation">Automação & Processos</option>
                    <option value="Framework">Framework / Biblioteca</option>
                    <option value="Tools">Ferramentas & DevOps</option>
                    <option value="Technical">Técnico Geral</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Management">Gestão & Liderança</option>
                    <option value="Other">Outro</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className={`${editingSkillId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-medium px-4 py-2 rounded-xl text-xs transition-all`}
                >
                  {editingSkillId ? 'Salvar Skill' : 'Adicionar Skill'}
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {profile?.skills?.map((skill: any) => (
                <div key={skill.id} className={`bg-white dark:bg-slate-900 p-3.5 rounded-xl border ${editingSkillId === skill.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-slate-800'} flex items-center justify-between gap-2 shadow-sm`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{skill.name}</p>
                    <select
                      value={skill.category}
                      onChange={async (e) => {
                        const newCat = e.target.value;
                        await fetch('/api/profile', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            section: 'skill',
                            data: {
                              id: skill.id,
                              name: skill.name,
                              category: newCat,
                              level: skill.level || 'Intermediate',
                              yearsOfExperience: skill.yearsOfExperience || 1,
                            },
                          }),
                        });
                        fetchProfile();
                      }}
                      className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded px-1.5 py-0.5 mt-1 focus:outline-none cursor-pointer"
                      title="Clique para alterar a categoria instantaneamente"
                    >
                      <option value="AI">AI & Automação</option>
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Programming">Linguagem / Programação</option>
                      <option value="Database">Banco de Dados</option>
                      <option value="Cloud">Cloud & Infraestrutura</option>
                      <option value="Automation">Automação</option>
                      <option value="Framework">Framework</option>
                      <option value="Tools">Ferramentas & DevOps</option>
                      <option value="Technical">Técnico Geral</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Management">Gestão & Liderança</option>
                      <option value="Other">Outro</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startSkillEdit(skill)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Editar detalhes da Skill"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('skill', skill.id, skill.name)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Deletar Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Education */}
        {activeTab === 'educations' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveEducation} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {editingEduId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-blue-600" />}
                  <span>{editingEduId ? 'Editar Formação Acadêmica' : 'Adicionar Formação Acadêmica'}</span>
                </h2>
                {editingEduId && (
                  <button type="button" onClick={cancelEduEdit} className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Cancelar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Instituição</label>
                  <input
                    type="text"
                    value={eduForm.institution}
                    onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Grau / Título</label>
                  <input
                    type="text"
                    value={eduForm.degree}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="Bacharelado / Mestrado"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Curso / Área</label>
                  <input
                    type="text"
                    value={eduForm.field}
                    onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                    placeholder="Ciência da Computação"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Período</label>
                  <input
                    type="text"
                    value={eduForm.startDate}
                    onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                    placeholder="2018 - 2022"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`${editingEduId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-medium px-4 py-2 rounded-xl text-xs transition-all`}
              >
                {editingEduId ? 'Salvar Formação' : 'Adicionar Formação'}
              </button>
            </form>

            <div className="space-y-3">
              {profile?.educations?.map((edu: any) => (
                <div key={edu.id} className={`bg-white dark:bg-slate-900 p-4 rounded-xl border ${editingEduId === edu.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-slate-800'} flex items-center justify-between`}>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{edu.degree} em {edu.field}</h3>
                    <p className="text-xs text-slate-500">{edu.institution} ({edu.startDate})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEduEdit(edu)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                      title="Editar Formação"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('education', edu.id, `${edu.degree} - ${edu.institution}`)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                      title="Deletar Formação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveProject} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {editingProjId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-blue-600" />}
                  <span>{editingProjId ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</span>
                </h2>
                {editingProjId && (
                  <button type="button" onClick={cancelProjEdit} className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Cancelar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nome do Projeto</label>
                  <input
                    type="text"
                    value={projForm.name}
                    onChange={(e) => setProjForm({ ...projForm, name: e.target.value })}
                    placeholder="Ex: AutoResume ATS"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Sua Função no Projeto</label>
                  <input
                    type="text"
                    value={projForm.role}
                    onChange={(e) => setProjForm({ ...projForm, role: e.target.value })}
                    placeholder="Ex: Lead Developer / Criador"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Resumo do projeto..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tecnologias Utilizadas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={projForm.technologies}
                  onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                  placeholder="Next.js, TypeScript, Tailwind CSS, Prisma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">URL / Link do Projeto</label>
                <input
                  type="text"
                  value={projForm.url}
                  onChange={(e) => setProjForm({ ...projForm, url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <button
                type="submit"
                className={`${editingProjId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-medium px-4 py-2 rounded-xl text-xs transition-all`}
              >
                {editingProjId ? 'Salvar Projeto' : 'Adicionar Projeto'}
              </button>
            </form>

            <div className="space-y-3">
              {profile?.projects?.map((proj: any) => (
                <div key={proj.id} className={`bg-white dark:bg-slate-900 p-4 rounded-xl border ${editingProjId === proj.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-slate-800'} flex items-center justify-between`}>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{proj.name} {proj.role ? `(${proj.role})` : ''}</h3>
                    <p className="text-xs text-slate-500">{proj.description}</p>
                    {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 underline mt-1 inline-block">{proj.url}</a>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startProjEdit(proj)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                      title="Editar Projeto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('project', proj.id, proj.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                      title="Deletar Projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveCertification} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {editingCertId ? <Edit3 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-blue-600" />}
                  <span>{editingCertId ? 'Editar Certificação' : 'Adicionar Certificação / Licença'}</span>
                </h2>
                {editingCertId && (
                  <button type="button" onClick={cancelCertEdit} className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Cancelar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nome da Certificação</label>
                  <input
                    type="text"
                    value={certForm.name}
                    onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                    placeholder="Ex: AWS Certified Developer – Associate"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Emissor (Issuer)</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="Ex: Amazon Web Services / DeepLearning.AI"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Data Emissão (YYYY-MM)</label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="2023-05"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">ID da Credencial (Opcional)</label>
                  <input
                    type="text"
                    value={certForm.credentialId}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    placeholder="Ex: AWS-DEV-998877"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`${editingCertId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-medium px-4 py-2 rounded-xl text-xs transition-all`}
              >
                {editingCertId ? 'Salvar Certificação' : 'Adicionar Certificação'}
              </button>
            </form>

            <div className="space-y-3">
              {profile?.certifications?.map((cert: any) => (
                <div key={cert.id} className={`bg-white dark:bg-slate-900 p-4 rounded-xl border ${editingCertId === cert.id ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 dark:border-slate-800'} flex items-center justify-between`}>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cert.name}</h3>
                    <p className="text-xs text-slate-500">{cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}</p>
                    {cert.credentialId && <p className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {cert.credentialId}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startCertEdit(cert)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                      title="Editar Certificação"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('certification', cert.id, cert.name)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                      title="Deletar Certificação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
