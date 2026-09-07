import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Project } from '../types';

interface DeleteConfirmModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  project,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const isConfirmed = confirmText.trim().toUpperCase() === 'OK';

  const handleDelete = () => {
    if (isConfirmed) {
      onConfirm(project.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-rose-100 dark:border-rose-950/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">¿Eliminar proyecto?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-2 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
            <div className="text-slate-500 dark:text-slate-400">Proyecto a eliminar:</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{project.name}</div>
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">Cuenta: {project.email}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Para confirmar, escribe <strong className="text-rose-600 dark:text-rose-400 font-black">OK</strong> en el recuadro:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Escribe OK"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-center tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 uppercase"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              isConfirmed
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Trash2 size={14} />
            <span>Eliminar definitivamente</span>
          </button>
        </div>

      </div>
    </div>
  );
};
