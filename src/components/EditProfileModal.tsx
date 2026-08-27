import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Contact, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Globe,
  Instagram,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const COUNTRIES = [
  'Argentina',
  'España',
  'México',
  'Colombia',
  'Chile',
  'Perú',
  'Estados Unidos',
  'Uruguay',
  'Ecuador',
  'Bolivia',
  'Paraguay',
  'Venezuela',
  'Costa Rica',
  'Panamá',
  'Guatemala',
  'República Dominicana',
  'Otro país'
];

const COUNTRY_CODES = [
  { code: 'AR +54', label: 'Argentina (+54)' },
  { code: 'ES +34', label: 'España (+34)' },
  { code: 'MX +52', label: 'México (+52)' },
  { code: 'CO +57', label: 'Colombia (+57)' },
  { code: 'CL +56', label: 'Chile (+56)' },
  { code: 'PE +51', label: 'Perú (+51)' },
  { code: 'US +1', label: 'Estados Unidos (+1)' },
  { code: 'UY +598', label: 'Uruguay (+598)' },
  { code: 'EC +593', label: 'Ecuador (+593)' }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Synchronize when opening
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setSaveStatus(null);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleDiscard = () => {
    setFormData({ ...profile });
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleSave = () => {
    // Generate initials for avatar from name
    const initials = formData.name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(part => part[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'AA';

    const updatedProfile: UserProfile = {
      ...formData,
      avatarText: initials
    };

    onSaveProfile(updatedProfile);
    setSaveStatus('Guardado con éxito');
    setTimeout(() => {
      setSaveStatus(null);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150 max-h-[94vh] transition-colors">
        
        {/* Top Header & Breadcrumb */}
        <div className="px-5 sm:px-8 pt-6 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} className="stroke-[2.5]" />
              <span>VOLVER</span>
            </button>
            <span className="text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              MI CUENTA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Editar Perfil
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Gestiona tu información personal, contacto y seguridad.
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-4 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* Card 1: Avatar Profile Header */}
          <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md ring-4 ring-purple-100 dark:ring-purple-950/60">
                {formData.avatarText || 'AA'}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer transition-colors"
                title="Cambiar foto de perfil"
              >
                <Camera size={14} className="stroke-[2.5]" />
              </button>
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {formData.name || 'a a'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono truncate">
                {formData.email || 'fihife4765@kolsea.com'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                PNG, JPG o WEBP · máx 8 MB
              </p>
            </div>
          </div>

          {/* Card 2: Información Personal */}
          <div className="p-5 sm:p-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Contact size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Información Personal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Datos con los que te identificamos en la plataforma.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
              {/* Nombre completo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" />
                  <span>Nombre completo</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre y apellido"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nombre@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  <span>Teléfono (opcional)</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.phoneCountryCode}
                    onChange={(e) => setFormData({ ...formData, phoneCountryCode: e.target.value })}
                    className="px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="dark:bg-slate-900">{c.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="1234567890"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      formData.phone && formData.phone.length < 7 
                        ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                    } bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 font-mono`}
                  />
                </div>
                {formData.phone && formData.phone.length < 7 ? (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">
                    Formato de teléfono inválido
                  </p>
                ) : null}
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Ingresa solo el número sin el código del país
                </p>
              </div>

              {/* Usuario de Instagram */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Instagram size={13} className="text-slate-400" />
                  <span>Usuario de Instagram (opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-mono text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={formData.instagram.replace(/^@/, '')}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace(/^@/, '') })}
                    placeholder="tuusuario"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Solo el nombre de usuario, sin @ ni la URL completa
                </p>
              </div>

              {/* País */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe size={13} className="text-slate-400" />
                  <span>País</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="" className="dark:bg-slate-900">Selecciona tu país</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="dark:bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Card 3: Cambiar Contraseña */}
          <div className="p-5 sm:p-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Shield size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cambiar Contraseña
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Deja estos campos vacíos si no deseas cambiar tu contraseña
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
              
              {/* Nueva contraseña */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu nueva contraseña"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Action Footer Bar */}
        <div className="px-5 sm:px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Check size={16} className="stroke-[3]" />
            <span>{saveStatus || 'Todo al día'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#A78BFA] to-[#C084FC] hover:from-[#9333EA] hover:to-[#A855F7] shadow-md shadow-purple-500/20 hover:shadow-lg transition-all cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
