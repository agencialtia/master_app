import React, { useState, useRef, useEffect } from 'react';
import { 
  ExternalLink, 
  MoreVertical, 
  Mail, 
  Copy, 
  Check, 
  Edit3, 
  CopyPlus, 
  Trash2, 
  Star, 
  Eye, 
  Tag, 
  Calendar,
  Globe
} from 'lucide-react';
import { Project, STATUS_CONFIG } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface ProjectCardProps {
  project: Project;
  onOpenDetail: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
  onFilterByEmail?: (email: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onFilterByEmail
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.email) {
      navigator.clipboard.writeText(project.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const handleOpenUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.url && project.url.trim()) {
      let targetUrl = project.url.trim();
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
      }
      const newWin = window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = targetUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      onOpenDetail(project);
    }
  };

  const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG['Activo'];

  return (
    <div 
      onClick={() => onOpenDetail(project)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-850 hover:border-blue-400/80 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Card Header */}
      <div className="p-5 sm:p-6 pb-3 sm:pb-4">
        {/* Row 1: Platform Badge + Status + Actions Menu */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <PlatformBadge platform={project.platform} size="sm" />
            
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}></span>
              <span>{statusInfo.label}</span>
            </span>
          </div>

          {/* Right Actions: Favorite & 3-dots Menu */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onToggleFavorite(project.id)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                project.favorite 
                  ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300/80 dark:border-amber-700/80 text-amber-500 shadow-xs scale-105' 
                  : 'bg-transparent hover:bg-amber-50/70 dark:hover:bg-slate-800 border-transparent hover:border-amber-200 dark:hover:border-amber-800/40 text-slate-400 dark:text-slate-500 hover:text-amber-500 opacity-70 group-hover:opacity-100 hover:scale-105'
              }`}
              title={project.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-label={project.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Star size={16} className={project.favorite ? 'fill-amber-400 text-amber-500 stroke-[2.2]' : 'stroke-[2]'} />
            </button>

            {/* Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Más opciones"
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-750 py-1.5 z-30 text-xs font-medium text-slate-700 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenDetail(project);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Eye size={14} className="text-slate-400" />
                      <span>Ver detalles</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(project);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Edit3 size={14} className="text-slate-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDuplicate(project);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <CopyPlus size={14} className="text-slate-400" />
                      <span>Duplicar</span>
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(project);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={14} className="text-red-500 dark:text-red-400" />
                      <span>Eliminar proyecto</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Name (Major Visual Title) */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {project.name}
        </h3>

        {/* Associated Account Email (Core Value Pillar) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onFilterByEmail) onFilterByEmail(project.email);
          }}
          className="group/email inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-slate-200/70 dark:border-slate-750 hover:border-blue-200 dark:hover:border-blue-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium max-w-full transition-colors mb-3"
          title={`Cuenta asociada: ${project.email} (Clic para filtrar por esta cuenta)`}
        >
          <Mail size={14} className="text-slate-400 group-hover/email:text-blue-600 shrink-0" />
          <span className="truncate font-mono text-xs">{project.email}</span>
          <button
            onClick={handleCopyEmail}
            className="ml-auto p-0.5 hover:text-blue-700 dark:hover:text-blue-400 text-slate-400 cursor-pointer shrink-0"
            title="Copiar correo"
          >
            {emailCopied ? <Check size={12} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>

        {/* Description or Notes Snippet (if available) */}
        {project.description ? (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3.5">
            {project.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic line-clamp-1 mb-3.5">
            Sin descripción adicional
          </p>
        )}

        {/* Category & Tag pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {project.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Tag size={11} className="text-slate-400" />
              <span>{project.category}</span>
            </span>
          )}
          {project.relatedLinks && project.relatedLinks.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
              <Globe size={11} />
              <span>{project.relatedLinks.length} enlaces</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Card Footer Actions (Essential requirement #6) */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(project);
          }}
          className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          Ver detalle
        </button>

        <button
          onClick={handleOpenUrl}
          disabled={!project.url}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap ${
            project.url
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:shadow'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
          title={project.url ? `Abrir: ${project.url}` : 'No tiene URL asignada'}
        >
          <span>Abrir proyecto</span>
          <ExternalLink size={13} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
