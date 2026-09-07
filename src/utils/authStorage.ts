import { AuthUser } from '../types';

const AUTH_USER_KEY = 'master_app_auth_current_user_v1';
const REGISTERED_USERS_KEY = 'master_app_registered_users_v1';
const PENDING_VERIFICATION_KEY = 'master_app_pending_verification_v1';

export interface PendingVerification {
  email: string;
  name: string;
  username?: string;
  passwordHash?: string;
  code: string;
  token: string;
  sentAt: string;
}

export interface StoredUser extends AuthUser {
  passwordHash?: string;
}

export function getCurrentAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading current auth user:', e);
    return null;
  }
}

export function setCurrentAuthUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (e) {
    console.error('Error saving current auth user:', e);
  }
}

export function getRegisteredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading registered users:', e);
    return [];
  }
}

export function saveRegisteredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving registered users:', e);
  }
}

export function getPendingVerification(): PendingVerification | null {
  try {
    const raw = localStorage.getItem(PENDING_VERIFICATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setPendingVerification(data: PendingVerification | null): void {
  try {
    if (data) {
      localStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(PENDING_VERIFICATION_KEY);
    }
  } catch (e) {
    console.error('Error setting pending verification:', e);
  }
}

// Generate a 6-digit confirmation code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a random confirmation token
export function generateToken(): string {
  return 'tok_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
}
