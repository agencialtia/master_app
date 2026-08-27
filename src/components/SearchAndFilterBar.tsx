import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  ChevronDown, 
  FolderKanban, 
  Activity, 
  Check, 
  RotateCcw,
  Plus
} from 'lucide-react';
import { Project } from '../types';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  allProjects: Project[];
  totalResults: number;
  totalProjects: number;
  onResetFilters: () => void;
  onNewProject?: () => void;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedProjectId,
  onSelectProject,
  selectedStatus,
  onStatusChange,
  allProjects,
  totalResults,
  totalProjects,
  onResetFilters,
  onNewProject
}) => {
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProjectsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProjectObj = allProjects.find(p => p.id === selectedProjectId);
  const hasActiveFilters = Boolean(searchQuery || selectedProjectId || selectedStatus);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-3 sm:p-4 space-y-2.5 mb-5 transition-colors duration-200">
      
      {/* 1. Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar"
          className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* 2. Side-by-Side Compact Filters: PROYECTOS & ESTADO */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 items-start">
        
        {/* A. Botón con Menú Desplegable "PROYECTOS" */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1 text-blue-700 dark:text-blue-400">
            <FolderKanban size={12} className="stroke-[2.5]" />
            <span className="truncate">Proyectos</span>
          </label>

          {/* Compact Trigger Button */}
          <button
            type="button"
            onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
              selectedProjectId 
                ? 'border-blue-500 text-blue-900 dark:text-blue-200 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500/20' 
                : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <span className="truncate pr-1">
              {selectedProjectObj ? selectedProjectObj.name : 'Todos'}
            </span>
            <ChevronDown 
              size={14} 
              className={`text-slate-500 dark:text-slate-400 shrink-0 transition-transform ${isProjectsMenuOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} 
            />
          </button>

          {/* Projects Dropdown Menu */}
          {isProjectsMenuOpen && (
            <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-72 mt-1 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl shadow-xl max-h-64 overflow-y-auto py-1 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-100">
              
              {/* Option: Todos */}
              <button
                type="button"
                onClick={() => {
                  onSelectProject('');
                  setIsProjectsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 ${
                  !selectedProjectId ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-800 dark:text-slate-200 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                  <span>Todos</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {totalProjects}
                </span>
              </button>

              {/* Individual Project Items */}
              <div className="py-0.5">
                {allProjects.map((p) => {
                  const isSelected = p.id === selectedProjectId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectProject(p.id);
                        setIsProjectsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate pr-1.5">
                        <div className="font-semibold text-slate-900 dark:text-white truncate text-[11px] sm:text-xs">{p.name}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">
                          {p.platform || 'General'}
                        </div>
                      </div>
                      {isSelected ? (
                        <Check size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      ) : (
                        <span className={`text-[9px] px-1 py-0.5 rounded font-medium shrink-0 ${
                          p.status === 'Activo' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {p.status}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* B. Filtro: ESTADO */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <Activity size={12} className="stroke-[2.5]" />
            <span className="truncate">Estado</span>
          </label>
          
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`w-full px-2.5 py-1.5 sm:py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border rounded-lg sm:rounded-xl text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none pr-7 truncate ${
                selectedStatus 
                  ? 'border-emerald-500 text-emerald-900 dark:text-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20 font-bold' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              <option value="" className="dark:bg-slate-900">Todos</option>
              <option value="Activo" className="dark:bg-slate-900">Activo</option>
              <option value="Inactivo" className="dark:bg-slate-900">Inactivo</option>
              <option value="Pausado" className="dark:bg-slate-900">Pausado</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Botón "Nuevo" debajo de Proyectos y Estado */}
      {onNewProject && (
        <button
          onClick={onNewProject}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
          title="Crear nuevo proyecto"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>Nuevo Proyecto</span>
        </button>
      )}

      {/* Filter Feedback / Reset when active */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
            Mostrando <strong className="text-slate-900 dark:text-white font-bold">{totalResults}</strong> de {totalProjects}
          </span>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold cursor-pointer shrink-0"
          >
            <RotateCcw size={11} />
            <span>Limpiar</span>
          </button>
        </div>
      )}

    </div>
  );
};
