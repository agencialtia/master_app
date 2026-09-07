import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  ExternalLink, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  Inbox,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AuthUser, AuthView } from '../../types';
import { 
  getPendingVerification, 
  setPendingVerification, 
  getRegisteredUsers, 
  saveRegisteredUsers,
  generateVerificationCode,
  generateToken
} from '../../utils/authStorage';

interface VerifyEmailViewProps {
  email: string;
  name: string;
  onSuccess: (user: AuthUser) => void;
  onNavigate: (view: AuthView) => void;
}

export const VerifyEmailView: React.FC<VerifyEmailViewProps> = ({
  email,
  name,
  onSuccess,
  onNavigate
}) => {
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pendingData, setPendingData] = useState(() => getPendingVerification());

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const targetEmail = email || pendingData?.email || 'tu_correo@ejemplo.com';
  const targetName = name || pendingData?.name || 'Usuario';
  const expectedCode = pendingData?.code || '123456';

  const handleConfirmAccount = (providedCode?: string) => {
    setIsVerifying(true);
    setStatusMessage(null);

    setTimeout(() => {
      // Mark user as verified in registered users
      const users = getRegisteredUsers();
      let updatedUser: AuthUser;

      const existingIndex = users.findIndex(u => u.email.toLowerCase() === targetEmail.toLowerCase());
      if (existingIndex >= 0) {
        users[existingIndex] = {
          ...users[existingIndex],
          emailVerified: true
        };
        saveRegisteredUsers(users);
        updatedUser = {
          id: users[existingIndex].id,
          name: users[existingIndex].name,
          username: users[existingIndex].username,
          email: users[existingIndex].email,
          avatarText: users[existingIndex].avatarText || users[existingIndex].name[0].toUpperCase(),
          provider: 'email',
          emailVerified: true,
          createdAt: users[existingIndex].createdAt
        };
      } else {
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: targetName,
          username: targetEmail.split('@')[0],
          email: targetEmail,
          avatarText: targetName[0]?.toUpperCase() || 'U',
          provider: 'email',
          emailVerified: true,
          createdAt: new Date().toISOString()
        };
        saveRegisteredUsers([newUser, ...users]);
        updatedUser = newUser;
      }

      // Clear pending verification
      setPendingVerification(null);
      setIsVerifying(false);

      // Trigger success and enter app
      onSuccess(updatedUser);
    }, 600);
  };

  const handleResendEmail = () => {
    if (resendCooldown > 0) return;

    const newCode = generateVerificationCode();
    const newToken = generateToken();

    setPendingVerification({
      email: targetEmail,
      name: targetName,
      code: newCode,
      token: newToken,
      sentAt: new Date().toISOString()
    });

    setPendingData(getPendingVerification());
    setResendCooldown(30);
    setStatusMessage({
      type: 'success',
      text: '¡Enlace y código de confirmación reenviados a tu correo!'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Visual Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center mb-3.5 shadow-lg shadow-blue-500/25 relative animate-bounce">
          <Mail size={32} />
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <CheckCircle2 size={12} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Confirma tu Correo
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hemos enviado un enlace de confirmación a:
        </p>
        <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
          {targetEmail}
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={15} /> : <ShieldCheck size={15} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Interactive Email Confirmation Card (Simulación de Bandeja de Entrada) */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-850 dark:to-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-750">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Inbox size={13} className="text-blue-600 dark:text-blue-400" />
              Simulación de Correo Recibido
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Ahora mismo</span>
        </div>

        <div className="space-y-2.5">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Hola <strong className="text-slate-900 dark:text-white font-bold">{targetName}</strong>, haz clic en el enlace para activar tu cuenta y acceder a tu Master App Hub:
          </p>

          {/* Action Button that simulates clicking the link in the email */}
          <button
            type="button"
            onClick={() => handleConfirmAccount(expectedCode)}
            disabled={isVerifying}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ExternalLink size={16} />
                <span>Confirmar y Activar Cuenta Ahora</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alternative: PIN Code Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-2xs">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 text-center">
          O introduce el código PIN de 6 dígitos
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder={`Código: ${expectedCode}`}
            className="flex-1 text-center font-mono font-bold tracking-widest text-sm py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => handleConfirmAccount(code || expectedCode)}
            disabled={isVerifying}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            Verificar
          </button>
        </div>
      </div>

      {/* Resend link & back */}
      <div className="mt-5 space-y-3 text-center">
        <button
          type="button"
          onClick={handleResendEmail}
          disabled={resendCooldown > 0}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
        >
          <RotateCcw size={13} className={resendCooldown > 0 ? '' : 'animate-spin-once'} />
          <span>
            {resendCooldown > 0 
              ? `Reenviar correo en ${resendCooldown}s` 
              : '¿No recibiste el enlace? Reenviar correo'}
          </span>
        </button>

        <div>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Volver a Iniciar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
