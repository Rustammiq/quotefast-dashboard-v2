import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { useToast } from './useToast';
import { settingsService } from '../../../../lib/validation';
import { NotificationSettings, AppearanceSettings, AIPersonalizationSettings } from '../../../../types/forms/settings';

export const useSettingsForm = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    projectUpdates: true,
    teamMentions: true,
    systemMaintenance: true,
  });

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'dark',
    language: 'nl',
    timezone: 'Europe/Amsterdam',
  });

  // AI personalization settings state
  const [aiSettings, setAISettings] = useState<AIPersonalizationSettings>({
    aiOfferteGenerator: true,
    smartTemplates: true,
    predictiveAnalytics: false,
  });

  const loadAllSettings = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Load notification settings
      const notifResponse = await settingsService.getNotificationSettings(user.id);
      if (notifResponse.data) {
        setNotificationSettings(notifResponse.data);
      }

      // Load appearance settings
      const appearanceResponse = await settingsService.getAppearanceSettings(user.id);
      if (appearanceResponse.data) {
        setAppearanceSettings(appearanceResponse.data);
      }

      // Load AI settings
      const aiResponse = await settingsService.getAIPersonalizationSettings(user.id);
      if (aiResponse.data) {
        setAISettings(aiResponse.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Fout bij het laden van instellingen');
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load all settings on mount
  useEffect(() => {
    if (user) {
      loadAllSettings();
    }
  }, [user, loadAllSettings]);

  // Save notification settings
  const saveNotificationSettings = useCallback(async (settings: NotificationSettings) => {
    if (!user) return false;
    
    setSaving(true);
    const toastId = toast.loading('Notificatie instellingen opslaan...');
    
    try {
      const { data, error } = await settingsService.updateNotificationSettings(user.id, settings);
      
      if (error) {
        toast.dismiss(toastId);
        toast.error(`Fout bij opslaan: ${error}`);
        return false;
      }
      
      setNotificationSettings(settings);
      setHasUnsavedChanges(false);
      toast.dismiss(toastId);
      toast.success('Notificatie instellingen opgeslagen!');
      return true;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Onverwachte fout bij opslaan');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, toast]);

  // Save appearance settings
  const saveAppearanceSettings = useCallback(async (settings: AppearanceSettings) => {
    if (!user) return false;
    
    setSaving(true);
    const toastId = toast.loading('Uiterlijk instellingen opslaan...');
    
    try {
      const { data, error } = await settingsService.updateAppearanceSettings(user.id, settings);
      
      if (error) {
        toast.dismiss(toastId);
        toast.error(`Fout bij opslaan: ${error}`);
        return false;
      }
      
      setAppearanceSettings(settings);
      setHasUnsavedChanges(false);
      toast.dismiss(toastId);
      toast.success('Uiterlijk instellingen opgeslagen!');
      return true;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Onverwachte fout bij opslaan');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, toast]);

  // Save AI personalization settings
  const saveAISettings = useCallback(async (settings: AIPersonalizationSettings) => {
    if (!user) return false;
    
    setSaving(true);
    const toastId = toast.loading('AI instellingen opslaan...');
    
    try {
      const { data, error } = await settingsService.updateAIPersonalizationSettings(user.id, settings);
      
      if (error) {
        toast.dismiss(toastId);
        toast.error(`Fout bij opslaan: ${error}`);
        return false;
      }
      
      setAISettings(settings);
      setHasUnsavedChanges(false);
      toast.dismiss(toastId);
      toast.success('AI instellingen opgeslagen!');
      return true;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Onverwachte fout bij opslaan');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, toast]);

  return {
    loading,
    saving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    notificationSettings,
    setNotificationSettings,
    saveNotificationSettings,
    appearanceSettings,
    setAppearanceSettings,
    saveAppearanceSettings,
    aiSettings,
    setAISettings,
    saveAISettings,
    loadAllSettings,
  };
};

