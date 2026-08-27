/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Project, 
  ViewMode, 
  SortOption, 
  ProjectStatus, 
  DEFAULT_CATEGORIES,
  UserProfile,
  DEFAULT_USER_PROFILE
} from './types';
import { 
  loadProjects, 
  saveProjects, 
  loadCategories, 
  saveCategories, 
  loadUserName, 
  saveUserName,
  loadUserProfile,
  saveUserProfile,
  loadThemeMode,
  saveThemeMode,
  ThemeMode
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { ProjectCard } from './components/ProjectCard';
import { EmailGroupedView } from './components/EmailGroupedView';
import { PlatformGroupedView } from './components/PlatformGroupedView';
import { CompactListView } from './components/CompactListView';
import { QuickCreateModal } from './components/QuickCreateModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { BackupModal } from './components/BackupModal';
import { EditProfileModal } from './components/EditProfileModal';
import { IntegrationsModal } from './components/IntegrationsModal';
import { PremiumModal } from './components/PremiumModal';
import { 
  Plus, 
  FolderPlus, 
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Main State
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [userName, setUserName] = useState<string>(() => loadUserName());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadThemeMode());

  // Search & Filter State - Only "Proyectos" and "Estado" as requested
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals State
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveUserName(userName);
  }, [userName]);

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveThemeMode(themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Existing emails for suggestions in modals
  const existingEmails = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.email).filter(Boolean)));
  }, [projects]);

  // Filtered Projects (Filtered exclusively by Selected Project, Selected Status, and Search Query)
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 1. Specific Project Filter (from Proyectos dropdown)
      if (selectedProjectId && project.id !== selectedProjectId) {
        return false;
      }

      // 2. Status Filter
      if (selectedStatus && project.status !== selectedStatus) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = project.name.toLowerCase().includes(q);
        const matchEmail = project.email?.toLowerCase().includes(q);
        const matchPlatform = project.platform?.toLowerCase().includes(q);
        const matchDescription = project.description?.toLowerCase().includes(q);
        const matchNotes = project.notes?.toLowerCase().includes(q);
        const matchTags = project.tags?.some(t => t.toLowerCase().includes(q));

        if (!matchName && !matchEmail && !matchPlatform && !matchDescription && !matchNotes && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedProjectId, selectedStatus, searchQuery]);

  // Handlers
  const handleCreateProject = (
    newProjectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
    openDetailAfter: boolean = false
  ) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...newProjectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: now,
      updatedAt: now
    };

    setProjects(prev => [newProject, ...prev]);
    setIsQuickCreateOpen(false);

    if (openDetailAfter) {
      setSelectedProjectForDetail(newProject);
      setIsDetailOpen(true);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDuplicateProject = (projectToDup: Project) => {
    const now = new Date().toISOString();
    const duplicated: Project = {
      ...projectToDup,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${projectToDup.name} (Copia)`,
      createdAt: now,
      updatedAt: now,
      favorite: false
    };
    setProjects(prev => [duplicated, ...prev]);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId('');
    }
    if (selectedProjectForDetail?.id === projectId) {
      setSelectedProjectForDetail(null);
      setIsDetailOpen(false);
    }
  };

  const handleToggleFavorite = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, favorite: !p.favorite, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProjectId('');
    setSelectedStatus('');
  };

  const handleQuickFilter = (type: 'all' | 'active') => {
    handleResetFilters();
    if (type === 'active') {
      setSelectedStatus('Activo');
    }
  };

  const handleAddCategory = (newCat: string) => {
    if (newCat && !categories.includes(newCat)) {
      setCategories(prev => [...prev, newCat]);
    }
  };

  const handleOpenDetailModal = (project: Project) => {
    setSelectedProjectForDetail(project);
    setIsDetailOpen(true);
  };

  const handleRequestDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Navbar */}
      <Navbar
        userProfile={userProfile}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onNewProject={() => setIsQuickCreateOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* 2. Hero Header */}
      <HeroHeader
        projects={projects}
        userName={userName}
        onUpdateUserName={setUserName}
        onQuickFilter={handleQuickFilter}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
      />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-[1780px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6">
        
        {/* Search & Only 'Proyectos' and 'Estado' Filters */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          allProjects={projects}
          totalResults={filteredProjects.length}
          totalProjects={projects.length}
          onResetFilters={handleResetFilters}
          onNewProject={() => setIsQuickCreateOpen(true)}
        />

        {/* Dynamic Project Views */}
        {filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
              <FolderPlus size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No se encontraron proyectos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {projects.length === 0 
                ? 'Comienza creando tu primera aplicación o plataforma para mantener todo centralizado y accesible.'
                : 'No hay proyectos que coincidan con los filtros seleccionados.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {projects.length > 0 ? (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Limpiar filtros</span>
                </button>
              ) : null}
              <button
                onClick={() => setIsQuickCreateOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>Crear nuevo proyecto</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-7">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenDetail={handleOpenDetailModal}
                onEdit={handleOpenDetailModal}
                onDuplicate={handleDuplicateProject}
                onDelete={handleRequestDelete}
                onToggleFavorite={handleToggleFavorite}
                onFilterByEmail={() => {}}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modals */}
      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        onCreate={handleCreateProject}
        existingEmails={existingEmails}
        categories={categories}
      />

      <ProjectDetailModal
        project={selectedProjectForDetail}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProjectForDetail(null);
        }}
        onUpdate={handleUpdateProject}
        onDelete={handleRequestDelete}
        onDuplicate={handleDuplicateProject}
        categories={categories}
        onAddCategory={handleAddCategory}
        existingEmails={existingEmails}
      />

      <DeleteConfirmModal
        project={projectToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleDeleteProject}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        projects={projects}
        onImportProjects={(imported) => setProjects(imported)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={(updated) => {
          setUserProfile(updated);
          // Also sync user name in HeroHeader if changed
          if (updated.name) {
            setUserName(updated.name.toUpperCase());
          }
        }}
      />

      <IntegrationsModal
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        currentPlan={userProfile.plan}
        onUpgrade={() => {
          setUserProfile(prev => ({ ...prev, plan: 'Premium Pro' }));
        }}
      />

    </div>
  );
}
