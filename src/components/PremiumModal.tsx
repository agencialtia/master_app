import React from 'react';
import { X, Crown, Check, Zap, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpgrade
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-amber-200 shadow-inner">
              <Crown size={26} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                Plan PRO Unlimited
              </span>
              <h2 className="text-xl font-black mt-1">Actualizar a Premium</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Plan Benefits */}
        <div className="p-6 sm:p-8 space-y-4 text-slate-800 dark:text-slate-200">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Acceso Completo</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">$19 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ mes</span></div>
            </div>
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
              Recomendado
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              'Proyectos y cuentas ilimitadas',
              'Sincronización multi-dispositivo en la nube',
              'Integración directa con Google AI Studio, Claude y Cursor',
              'Exportación y respaldos automáticos encriptados',
              'Soporte prioritario 24/7'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onUpgrade();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Crown size={15} />
            <span>Activar Plan Premium</span>
          </button>
        </div>

      </div>
    </div>
  );
};
