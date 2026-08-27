import { Project, DEFAULT_CATEGORIES, UserProfile, DEFAULT_USER_PROFILE } from '../types';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

const STORAGE_KEY = 'master_app_hub_projects_v1';
const CATEGORIES_KEY = 'master_app_hub_categories_v1';
const USERNAME_KEY = 'master_app_hub_username_v1';
const USER_PROFILE_KEY = 'adoptimizer_user_profile_v1';
const THEME_KEY = 'master_app_hub_theme_v1';

export type ThemeMode = 'light' | 'dark';

export function loadThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveThemeMode(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Error saving theme mode:', err);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    const profile = { ...DEFAULT_USER_PROFILE, ...parsed };
    if (!profile.phoneCountryCode || profile.phoneCountryCode === 'AR +54') {
      profile.phoneCountryCode = 'CL +56';
    }
    return profile;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Sanitize any legacy sample emails
      const sanitized = parsed.map((p: Project) => {
        let email = p.email || '';
        if (email.toLowerCase() === 'sebastian.ai.lab@gmail.com') {
          email = 'klaus.bauer@quilicurasalud.cl';
        } else if (email.toLowerCase() === 'dev.enterprise@company.com') {
          email = 'agencialt.ia@gmail.com';
        }
        return { ...p, email };
      });
      return sanitized;
    }
    return SAMPLE_PROJECTS;
  } catch (err) {
    console.error('Error loading projects from localStorage:', err);
    return SAMPLE_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to localStorage:', err);
  }
}

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: string[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Error saving categories:', err);
  }
}

export function loadUserName(): string {
  try {
    const saved = localStorage.getItem(USERNAME_KEY);
    if (!saved || saved.toUpperCase() === 'SEBASTIAN') {
      return 'KLAUS';
    }
    return saved;
  } catch {
    return 'KLAUS';
  }
}

export function saveUserName(name: string): void {
  try {
    localStorage.setItem(USERNAME_KEY, name);
  } catch (err) {
    console.error('Error saving user name:', err);
  }
}
