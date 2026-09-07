import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  Layers, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';
import { VerifyEmailView } from './VerifyEmailView';
import { ForgotPasswordView } from './ForgotPasswordView';
import { ResetPasswordView } from './ResetPasswordView';
import { AuthUser, AuthView } from '../../types';
import { ThemeMode } from '../../utils/storage';

interface AuthPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  themeMode,
  onToggleTheme
}) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Handle Google OAuth Authentication
  const handleGoogleAuth = () => {
    // In preview environment, simulate Google Identity OAuth consent popup
    const googleUser: AuthUser = {
      id: `google-${Date.now()}`,
      name: 'Klaus Bauer',
      username: 'klausbauer10x',
      email: 'klausbauer10x@gmail.com',
      avatarText: 'K',
      avatarUrl: '',
      provider: 'google',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(googleUser);
  };

  // Handle Apple ID Authentication
  const handleAppleAuth = () => {
    // In preview environment, simulate Apple Sign In
    const appleUser: AuthUser = {
      id: `apple-${Date.now()}`,
      name: 'Usuario Apple',
      username: 'apple_user',
      email: 'agencialt.ia@gmail.com',
      avatarText: 'A',
      avatarUrl: '',
      provider: 'apple',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(appleUser);
  };

  // Handle Guest Demo mode
  const handleGuestDemo = () => {
    const demoUser: AuthUser = {
      id: `demo-${Date.now()}`,
      name: 'Invitado Demo',
      username: 'demo_user',
      email: 'demo@masterapp.ai',
      avatarText: 'D',
      provider: 'email',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(demoUser);
  };

  const handlePendingVerification = (email: string, name: string) => {
    setPendingEmail(email);
    setPendingName(name);
    setCurrentView('verify_email');
  };

  const handleProceedToReset = (email: string) => {
    setResetEmail(email);
    setCurrentView('reset_password');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Top Simple Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 select-none">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-2 shadow-md shadow-blue-500/20 flex items-center justify-center text-white shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <rect x="2.5" y="2.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.95" />
              <rect x="14.5" y="2.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.75" />
              <rect x="2.5" y="14.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.75" />
              <rect x="14.5" y="14.5" width="7" height="7" rx="2" fill="white" fillOpacity="0.95" />
              <circle cx="12" cy="12" r="2.5" fill="#67e8f9" />
            </svg>
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none block">
              Master App
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
              Centro de Proyectos IA
            </span>
          </div>
        </div>

        {/* Right Tools: Language & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold px-2 py-1 select-none">
            <span>ES</span>
            <Globe size={14} />
          </div>

          <button
            onClick={onToggleTheme}
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-amber-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all cursor-pointer border border-slate-200/80 dark:border-slate-800"
            title={themeMode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {themeMode === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in-95 duration-150">
            {currentView === 'login' && (
              <LoginView
                onSuccess={onLoginSuccess}
                onNavigate={setCurrentView}
                onGoogleLogin={handleGoogleAuth}
                onAppleLogin={handleAppleAuth}
                onGuestDemo={handleGuestDemo}
              />
            )}

            {currentView === 'register' && (
              <RegisterView
                onNavigate={setCurrentView}
                onGoogleRegister={handleGoogleAuth}
                onAppleRegister={handleAppleAuth}
                onPendingVerificationCreated={handlePendingVerification}
              />
            )}

            {currentView === 'verify_email' && (
              <VerifyEmailView
                email={pendingEmail}
                name={pendingName}
                onSuccess={onLoginSuccess}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'forgot_password' && (
              <ForgotPasswordView
                onNavigate={setCurrentView}
                onProceedToReset={handleProceedToReset}
              />
            )}

            {currentView === 'reset_password' && (
              <ResetPasswordView
                email={resetEmail || pendingEmail}
                onSuccess={onLoginSuccess}
                onNavigate={setCurrentView}
              />
            )}
          </div>

          {/* Trust badges footer */}
          <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-slate-400 dark:text-slate-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Shield size={13} className="text-emerald-500" />
              <span>Conexión Segura SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-blue-500" />
              <span>Verificación de Correo</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
