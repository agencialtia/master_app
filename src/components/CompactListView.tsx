import React from 'react';
import { ExternalLink, Star, MoreHorizontal, Mail, Globe } from 'lucide-react';
import { Project, STATUS_CONFIG } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface CompactListViewProps {
  projects: Project[];
  onOpenDetail: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
}

export const CompactListView: React.FC<CompactListViewProps> = ({
  projects,
  onOpenDetail,
  onEdit,
  onDelete,
  onToggleFavorite
}) => {
  const handleOpenUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (url && url.trim()) {
      let target = url.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = `https://${target}`;
      }
      const newWin = window.open(target, '_blank', 'noopener,noreferrer');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = target;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">★</th>
              <th className="py-3 px-4">Proyecto</th>
              <th className="py-3 px-4">Cuenta / Correo</th>
              <th className="py-3 px-4">Plataforma</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
            {projects.map((project) => {
              const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG['Activo'];
              return (
                <tr
                  key={project.id}
                  onClick={() => onOpenDetail(project)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(project.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                        project.favorite 
                          ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-500 shadow-2xs' 
                          : 'border-transparent text-slate-300 dark:text-slate-600 hover:text-amber-500 hover:bg-amber-50/50'
                      }`}
                      title={project.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Star size={14} className={project.favorite ? 'fill-amber-400 text-amber-500' : ''} />
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                        {project.description}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="inline-flex items-center gap-1">
                      <Mail size={12} className="text-slate-400" />
                      <span>{project.email}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <PlatformBadge platform={project.platform} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}></span>
                      <span>{statusInfo.label}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {project.category || '—'}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-2 justify-end">
                      {project.url ? (
                        <button
                          onClick={(e) => handleOpenUrl(project.url, e)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <span>Abrir</span>
                          <ExternalLink size={11} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenDetail(project)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-medium cursor-pointer"
                        >
                          Detalles
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
