import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  User
} from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { AuthUser, AuthView } from '../../types';
import { getRegisteredUsers } from '../../utils/authStorage';

interface LoginViewProps {
  onSuccess: (user: AuthUser) => void;
  onNavigate: (view: AuthView) => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onGuestDemo: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigate,
  onGoogleLogin,
  onAppleLogin,
  onGuestDemo
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    if (!cleanIdentifier) {
      setError('Por favor ingresa tu correo electrónico o usuario');
      return;
    }
    if (!password) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      // Look for user matching email or username
      const matchedUser = users.find(u => 
        u.email.toLowerCase() === cleanIdentifier || 
        (u.username && u.username.toLowerCase() === cleanIdentifier)
      );

      if (matchedUser) {
        if (matchedUser.passwordHash && matchedUser.passwordHash !== password) {
          setError('Contraseña incorrecta. Por favor verifica tus credenciales.');
          setIsLoading(false);
          return;
        }

        const user: AuthUser = {
          id: matchedUser.id,
          name: matchedUser.name,
          username: matchedUser.username,
          email: matchedUser.email,
          avatarText: matchedUser.avatarText || matchedUser.name[0].toUpperCase(),
          provider: matchedUser.provider || 'email',
          emailVerified: matchedUser.emailVerified ?? true,
          createdAt: matchedUser.createdAt
        };
        setIsLoading(false);
        onSuccess(user);
      } else {
        // Allow instant sign-in or auto-create account for standard inputs
        const inferredName = cleanIdentifier.includes('@') 
          ? cleanIdentifier.split('@')[0].replace(/[._-]/g, ' ') 
          : cleanIdentifier;
        const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);

        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: formattedName || 'Usuario',
          username: cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : cleanIdentifier,
          email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@masterapp.ai`,
          avatarText: (formattedName[0] || 'U').toUpperCase(),
          provider: 'email',
          emailVerified: true,
          createdAt: new Date().toISOString()
        };
        setIsLoading(false);
        onSuccess(newUser);
      }
    }, 450);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Iniciar Sesión
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Ingresa a tu panel maestro de proyectos e integraciones IA
        </p>
      </div>

      {/* Social Auth Providers */}
      <SocialAuthButtons
        onGoogleAuth={onGoogleLogin}
        onAppleAuth={onAppleLogin}
        isLoading={isLoading}
        actionText="login"
      />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-semibold tracking-wider">
            o con usuario y contraseña
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Username */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Usuario o Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail size={16} />
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              placeholder="nombre@ejemplo.com o tu_usuario"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => onNavigate('forgot_password')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold hover:underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
            />
            <span>Recordar mi sesión en este dispositivo</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Iniciar Sesión</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Guest Demo button */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <button
          type="button"
          onClick={onGuestDemo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Sparkles size={13} className="text-amber-500" />
          <span>Acceder en Modo Demo Rápido</span>
        </button>
      </div>

      {/* Footer Register Link */}
      <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={() => onNavigate('register')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Regístrate gratis
        </button>
      </div>
    </div>
  );
};
