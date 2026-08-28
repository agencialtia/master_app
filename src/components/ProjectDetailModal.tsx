import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Save, 
  Trash2, 
  Copy, 
  Check, 
  Mail, 
  Calendar, 
  Clock, 
  Plus, 
  Globe, 
  Link as LinkIcon, 
  Edit3, 
  CheckCircle,
  CopyPlus,
  FileText,
  Boxes,
  Activity,
  PlusCircle,
  Star
} from 'lucide-react';
import { 
  Project, 
  ProjectStatus, 
  PRESET_PLATFORMS, 
  RelatedLink, 
  STATUS_CONFIG, 
  DEFAULT_CATEGORIES,
  DEFAULT_SUGGESTED_EMAILS 
} from '../types';
import { PlatformBadge } from './PlatformBadge';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProject: Project) => void;
  onDelete: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  existingEmails: string[];
}

const PRIMARY_PLATFORMS = [
  { name: 'Google AI Studio', label: 'Google AI Studio', icon: 'Sparkles', defaultUrl: 'https://aistudio.google.com' },
  { name: 'Trae', label: 'Trae (tra.ai)', icon: 'Boxes', defaultUrl: 'https://trae.ai' },
  { name: 'Claude', label: 'Claude', icon: 'Bot', defaultUrl: 'https://claude.ai' },
  { name: 'Base44', label: 'Base44', icon: 'Cpu', defaultUrl: 'https://base44.com' },
  { name: 'Cursor', label: 'Cursor', icon: 'Code2', defaultUrl: 'https://cursor.com' },
  { name: 'Lovable', label: 'Lovable', icon: 'HeartHandshake', defaultUrl: 'https://lovable.dev' },
  { name: 'Bolt', label: 'Bolt.new', icon: 'Zap', defaultUrl: 'https://bolt.new' },
  { name: 'Otra', label: 'Otra plataforma...', icon: 'Globe' }
];

const BANNED_EMAILS = ['sebastian.ai.lab@gmail.com', 'dev.enterprise@company.com'];

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  categories,
  onAddCategory,
  existingEmails
}) => {
  const [formData, setFormData] = useState<Project | null>(null);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddEmailInput, setShowAddEmailInput] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
      setNewCategoryInput('');
      setShowAddCategory(false);
      setShowAddEmailInput(false);
      setNewEmailInput('');
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  }, [project, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    const updated: Project = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      platform: formData.platform === 'Otra' && formData.customPlatform?.trim() 
        ? formData.customPlatform.trim() 
        : formData.platform,
      url: formData.url.trim(),
      updatedAt: new Date().toISOString()
    };
    onUpdate(updated);
    onClose();
  };

  const handleSelectPlatform = (platName: string) => {
    const matched = PRESET_PLATFORMS.find(p => p.name.toLowerCase() === platName.toLowerCase()) || 
                    PRIMARY_PLATFORMS.find(p => p.name.toLowerCase() === platName.toLowerCase());
    const updated: Project = {
      ...formData,
      platform: platName,
      url: (!formData.url && matched?.defaultUrl) ? matched.defaultUrl : formData.url,
      updatedAt: new Date().toISOString()
    };
    setFormData(updated);
    // Real-time automatic synchronization
    onUpdate(updated);
  };

  const handleSelectStatus = (newStatus: ProjectStatus) => {
    const updated: Project = {
      ...formData,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    setFormData(updated);
    // Real-time automatic synchronization
    onUpdate(updated);
  };

  const handleSelectEmail = (selectedEmail: string) => {
    const updated: Project = {
      ...formData,
      email: selectedEmail,
      updatedAt: new Date().toISOString()
    };
    setFormData(updated);
    setShowAddEmailInput(false);
    onUpdate(updated);
  };

  const handleAddNewEmail = () => {
    if (newEmailInput.trim() && newEmailInput.includes('@')) {
      const emailFormatted = newEmailInput.trim().toLowerCase();
      const updated: Project = {
        ...formData,
        email: emailFormatted,
        updatedAt: new Date().toISOString()
      };
      setFormData(updated);
      setNewEmailInput('');
      setShowAddEmailInput(false);
      onUpdate(updated);
    }
  };

  const handleAddRelatedLink = () => {
    if (!newLinkUrl.trim()) return;
    const label = newLinkLabel.trim() || 'Enlace';
    let formattedUrl = newLinkUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink: RelatedLink = {
      id: `link-${Date.now()}`,
      label,
      url: formattedUrl
    };

    const updated: Project = {
      ...formData,
      relatedLinks: [...(formData.relatedLinks || []), newLink],
      updatedAt: new Date().toISOString()
    };
    setFormData(updated);
    onUpdate(updated);
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const handleRemoveRelatedLink = (linkId: string) => {
    const updated: Project = {
      ...formData,
      relatedLinks: (formData.relatedLinks || []).filter(l => l.id !== linkId),
      updatedAt: new Date().toISOString()
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleCreateNewCategory = () => {
    if (newCategoryInput.trim()) {
      onAddCategory(newCategoryInput.trim());
      const updated: Project = {
        ...formData,
        category: newCategoryInput.trim(),
        updatedAt: new Date().toISOString()
      };
      setFormData(updated);
      onUpdate(updated);
      setNewCategoryInput('');
      setShowAddCategory(false);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(formData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyUrl = () => {
    if (formData.url) {
      navigator.clipboard.writeText(formData.url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleOpenMainUrl = () => {
    if (formData.url && formData.url.trim()) {
      let target = formData.url.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = `https://${target}`;
      }
      
      // Real-time synchronization
      const updated: Project = {
        ...formData,
        url: target,
        updatedAt: new Date().toISOString()
      };
      setFormData(updated);
      onUpdate(updated);

      // Open in a new tab / window cleanly
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

  const statusInfo = STATUS_CONFIG[formData.status] || STATUS_CONFIG['Activo'];

  // Combine unique suggested emails excluding banned ones
  const allSuggestedEmails = Array.from(new Set([
    ...DEFAULT_SUGGESTED_EMAILS,
    ...existingEmails
  ])).filter(email => email && !BANNED_EMAILS.includes(email.toLowerCase().trim()));

  const displayPlatform = formData.platform === 'Otra' && formData.customPlatform?.trim() 
    ? formData.customPlatform.trim() 
    : formData.platform;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col gap-2.5">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <PlatformBadge platform={displayPlatform} size="md" />
              
              {/* Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${statusInfo.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}></span>
                <span>{formData.status}</span>
              </span>

              {/* Favorite Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  const updated: Project = {
                    ...formData,
                    favorite: !formData.favorite,
                    updatedAt: new Date().toISOString()
                  };
                  setFormData(updated);
                  onUpdate(updated);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer border ${
                  formData.favorite
                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-600 hover:border-amber-300'
                }`}
                title={formData.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Star size={12} className={formData.favorite ? 'fill-amber-400 text-amber-500' : ''} />
                <span>{formData.favorite ? 'Favorito' : 'Marcar favorito'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {savedNotice && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md animate-in fade-in">
                  <CheckCircle size={13} />
                  Guardado
                </span>
              )}

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Project Name Editable Input */}
          <div className="min-w-0">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del proyecto..."
              className="w-full text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white tracking-tight bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 px-2 py-1 -ml-2 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Requirement 1: ACCESO DIRECTO AL PROYECTO (100% Editable Link) */}
          <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={13} className="stroke-[2.5]" />
                ACCESO DIRECTO AL PROYECTO
              </span>
              
              {formData.url && (
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 font-semibold cursor-pointer"
                  title="Copiar enlace"
                >
                  {copiedUrl ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <Check size={12} /> Copiado
                    </span>
                  ) : (
                    <>
                      <Copy size={12} /> Copiar URL
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Fully Editable URL Input Field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    const updated = { ...formData, url: newUrl, updatedAt: new Date().toISOString() };
                    setFormData(updated);
                    onUpdate(updated);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleOpenMainUrl();
                    }
                  }}
                  placeholder="https://ais-dev-...run.app o URL del proyecto"
                  className="w-full text-xs sm:text-sm font-mono text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenMainUrl}
                disabled={!formData.url || !formData.url.trim()}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0 cursor-pointer ${
                  formData.url && formData.url.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>Abrir proyecto</span>
                <ExternalLink size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Requirement 2: CORREO / CUENTA ASOCIADA (Suggested + Custom Add) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  CORREO / CUENTA ASOCIADA <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddEmailInput(!showAddEmailInput)}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle size={12} />
                  <span>{showAddEmailInput ? 'Ocultar' : 'Escribir otro correo'}</span>
                </button>
              </div>

              {/* Current Selected Email Display & Input */}
              <div className="relative mb-2">
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Mail size={15} className="text-slate-400 dark:text-slate-500 ml-1 shrink-0" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ejemplo@gmail.com"
                    className="w-full text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded cursor-pointer shrink-0"
                    title="Copiar correo"
                  >
                    {copiedEmail ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Add New Email Input field (if toggled) */}
              {showAddEmailInput && (
                <div className="flex gap-1.5 p-2 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 mb-2 animate-in fade-in">
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="Ingresa nueva cuenta de correo..."
                    className="w-full px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewEmail}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                  >
                    Asignar
                  </button>
                </div>
              )}

              {/* Suggested Email Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Sugeridos:
                </span>
                {allSuggestedEmails.map((em) => {
                  const isSelected = formData.email === em;
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleSelectEmail(em)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-bold shadow-xs ring-1 ring-blue-400/30'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requirement 3: PLATAFORMA DE ORIGEN (Google AI Studio, Trae, Claude, Base44) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                PLATAFORMA DE ORIGEN
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRIMARY_PLATFORMS.map((plat) => {
                  const isSelected = (formData.platform || '').toLowerCase() === plat.name.toLowerCase();
                  return (
                    <button
                      key={plat.name}
                      type="button"
                      onClick={() => handleSelectPlatform(plat.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20' 
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-750'
                      }`}
                    >
                      <PlatformBadge 
                        platform={plat.name} 
                        size="sm" 
                        showIcon={true} 
                        className={isSelected ? 'bg-white/20 text-white border-0' : ''} 
                      />
                    </button>
                  );
                })}
              </div>

              {/* If 'Otra' or custom platform is selected */}
              {(formData.platform === 'Otra' || !PRIMARY_PLATFORMS.some(p => p.name === formData.platform)) && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={formData.customPlatform || (formData.platform !== 'Otra' ? formData.platform : '')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      platform: 'Otra',
                      customPlatform: e.target.value 
                    })}
                    placeholder="Escribe el nombre de la plataforma..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Requirement 4 & 5: ESTADO DEL PROYECTO & CATEGORÍA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Requirement 4: ESTADO DEL PROYECTO (Solo Activo, Inactivo, Pausado) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  ESTADO DEL PROYECTO
                </label>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {/* Activo Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectStatus('Activo')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'Activo'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">Activo</span>
                  </button>

                  {/* Inactivo Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectStatus('Inactivo')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'Inactivo'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                    <span className="truncate">Inactivo</span>
                  </button>

                  {/* Pausado Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectStatus('Pausado')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'Pausado'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="truncate">Pausado</span>
                  </button>
                </div>
              </div>

              {/* Requirement 5: CATEGORÍA (Dropdown menu + add) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    CATEGORÍA
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                  >
                    + Nueva
                  </button>
                </div>

                <div className="space-y-1.5">
                  <select
                    value={formData.category || 'General'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                    ))}
                  </select>

                  {showAddCategory && (
                    <div className="flex gap-1 pt-1 animate-in fade-in">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="Nombre de categoría..."
                        className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleCreateNewCategory}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                      >
                        Crear
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Descripción Breve */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                DESCRIPCIÓN DEL PROYECTO
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="¿De qué trata este proyecto o para qué fue creado?"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>

            {/* Requirement 6: OBSERVACIONES (Replaces Notas y Recordatorios) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText size={13} className="text-slate-500 dark:text-slate-400" />
                <span>OBSERVACIONES</span>
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => {
                  const updated = { ...formData, notes: e.target.value, updatedAt: new Date().toISOString() };
                  setFormData(updated);
                  onUpdate(updated);
                }}
                placeholder="Escribe observaciones, indicaciones clave, prompts de referencia o apuntes del proyecto..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs leading-relaxed"
              />
            </div>

          </div>

          {/* Timestamps Info */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 gap-2">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Creado: {formatDate(formData.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Modificado: {formatDate(formData.updatedAt)}</span>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onDuplicate(formData);
                onClose();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <CopyPlus size={13} />
              <span className="hidden sm:inline">Duplicar</span>
            </button>
            <button
              onClick={() => {
                onDelete(formData);
                onClose();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Cerrar
            </button>
            
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save size={14} />
              <span>Guardar cambios</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
