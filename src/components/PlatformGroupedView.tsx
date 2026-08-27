import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Project } from '../types';
import { PlatformBadge } from './PlatformBadge';
import { ProjectCard } from './ProjectCard';

interface PlatformGroupedViewProps {
  projects: Project[];
  onOpenDetail: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
  onNewProjectWithPlatform: (platform: string) => void;
}

export const PlatformGroupedView: React.FC<PlatformGroupedViewProps> = ({
  projects,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleFavorite,
  onNewProjectWithPlatform
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Group by platform
  const grouped = projects.reduce((acc: Record<string, Project[]>, proj: Project) => {
    const platformKey = proj.platform || 'Otra';
    if (!acc[platformKey]) {
      acc[platformKey] = [];
    }
    acc[platformKey].push(proj);
    return acc;
  }, {} as Record<string, Project[]>);

  const platformKeys = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length);

  const toggleCollapse = (platform: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  return (
    <div className="space-y-6">
      {platformKeys.map((platformKey) => {
        const groupProjects = grouped[platformKey];
        const isCollapsed = collapsedGroups[platformKey];

        return (
          <div 
            key={platformKey}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200"
          >
            {/* Header */}
            <div 
              onClick={() => toggleCollapse(platformKey)}
              className="px-5 py-3.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors"
            >
              <div className="flex items-center gap-3">
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
                  {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                </button>
                <PlatformBadge platform={platformKey} size="lg" />
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {groupProjects.length} {groupProjects.length === 1 ? 'proyecto' : 'proyectos'}
                </span>
                <button
                  onClick={() => onNewProjectWithPlatform(platformKey)}
                  className="p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={`Nuevo proyecto en ${platformKey}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Grid */}
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
