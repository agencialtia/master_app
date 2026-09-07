import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AuthUser, AuthView } from '../../types';
import { getRegisteredUsers, saveRegisteredUsers } from '../../utils/authStorage';

interface ResetPasswordViewProps {
  email: string;
  onSuccess: (user: AuthUser) => void;
  onNavigate: (view: AuthView) => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  email,
  onSuccess,
  onNavigate
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      let updatedUser: AuthUser;

      if (userIndex >= 0) {
        users[userIndex].passwordHash = newPassword;
        users[userIndex].emailVerified = true;
        saveRegisteredUsers(users);
        updatedUser = {
          id: users[userIndex].id,
          name: users[userIndex].name,
          username: users[userIndex].username,
          email: users[userIndex].email,
          avatarText: users[userIndex].avatarText || users[userIndex].name[0].toUpperCase(),
          provider: users[userIndex].provider || 'email',
          emailVerified: true,
          createdAt: users[userIndex].createdAt
        };
      } else {
        const fallbackName = email.split('@')[0];
        const formatted = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: formatted,
          username: fallbackName,
          email: email,
          avatarText: formatted[0].toUpperCase(),
          provider: 'email',
          emailVerified: true,
          createdAt: new Date().toISOString()
        };
        saveRegisteredUsers([newUser, ...users]);
        updatedUser = newUser;
      }

      setIsLoading(false);
      onSuccess(updatedUser);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3 shadow-xs">
          <ShieldCheck size={28} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nueva Contraseña
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Crea una nueva contraseña segura para tu cuenta <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{email}</span>
        </p>
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
        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Nueva Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Mínimo 6 caracteres"
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

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Repite la nueva contraseña"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Guardar Contraseña e Ingresar</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
