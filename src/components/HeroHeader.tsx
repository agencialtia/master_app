import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import { Project } from '../types';

interface HeroHeaderProps {
  projects: Project[];
  userName: string;
  onUpdateUserName: (name: string) => void;
  onQuickFilter: (type: 'all' | 'active') => void;
  viewMode: string;
  onSetViewMode: (mode: any) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  projects,
  userName,
  onUpdateUserName
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Format date in Spanish: "DOMINGO, 23 DE AGOSTO"
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  };
  const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(now).toUpperCase();

  // Time-based greeting
  const hour = now.getHours();
  let greetingPeriod = 'BUENAS TARDES';
  if (hour >= 6 && hour < 13) {
    greetingPeriod = 'BUENOS DÍAS';
  } else if (hour >= 20 || hour < 6) {
    greetingPeriod = 'BUENAS NOCHES';
  }

  const activeCount = projects.filter(p => p.status === 'Activo').length;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateUserName(tempName.trim().toUpperCase());
    }
    setIsEditingName(false);
  };

  return (
    <div className="pt-5 pb-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        
        {/* Top Status & Date line */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs tracking-widest font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {activeCount} {activeCount === 1 ? 'PROYECTO ACTIVO' : 'PROYECTOS ACTIVOS'}
            </span>
          </div>
        </div>

        {/* Big Bold Headline */}
        <div>
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2 max-w-lg">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Tu nombre"
                autoFocus
                className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-lg px-3 py-1 uppercase focus:outline-none w-full"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer shrink-0"
              >
                <Check size={18} />
              </button>
            </form>
          ) : (
            <div className="group flex items-center gap-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white uppercase leading-none font-sans">
                {greetingPeriod}. <br className="sm:hidden" />
                <span 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors" 
                  onClick={() => setIsEditingName(true)} 
                  title="Clic para editar nombre"
                >
                  {userName}.
                </span>
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                title="Editar nombre"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
