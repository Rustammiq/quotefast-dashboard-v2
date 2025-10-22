"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Bell, Save } from "lucide-react";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { NOTIFICATION_PREFERENCES } from "../utils/constants";
import { NotificationSettings } from "@/types/settings";

export default function NotificationsSection() {
  const {
    notificationSettings,
    setNotificationSettings,
    saveNotificationSettings,
    saving,
  } = useSettingsForm();

  const [localSettings, setLocalSettings] = useState<NotificationSettings>(notificationSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(notificationSettings);
  }, [notificationSettings]);

  const handleToggle = (key: keyof NotificationSettings) => {
    setLocalSettings((prev: NotificationSettings) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(notificationSettings));
      return newSettings;
    });
  };

  const handleSave = async () => {
    const success = await saveNotificationSettings(localSettings);
    if (success) {
      setHasChanges(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificatie Voorkeuren
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
      <CardContent className="space-y-4">
        {NOTIFICATION_PREFERENCES.map((preference) => {
          const key = preference.id as keyof NotificationSettings;
          const isEnabled = localSettings[key];

          return (
            <div
              key={preference.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div>
                <h4 className="text-white font-medium">{preference.label}</h4>
                <p className="text-gray-400 text-sm">{preference.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => handleToggle(key)}
                  className="sr-only peer"
                  aria-label={`Toggle ${preference.label}`}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}

        {/* Info Message */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Email notificaties kunnen worden aangepast per project in de project instellingen.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

