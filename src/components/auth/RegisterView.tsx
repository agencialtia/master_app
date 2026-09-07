import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { AuthUser, AuthView } from '../../types';
import { 
  getRegisteredUsers, 
  saveRegisteredUsers, 
  setPendingVerification, 
  generateVerificationCode, 
  generateToken 
} from '../../utils/authStorage';

interface RegisterViewProps {
  onNavigate: (view: AuthView) => void;
  onGoogleRegister: () => void;
  onAppleRegister: () => void;
  onPendingVerificationCreated: (email: string, name: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onNavigate,
  onGoogleRegister,
  onAppleRegister,
  onPendingVerificationCreated
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate suggested username from name if not filled
  const handleNameChange = (val: string) => {
    setName(val);
    if (!username) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
      setUsername(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase() || cleanEmail.split('@')[0];

    if (!cleanName) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing && existing.emailVerified) {
        setError('Este correo ya está registrado. Por favor inicia sesión.');
        setIsLoading(false);
        return;
      }

      // Generate verification code and token
      const code = generateVerificationCode();
      const token = generateToken();

      // Save pending verification
      setPendingVerification({
        email: cleanEmail,
        name: cleanName,
        username: cleanUsername,
        passwordHash: password,
        code,
        token,
        sentAt: new Date().toISOString()
      });

      // Also store user in registered pool with emailVerified: false
      const newStoredUser = {
        id: `user-${Date.now()}`,
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        avatarText: cleanName[0].toUpperCase(),
        provider: 'email' as const,
        emailVerified: false,
        passwordHash: password,
        createdAt: new Date().toISOString()
      };

      const updatedUsers = users.filter(u => u.email.toLowerCase() !== cleanEmail);
      saveRegisteredUsers([newStoredUser, ...updatedUsers]);

      setIsLoading(false);
      onPendingVerificationCreated(cleanEmail, cleanName);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Crear Cuenta
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Comienza a organizar y gestionar todos tus proyectos de IA
        </p>
      </div>

      {/* Social Auth Providers */}
      <SocialAuthButtons
        onGoogleAuth={onGoogleRegister}
        onAppleAuth={onAppleRegister}
        isLoading={isLoading}
        actionText="register"
      />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-semibold tracking-wider">
            o con tu correo
          </span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Nombre Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <User size={16} />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Klaus Bauer"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail size={16} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="nombre@ejemplo.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Password & Confirmation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mín. 6 car."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir contraseña"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security Info notice */}
        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            Al crear tu cuenta, te enviaremos un enlace de verificación a tu correo para activar y confirmar tu acceso.
          </span>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
            />
            <span className="text-[11px]">
              Acepto los términos de servicio y políticas de privacidad
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Registrarse y Enviar Enlace</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Login Link */}
      <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};
