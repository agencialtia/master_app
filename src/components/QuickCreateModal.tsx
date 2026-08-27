import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Mail, 
  Globe, 
  FileText, 
  PlusCircle,
  FolderPlus
} from 'lucide-react';
import { Project, PRESET_PLATFORMS, ProjectStatus, DEFAULT_SUGGESTED_EMAILS } from '../types';
import { PlatformBadge } from './PlatformBadge';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, openDetailAfter?: boolean) => void;
  existingEmails: string[];
  categories: string[];
}

const PRIMARY_PLATFORMS = [
  { name: 'Google AI Studio', label: 'Google AI Studio', defaultUrl: 'https://aistudio.google.com' },
  { name: 'Trae', label: 'Trae (tra.ai)', defaultUrl: 'https://trae.ai' },
  { name: 'Claude', label: 'Claude', defaultUrl: 'https://claude.ai' },
  { name: 'Base44', label: 'Base44', defaultUrl: 'https://base44.com' },
  { name: 'Cursor', label: 'Cursor', defaultUrl: 'https://cursor.com' },
  { name: 'Lovable', label: 'Lovable', defaultUrl: 'https://lovable.dev' },
  { name: 'Bolt', label: 'Bolt.new', defaultUrl: 'https://bolt.new' },
  { name: 'Otra', label: 'Otra plataforma...' }
];

const BANNED_EMAILS = ['sebastian.ai.lab@gmail.com', 'dev.enterprise@company.com'];

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingEmails,
  categories
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('Google AI Studio');
  const [customPlatform, setCustomPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<ProjectStatus>('Activo');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddEmailInput, setShowAddEmailInput] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const allSuggestedEmails = Array.from(new Set([
    ...DEFAULT_SUGGESTED_EMAILS,
    ...existingEmails
  ])).filter(email => email && !BANNED_EMAILS.includes(email.toLowerCase().trim()));

  useEffect(() => {
    if (isOpen) {
      setName('');
      if (allSuggestedEmails.length > 0) {
        setEmail(allSuggestedEmails[0]);
      } else {
        setEmail('');
      }
      setPlatform('Google AI Studio');
      setCustomPlatform('');
      setUrl('');
      setCategory('General');
      setStatus('Activo');
      setDescription('');
      setNotes('');
      setShowAddEmailInput(false);
      setNewEmailInput('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'El nombre del proyecto es obligatorio.';
    }
    if (!email.trim()) {
      newErrors.email = 'El correo o cuenta asociada es obligatoria.';
    } else if (!email.includes('@')) {
      newErrors.email = 'Ingresa un correo válido (ej: usuario@gmail.com).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectPlatform = (platName: string) => {
    setPlatform(platName);
    const matched = PRIMARY_PLATFORMS.find(p => p.name.toLowerCase() === platName.toLowerCase()) ||
                    PRESET_PLATFORMS.find(p => p.name.toLowerCase() === platName.toLowerCase());
    if (!url && matched?.defaultUrl) {
      setUrl(matched.defaultUrl);
    }
  };

  const handleAddNewEmail = () => {
    if (newEmailInput.trim() && newEmailInput.includes('@')) {
      setEmail(newEmailInput.trim().toLowerCase());
      setNewEmailInput('');
      setShowAddEmailInput(false);
      if (errors.email) setErrors({ ...errors, email: undefined });
    }
  };

  const handleSubmit = (openDetail: boolean = false) => {
    if (!validate()) return;

    const finalPlatform = platform === 'Otra' && customPlatform.trim() 
      ? customPlatform.trim() 
      : platform;

    onCreate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      platform: finalPlatform,
      url: url.trim(),
      status,
      category,
      description: description.trim(),
      notes: notes.trim(),
      relatedLinks: [],
      tags: [],
      favorite: false
    }, openDetail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Nuevo proyecto
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Guarda tus proyectos y organízalos por correo y plataforma
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          
          {/* 1. Nombre del proyecto */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">
              Nombre del proyecto <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Ej: SCREENOS, NeuroFlow AI, PromptCraft..."
              autoFocus
              className={`w-full px-3 py-2 sm:py-2.5 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20 bg-rose-50/30 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300' 
                  : 'border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* 2. Correo / Cuenta Asociada (Suggested + Custom Add) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                Correo / Cuenta asociada <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddEmailInput(!showAddEmailInput)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle size={12} />
                <span>{showAddEmailInput ? 'Ocultar' : 'Agregar otro correo'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 mb-2">
              <Mail size={15} className="text-slate-400 dark:text-slate-500 ml-1 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="ejemplo@gmail.com"
                className="w-full text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none bg-transparent"
              />
            </div>

            {showAddEmailInput && (
              <div className="flex gap-1.5 p-2 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 mb-2 animate-in fade-in">
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder="Escribe la nueva cuenta de correo..."
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

            {/* Suggested emails chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Sugeridos:
              </span>
              {allSuggestedEmails.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    setEmail(em);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    email === em 
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-bold shadow-xs' 
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* 3. PLATAFORMA DE ORIGEN (Google AI Studio, Trae, Claude, Base44) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Plataforma de origen
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {PRIMARY_PLATFORMS.map((plat) => {
                const isSelected = platform.toLowerCase() === plat.name.toLowerCase();
                return (
                  <button
                    key={plat.name}
                    type="button"
                    onClick={() => handleSelectPlatform(plat.name)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20' 
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
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

            {platform === 'Otra' && (
              <input
                type="text"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="Escribe el nombre de la plataforma..."
                className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          {/* 4. Enlace directo (URL) - Totally Editable */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">
              Enlace directo / URL del proyecto
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
            />
          </div>

          {/* 5. Estado y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Estado: Activo / Inactivo / Pausado */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Estado del proyecto
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatus('Activo')}
                  className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    status === 'Activo'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="truncate">Activo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Inactivo')}
                  className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    status === 'Inactivo'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/20 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                  <span className="truncate">Inactivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Pausado')}
                  className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    status === 'Pausado'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="truncate">Pausado</span>
                </button>
              </div>
            </div>

            {/* Categoría: Dropdown Menu */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* 6. Observaciones */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText size={13} className="text-slate-500 dark:text-slate-400" />
              <span>Observaciones</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones, accesos o anotaciones del proyecto..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Guardar proyecto</span>
          </button>
        </div>

      </div>
    </div>
  );
};
