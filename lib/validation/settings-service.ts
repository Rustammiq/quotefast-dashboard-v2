import { createClient } from '@/lib/supabase/client';
import { NotificationSettings, AppearanceSettings, AIPersonalizationSettings } from '../types/settings';
import { logger } from '@/lib/logger';

const supabase = createClient();

export interface SettingsResponse<T> {
  data: T | null;
  error: string | null;
}

// Settings service voor CRUD operaties
export const settingsService = {
  // Haal notification settings op
  getNotificationSettings: async (userId: string): Promise<SettingsResponse<NotificationSettings>> => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('notification_settings')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found (ok voor nieuwe users)
        logger.error('Error fetching notification settings:', 'SettingsService', { error });
        return { data: null, error: error.message };
      }

      return {
        data: data?.notification_settings || {
          emailNotifications: true,
          pushNotifications: true,
          smsAlerts: false,
          projectUpdates: true,
          teamMentions: true,
          systemMaintenance: true,
        },
        error: null,
      };
    } catch (error: any) {
      logger.error('Unexpected error in getNotificationSettings:', 'SettingsService', { error });
      return { data: null, error: error.message || 'Onbekende fout' };
    }
  },

  // Update notification settings
  updateNotificationSettings: async (
    userId: string,
    settings: NotificationSettings
  ): Promise<SettingsResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          notification_settings: settings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        logger.error('Error updating notification settings:', 'SettingsService', { error });
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error: any) {
      logger.error('Unexpected error in updateNotificationSettings:', 'SettingsService', { error });
      return { data: false, error: error.message || 'Onbekende fout' };
    }
  },

  // Haal appearance settings op
  getAppearanceSettings: async (userId: string): Promise<SettingsResponse<AppearanceSettings>> => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('appearance_settings')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching appearance settings:', 'SettingsService', error);
        return { data: null, error: error.message };
      }

      return {
        data: data?.appearance_settings || {
          theme: 'dark',
          language: 'nl',
          timezone: 'Europe/Amsterdam',
        },
        error: null,
      };
    } catch (error: any) {
      logger.error('Unexpected error in getAppearanceSettings:', 'SettingsService', error);
      return { data: null, error: error.message || 'Onbekende fout' };
    }
  },

  // Update appearance settings
  updateAppearanceSettings: async (
    userId: string,
    settings: AppearanceSettings
  ): Promise<SettingsResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          appearance_settings: settings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        logger.error('Error updating appearance settings:', 'SettingsService', error);
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error: any) {
      logger.error('Unexpected error in updateAppearanceSettings:', 'SettingsService', error);
      return { data: false, error: error.message || 'Onbekende fout' };
    }
  },

  // Haal AI personalization settings op
  getAIPersonalizationSettings: async (userId: string): Promise<SettingsResponse<AIPersonalizationSettings>> => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('ai_personalization_settings')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching AI personalization settings:', 'SettingsService', error);
        return { data: null, error: error.message };
      }

      return {
        data: data?.ai_personalization_settings || {
          aiOfferteGenerator: true,
          smartTemplates: true,
          predictiveAnalytics: false,
        },
        error: null,
      };
    } catch (error: any) {
      logger.error('Unexpected error in getAIPersonalizationSettings:', 'SettingsService', error);
      return { data: null, error: error.message || 'Onbekende fout' };
    }
  },

  // Update AI personalization settings
  updateAIPersonalizationSettings: async (
    userId: string,
    settings: AIPersonalizationSettings
  ): Promise<SettingsResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          ai_personalization_settings: settings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        logger.error('Error updating AI personalization settings:', 'SettingsService', error);
        return { data: false, error: error.message };
      }

      return { data: true, error: null };
    } catch (error: any) {
      logger.error('Unexpected error in updateAIPersonalizationSettings:', 'SettingsService', error);
      return { data: false, error: error.message || 'Onbekende fout' };
    }
  },

  // Generate API key (mock implementation)
  generateAPIKey: (): string => {
    const prefix = 'sk-' + (Math.random() > 0.5 ? 'prod' : 'dev');
    const random = Math.random().toString(36).substring(2, 15);
    return `${prefix}-...${random.substring(0, 6)}`;
  },
};

