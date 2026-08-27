import { Project } from '../types';

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'SCREENOS',
    email: 'klausbauer10x@gmail.com',
    platform: 'Google AI Studio',
    url: 'https://ais-dev-kzzvwdddtorkfuytvslg2r-456480177321.us-west1.run.app',
    status: 'Activo',
    category: 'Productividad',
    description: 'Sistema operativo visual web y gestor de pantallas multi-tarea desarrollado en AI Studio.',
    notes: 'Proyecto principal en AI Studio. Utiliza Gemini 2.5 Flash para asistencia interactiva y widgets dinámicos.',
    relatedLinks: [
      { id: 'l-1', label: 'Consola AI Studio', url: 'https://aistudio.google.com' },
      { id: 'l-2', label: 'GitHub Repositorio', url: 'https://github.com/klausbauer/screenos' }
    ],
    tags: ['AI Studio', 'Productividad', 'Dashboard'],
    favorite: true,
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-23T18:00:00Z'
  },
  {
    id: 'proj-2',
    name: 'AdOptimizer AI',
    email: 'klausbauer10x@gmail.com',
    platform: 'Google AI Studio',
    url: 'https://adoptimizer.app',
    status: 'Activo',
    category: 'Marketing & Ventas',
    description: 'Optimizador y generador de copies, creativos y análisis de anuncios de Meta y Google Ads.',
    notes: 'Cuenta vinculada a Google AI Studio Pro. Integra módulo AdOptimizer Academy para clases y prompts.',
    relatedLinks: [
      { id: 'l-3', label: 'Landing Page', url: 'https://adoptimizer.app' },
      { id: 'l-4', label: 'Figma UI Mockup', url: 'https://figma.com' }
    ],
    tags: ['Marketing', 'Ads', 'Copys'],
    favorite: true,
    createdAt: '2026-08-15T09:15:00Z',
    updatedAt: '2026-08-22T16:45:00Z'
  },
  {
    id: 'proj-3',
    name: 'NeuroFlow Medical AI',
    email: 'klaus.bauer@quilicurasalud.cl',
    platform: 'Cursor',
    url: 'https://github.com/sebastian-lab/neuroflow-ai',
    status: 'Pausado',
    category: 'Salud',
    description: 'Asistente de triaje clínico y resumen de expedientes médicos usando modelos multimodales.',
    notes: 'Desarrollado en Cursor con reglas de TypeScript y Tailwind. Requiere acceso con cuenta autorizada.',
    relatedLinks: [
      { id: 'l-5', label: 'Repositorio Cursor', url: 'https://github.com/sebastian-lab/neuroflow-ai' },
      { id: 'l-6', label: 'Documentación API', url: 'https://docs.neuroflow.internal' }
    ],
    tags: ['Salud', 'Multimodal', 'Cursor'],
    favorite: false,
    createdAt: '2026-07-28T11:20:00Z',
    updatedAt: '2026-08-21T10:15:00Z'
  },
  {
    id: 'proj-4',
    name: 'DocuMind Research Hub',
    email: 'kbauergrandon@gmail.com',
    platform: 'Claude',
    url: 'https://claude.ai/chat/documind-hub',
    status: 'Activo',
    category: 'Investigación',
    description: 'Espacio de trabajo y artefactos para síntesis de papers científicos y extracción de citas en PDF.',
    notes: 'Proyecto en Claude Artifacts. Contiene prompts de análisis metodológico y revisión por pares.',
    relatedLinks: [
      { id: 'l-7', label: 'Proyecto Claude.ai', url: 'https://claude.ai' }
    ],
    tags: ['Investigación', 'PDFs', 'Claude'],
    favorite: true,
    createdAt: '2026-08-01T16:00:00Z',
    updatedAt: '2026-08-20T12:30:00Z'
  },
  {
    id: 'proj-5',
    name: 'SaaS Billing & Portal',
    email: 'agencialt.ia@gmail.com',
    platform: 'Lovable',
    url: 'https://lovable.dev/projects/saas-billing-portal',
    status: 'Inactivo',
    category: 'Negocios',
    description: 'Portal de suscripciones Stripe y facturación automática para clientes B2B.',
    notes: 'Desplegado en producción. Gestionado desde la cuenta agencialt.ia@gmail.com.',
    relatedLinks: [
      { id: 'l-8', label: 'Lovable App', url: 'https://lovable.dev' },
      { id: 'l-9', label: 'Stripe Dashboard', url: 'https://dashboard.stripe.com' }
    ],
    tags: ['Stripe', 'Fintech', 'Lovable'],
    favorite: false,
    createdAt: '2026-06-12T08:00:00Z',
    updatedAt: '2026-08-18T19:00:00Z'
  },
  {
    id: 'proj-6',
    name: 'PromptCraft Builder',
    email: 'carla.gpt.ia@gmail.com',
    platform: 'Bolt',
    url: 'https://bolt.new/p/promptcraft-studio',
    status: 'Pausado',
    category: 'Productividad',
    description: 'Generador y evaluador de prompts encadenados (Few-Shot & CoT) con métricas de costo.',
    notes: 'Pausado temporalmente para migrar el motor a Google AI Studio con Gemini 2.5 Flash.',
    relatedLinks: [
      { id: 'l-10', label: 'Bolt.new Demo', url: 'https://bolt.new' }
    ],
    tags: ['Prompts', 'Bolt', 'Tools'],
    favorite: false,
    createdAt: '2026-07-10T13:45:00Z',
    updatedAt: '2026-08-05T14:20:00Z'
  },
  {
    id: 'proj-7',
    name: 'Trae Flow Engine',
    email: 'leonartificial67@gmail.com',
    platform: 'Trae',
    url: 'https://trae.ai/workspaces/flow-engine',
    status: 'Activo',
    category: 'Desarrollo & APIs',
    description: 'Editor de flujos de automatización para pipelines de modelos LLM locales y remotos.',
    notes: 'Construido en Trae IDE. Sincronizado con cuenta de GitHub.',
    relatedLinks: [
      { id: 'l-11', label: 'Workspace Trae', url: 'https://trae.ai' }
    ],
    tags: ['Pipelines', 'Trae', 'Dev'],
    favorite: false,
    createdAt: '2026-08-18T17:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  }
];
