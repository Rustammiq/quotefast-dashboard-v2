// TypeScript interfaces voor Settings

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface SecurityFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PinFormData {
  newPin: string;
  confirmPin: string;
}

export interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  projectUpdates: boolean;
  teamMentions: boolean;
  systemMaintenance: boolean;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface AIPersonalizationSettings {
  aiOfferteGenerator: boolean;
  smartTemplates: boolean;
  predictiveAnalytics: boolean;
}

export interface SystemStats {
  accountCreated: string;
  lastLogin: string;
  totalLogins: number;
  activeSessions: number;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface SettingsState {
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  hasUnsavedChanges: boolean;
}

