"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Palette, Save } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS, THEME_OPTIONS } from "../utils/constants";
import { AppearanceSettings } from "@/types/settings";

export default function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const {
    appearanceSettings,
    setAppearanceSettings,
    saveAppearanceSettings,
    saving,
  } = useSettingsForm();

  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(appearanceSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings({
      ...appearanceSettings,
      theme: theme,
    });
  }, [appearanceSettings, theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      // Handle system theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(newTheme);
    }
    setLocalSettings((prev: AppearanceSettings) => {
      const newSettings = { ...prev, theme: newTheme };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(appearanceSettings));
      return newSettings;
    });
  };

  const handleLanguageChange = (language: string) => {
    setLocalSettings((prev: AppearanceSettings) => {
      const newSettings = { ...prev, language };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(appearanceSettings));
      return newSettings;
    });
  };

  const handleTimezoneChange = (timezone: string) => {
    setLocalSettings((prev: AppearanceSettings) => {
      const newSettings = { ...prev, timezone };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(appearanceSettings));
      return newSettings;
    });
  };

  const handleSave = async () => {
    const success = await saveAppearanceSettings(localSettings);
    if (success) {
      setHasChanges(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Uiterlijk
          </CardTitle>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Wijzigingen Opslaan
                </>
              )}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Thema</label>
          <div className="grid grid-cols-3 gap-4">
            {THEME_OPTIONS.map((themeOption) => {
              const isSelected = localSettings.theme === themeOption.value;
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {/* Theme Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      themeOption.value === 'light' 
                        ? 'bg-white' 
                        : themeOption.value === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gradient-to-br from-white to-gray-900'
                    }`}>
                      {themeOption.value === 'light' && (
                        <div className="w-6 h-6 rounded-full bg-yellow-400" />
                      )}
                      {themeOption.value === 'dark' && (
                        <div className="w-6 h-6 rounded-full bg-blue-900" />
                      )}
                      {themeOption.value === 'system' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-blue-900" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isSelected ? 'text-blue-300' : 'text-gray-300'
                    }`}>
                      {themeOption.label}
                    </span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Het thema wordt direct toegepast
          </p>
        </div>

        {/* Language Selection */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Taal
          </label>
          <select
            id="language"
            value={localSettings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Selecteer taal"
          >
            {LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-400">
            De interface taal. Momenteel is alleen Nederlands volledig ondersteund.
          </p>
        </div>

        {/* Timezone Selection */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
            Tijdzone
          </label>
          <select
            id="timezone"
            value={localSettings.timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Selecteer tijdzone"
          >
            {TIMEZONE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-400">
            Wordt gebruikt voor datums en tijden in de applicatie
          </p>
        </div>

        {/* Preview Section */}
        <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
          <h4 className="text-white font-medium mb-3">Preview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Thema:</span>
              <span className="text-white">{THEME_OPTIONS.find(t => t.value === localSettings.theme)?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Taal:</span>
              <span className="text-white">{LANGUAGE_OPTIONS.find(l => l.value === localSettings.language)?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tijdzone:</span>
              <span className="text-white">{TIMEZONE_OPTIONS.find(tz => tz.value === localSettings.timezone)?.label}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400">Huidige tijd:</span>
              <span className="text-white">
                {new Date().toLocaleTimeString('nl-NL', { 
                  timeZone: localSettings.timezone,
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

