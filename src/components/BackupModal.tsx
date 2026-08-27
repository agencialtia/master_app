import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Project } from '../types';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onImportProjects: (imported: Project[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  projects,
  onImportProjects
}) => {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleExportDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `master-app-hub-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(projects, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJson = () => {
    if (!jsonText.trim()) {
      setImportStatus({ type: 'error', message: 'Por favor pega el contenido JSON para importar.' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('El formato JSON debe ser una lista de proyectos.');
      }
      
      // Basic validation
      const validProjects = parsed.filter(p => p && typeof p === 'object' && p.name && p.email);
      if (validProjects.length === 0) {
        throw new Error('No se encontraron proyectos válidos con nombre y correo.');
      }

      onImportProjects(validProjects);
      setImportStatus({ 
        type: 'success', 
        message: `¡Éxito! Se importaron ${validProjects.length} proyectos correctamente.` 
      });
      setTimeout(() => {
        onClose();
        setImportStatus(null);
        setJsonText('');
      }, 1500);
    } catch (err: any) {
      setImportStatus({ 
        type: 'error', 
        message: err.message || 'Error al procesar el archivo JSON.' 
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        if (event.target?.result) {
          setJsonText(event.target.result as string);
        }
      };
    }
  };

  const handleResetSampleData = () => {
    if (window.confirm('¿Restablecer proyectos con los datos de ejemplo iniciales?')) {
      onImportProjects(SAMPLE_PROJECTS);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Copia de Seguridad y Datos</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Exporta, importa o guarda un respaldo de tus proyectos</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-800 dark:text-slate-200">
          
          {/* Export section */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
              Exportar tus proyectos ({projects.length} registrados)
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Download size={15} />
                <span>Descargar archivo JSON</span>
              </button>
              <button
                onClick={handleCopyJson}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {copied ? <Check size={15} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={15} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
              Importar / Restaurar datos
            </h4>
            
            <div className="mb-3">
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
                Cargar archivo .JSON o pegar texto:
              </label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/70 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer mb-2"
              />
              <textarea
                rows={4}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Pega aquí el código JSON..."
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>

            {importStatus && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 mb-3 ${
                importStatus.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}>
                {importStatus.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                <span>{importStatus.message}</span>
              </div>
            )}

            <button
              onClick={handleImportJson}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <Upload size={15} />
              <span>Importar proyectos</span>
            </button>
          </div>

          {/* Reset to Sample Data */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">¿Quieres recargar los proyectos de demostración?</span>
            <button
              onClick={handleResetSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-lg font-medium cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Restablecer demo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
