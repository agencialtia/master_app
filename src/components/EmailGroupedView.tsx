import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, ShieldCheck, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface EmailGroupedViewProps {
  projects: Project[];
  onOpenDetail: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
  onNewProjectWithEmail: (email: string) => void;
}

export const EmailGroupedView: React.FC<EmailGroupedViewProps> = ({
  projects,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onNewProjectWithEmail
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Group projects by email
  const grouped = projects.reduce((acc: Record<string, Project[]>, proj: Project) => {
    const emailKey = proj.email ? proj.email.toLowerCase().trim() : 'sin-correo@asociado';
    if (!acc[emailKey]) {
      acc[emailKey] = [];
    }
    acc[emailKey].push(proj);
    return acc;
  }, {} as Record<string, Project[]>);

  const emailKeys = Object.keys(grouped).sort();

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const toggleCollapse = (email: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  if (emailKeys.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm">No hay proyectos para agrupar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {emailKeys.map((emailKey) => {
        const groupProjects = grouped[emailKey];
        const isCollapsed = collapsedGroups[emailKey];
        const activeInGroup = groupProjects.filter(p => p.status === 'Activo').length;

        return (
          <div 
            key={emailKey}
            className="bg-white/80 dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
          >
            {/* Group Header Banner */}
            <div 
              onClick={() => toggleCollapse(emailKey)}
              className="px-5 py-4 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
                  {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                </button>

                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {emailKey.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                      {emailKey}
                    </span>
                    <button
                      onClick={(e) => handleCopyEmail(emailKey, e)}
                      className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors cursor-pointer shrink-0"
                      title="Copiar dirección de correo"
                    >
                      {copiedEmail === emailKey ? (
                        <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Inicia sesión con esta cuenta para editar o acceder a las siguientes plataformas
                  </div>
                </div>
              </div>

              {/* Group Right Stats & Action */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {groupProjects.length} {groupProjects.length === 1 ? 'proyecto' : 'proyectos'} ({activeInGroup} activos)
                </span>

                <button
                  onClick={() => onNewProjectWithEmail(emailKey)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Añadir a esta cuenta</span>
                </button>
              </div>
            </div>

            {/* Group Project Cards Grid */}
            {!isCollapsed && (
              <div className="p-5 bg-slate-50/30 dark:bg-slate-950/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpenDetail={onOpenDetail}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
