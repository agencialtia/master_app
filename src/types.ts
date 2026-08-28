export type ProjectStatus = 'Activo' | 'Inactivo' | 'Pausado';

export type PlatformType = 
  | 'Google AI Studio'
  | 'Cursor'
  | 'Claude'
  | 'Lovable'
  | 'Bolt'
  | 'Trae'
  | 'Base44'
  | 'v0 by Vercel'
  | 'Replit'
  | 'ChatGPT / OpenAI'
  | 'Windsurf'
  | 'GitHub Copilot'
  | 'Otra';

export interface RelatedLink {
  id: string;
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  email: string;
  platform: string;
  customPlatform?: string;
  url: string;
  status: ProjectStatus;
  category: string;
  description: string;
  notes: string;
  relatedLinks: RelatedLink[];
  tags: string[];
  favorite?: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'groupByEmail' | 'groupByPlatform' | 'compact';

export type SortOption = 'updatedDesc' | 'updatedAsc' | 'createdDesc' | 'nameAsc' | 'status';

export const DEFAULT_CATEGORIES = [
  'General',
  'Salud',
  'Negocios',
  'Productividad',
  'Educación',
  'Investigación',
  'Marketing & Ventas',
  'Desarrollo & APIs',
  'Personal',
  'Otro'
];

export const PRESET_PLATFORMS: { 
  name: string; 
  color: string; 
  bg: string; 
  border: string; 
  icon: string; 
  defaultUrl?: string 
}[] = [
  { name: 'Google AI Studio', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'Sparkles', defaultUrl: 'https://aistudio.google.com' },
  { name: 'Cursor', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', icon: 'Code2', defaultUrl: 'https://cursor.com' },
  { name: 'Claude', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'Bot', defaultUrl: 'https://claude.ai' },
  { name: 'Lovable', color: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200', icon: 'HeartHandshake', defaultUrl: 'https://lovable.dev' },
  { name: 'Bolt', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200', icon: 'Zap', defaultUrl: 'https://bolt.new' },
  { name: 'Trae', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'Boxes', defaultUrl: 'https://trae.ai' },
  { name: 'Base44', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'Cpu', defaultUrl: 'https://base44.com' },
  { name: 'ChatGPT / OpenAI', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', icon: 'MessageSquare', defaultUrl: 'https://chatgpt.com' },
  { name: 'v0 by Vercel', color: 'text-slate-800', bg: 'bg-slate-100', border: 'border-slate-300', icon: 'Layers', defaultUrl: 'https://v0.dev' },
  { name: 'Windsurf', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', icon: 'Compass', defaultUrl: 'https://codeium.com/windsurf' },
  { name: 'GitHub Copilot', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: 'GitBranch', defaultUrl: 'https://github.com' },
  { name: 'Replit', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: 'Terminal', defaultUrl: 'https://replit.com' },
  { name: 'Otra', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', icon: 'Globe' }
];

export const DEFAULT_TAGS = [
  'AI Studio',
  'Productividad',
  'Dashboard',
  'Marketing',
  'Salud',
  'Negocios',
  'Desarrollo',
  'Automatización',
  'Chatbot',
  'Finanzas'
];

export const STATUS_CONFIG: Record<ProjectStatus, { label: string; badgeClass: string; dotClass: string }> = {
  'Activo': {
    label: 'Activo',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  'Inactivo': {
    label: 'Inactivo',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-400'
  },
  'Pausado': {
    label: 'Pausado',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500'
  }
};

export const DEFAULT_SUGGESTED_EMAILS = [
  'klausbauer10x@gmail.com',
  'klaus.bauer@quilicurasalud.cl',
  'kbauergrandon@gmail.com',
  'agencialt.ia@gmail.com',
  'carla.gpt.ia@gmail.com',
  'leonartificial67@gmail.com'
];

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  instagram: string;
  country: string;
  plan: string;
  avatarText: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Klaus',
  email: 'klausbauer10x@gmail.com',
  phone: '',
  phoneCountryCode: 'CL +56',
  instagram: '',
  country: 'Chile',
  plan: 'Gratuito',
  avatarText: 'K'
};
