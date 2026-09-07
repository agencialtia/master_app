import React, { useState } from 'react';
import { 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Inbox, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { AuthView } from '../../types';
import { getRegisteredUsers } from '../../utils/authStorage';

interface ForgotPasswordViewProps {
  onNavigate: (view: AuthView) => void;
  onProceedToReset: (email: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onNavigate,
  onProceedToReset
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 450);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3 shadow-xs">
          <KeyRound size={28} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recuperar Contraseña
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          {isSubmitted
            ? 'Hemos preparado las instrucciones de restablecimiento de contraseña.'
            : 'Ingresa tu correo registrado para enviarte un enlace de recuperación seguro.'}
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Enviar Enlace de Recuperación</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Simulated recovery email card */}
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-200/60 dark:border-amber-800/40">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Inbox size={13} />
                  Enlace Listo para Usar
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Ahora mismo</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3.5">
              Enviado a <strong className="text-slate-900 dark:text-white font-mono">{email}</strong>. Puedes hacer clic abajo para cambiar tu contraseña ahora mismo:
            </p>

            <button
              type="button"
              onClick={() => onProceedToReset(email)}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink size={16} />
              <span>Restablecer Mi Contraseña Ahora</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1 cursor-pointer"
          >
            ¿Ingresaste otro correo? Intentar nuevamente
          </button>
        </div>
      )}

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Volver a Iniciar Sesión</span>
        </button>
      </div>
    </div>
  );
};
