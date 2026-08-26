import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Globe, 
  User, 
  LogOut, 
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { Project, UserProfile } from '../types';
import { ThemeMode } from '../utils/storage';

interface NavbarProps {
  projects?: Project[];
  userProfile?: UserProfile;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  onNewProject: () => void;
  onOpenBackup?: () => void;
  onOpenIntegrations?: () => void;
  onOpenPremium?: () => void;
  onOpenEditProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile = {
    name: 'Klaus',
    email: 'klausbauer10x@gmail.com',
    plan: 'Gratuito',
    avatarText: 'K'
  } as UserProfile,
  themeMode = 'light',
  onToggleTheme,
  onNewProject,
  onOpenEditProfile,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
  };

  // Derive display initials for avatar
  const avatarInitial = (userProfile.avatarText || userProfile.name?.[0] || 'K').toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors duration-200">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 h-16 sm:h-18 flex items-center justify-between gap-4">
        
        {/* Left: Master App Hub Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 select-none">
          {/* Modern App Hub Geometric Symbol */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-2 sm:p-2.5 shadow-md shadow-blue-500/15 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              {/* Connected Hub Nodes */}
              <rect x="2.5" y="2.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.95" />
              <rect x="14.5" y="2.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.75" />
              <rect x="2.5" y="14.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.75" />
              <rect x="14.5" y="14.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.95" />
              {/* Central Core Pulse */}
              <circle cx="12" cy="12" r="2.5" fill="#67e8f9" />
            </svg>
          </div>

          {/* Logo Name & Subtitle */}
          <div>
            <div className="flex items-center text-base sm:text-lg tracking-tight leading-none">
              <span className="font-extrabold text-slate-950 dark:text-white">Master App</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight mt-0.5 hidden xs:block">
              Centro de Proyectos IA
            </span>
          </div>
        </div>

        {/* Right Section: Harmonious & Clean Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          
          {/* 1. Language Indicator: ES E S 🌐 */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2 py-1 select-none">
            <span className="tracking-wide">ES E S</span>
            <Globe size={15} className="text-slate-500 dark:text-slate-400 stroke-[1.8]" />
          </div>

          {/* 2. Dark Mode Toggle Button (Al lado del lenguaje) */}
          <button
            onClick={onToggleTheme}
            type="button"
            title={themeMode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={themeMode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {themeMode === 'dark' ? (
              <Sun size={17} className="stroke-[2.2] text-amber-400" />
            ) : (
              <Moon size={17} className="stroke-[2.2] text-slate-600" />
            )}
          </button>

          {/* 3. User Avatar with Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
              title="Cuenta de usuario"
              aria-expanded={isUserMenuOpen}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#6347EA] hover:bg-[#5237DB] flex items-center justify-center text-white text-xs sm:text-sm font-black shadow-xs transition-transform active:scale-95">
                {avatarInitial}
              </div>
              <ChevronDown size={14} className="text-slate-500 dark:text-slate-400 stroke-[2.2] transition-transform duration-150" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenEditProfile();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <User size={16} className="text-blue-600 dark:text-blue-400 stroke-[2.2]" />
                  <span>Editar Perfil</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <LogOut size={16} className="text-rose-500 stroke-[2.2]" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Primary New Project CTA Button */}
          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-600/20"
            title="Nuevo Proyecto"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span className="font-semibold">Nuevo</span>
          </button>

        </div>

      </div>
    </header>
  );
};
