"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Brain, Zap, Edit, Save } from "lucide-react";
import { useAIPersonalization } from "../../../../contexts/AIPersonalizationContext";
import { useSettingsForm } from "../hooks/useSettingsForm";
import { AIPersonalizationSettings } from "@/types/settings";

export default function AIPersonalizationSection() {
  const { onboardingData } = useAIPersonalization();
  const {
    aiSettings,
    setAISettings,
    saveAISettings,
    saving,
  } = useSettingsForm();

  const [localSettings, setLocalSettings] = useState<AIPersonalizationSettings>(aiSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setLocalSettings(aiSettings);
  }, [aiSettings]);

  const handleToggle = (key: keyof AIPersonalizationSettings) => {
    setLocalSettings((prev: AIPersonalizationSettings) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(aiSettings));
      return newSettings;
    });
  };

  const handleSave = async () => {
    const success = await saveAISettings(localSettings);
    if (success) {
      setHasChanges(false);
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setLocalSettings(aiSettings);
    setHasChanges(false);
    setIsEditMode(false);
  };

  if (!onboardingData) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardContent className="p-6">
          <p className="text-gray-400">AI personalisatie data wordt geladen...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Personalisatie
          </CardTitle>
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <Edit className="h-4 w-4" />
              Bewerken
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Annuleren
              </button>
              {hasChanges && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Opslaan
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Onboarding Data Overview */}
        <div className="bg-gradient-to-r from-blue-50/10 to-purple-50/10 rounded-lg p-4 border border-blue-200/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-blue-400" />
            <h4 className="text-white font-medium">Jouw Onboarding Data</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Bedrijf:</span>
              <span className="text-white ml-2">{onboardingData.companyName}</span>
            </div>
            <div>
              <span className="text-gray-400">Branche:</span>
              <span className="text-white ml-2">{onboardingData.industry}</span>
            </div>
            <div>
              <span className="text-gray-400">Teamgrootte:</span>
              <span className="text-white ml-2">{onboardingData.teamSize}</span>
            </div>
            <div>
              <span className="text-gray-400">Ervaring:</span>
              <span className="text-white ml-2">{onboardingData.experienceLevel}</span>
            </div>
          </div>
        </div>

        {/* AI Features Preferences */}
        <div>
          <h4 className="text-white font-medium mb-3">AI Features Voorkeuren</h4>
          <div className="space-y-3">
            {onboardingData.aiFeatureInterests?.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Preferences */}
        <div>
          <h4 className="text-white font-medium mb-3">Workflow Voorkeuren</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <span className="text-gray-400 text-sm">Automatisering Niveau:</span>
              <div className="text-white font-medium">{onboardingData.workflowPreferences?.automationLevel}</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <span className="text-gray-400 text-sm">Rapportage Frequentie:</span>
              <div className="text-white font-medium">{onboardingData.workflowPreferences?.reportingFrequency}</div>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-gray-400 text-sm">Gewenste Integraties:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {onboardingData.workflowPreferences?.integrationNeeds?.map((integration: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">
                  {integration}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Settings Toggles */}
        <div>
          <h4 className="text-white font-medium mb-3">AI Functie Instellingen</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="text-white font-medium">AI Offerte Generator</div>
                <div className="text-gray-400 text-sm">Automatische prijsberekening en suggesties</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.aiOfferteGenerator}
                  onChange={() => handleToggle('aiOfferteGenerator')}
                  disabled={!isEditMode}
                  className="sr-only peer"
                  aria-label="AI Offerte Generator toggle"
                />
                <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="text-white font-medium">Smart Templates</div>
                <div className="text-gray-400 text-sm">Context-aware template suggesties</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.smartTemplates}
                  onChange={() => handleToggle('smartTemplates')}
                  disabled={!isEditMode}
                  className="sr-only peer"
                  aria-label="Smart Templates toggle"
                />
                <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="text-white font-medium">Predictive Analytics</div>
                <div className="text-gray-400 text-sm">Voorspel conversies en trends</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.predictiveAnalytics}
                  onChange={() => handleToggle('predictiveAnalytics')}
                  disabled={!isEditMode}
                  className="sr-only peer"
                  aria-label="Predictive Analytics toggle"
                />
                <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-purple-300 text-sm">
            🤖 <strong>AI Personalisatie:</strong> Deze instellingen helpen ons je ervaring te optimaliseren op basis van jouw bedrijfsprofiel en voorkeuren.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

