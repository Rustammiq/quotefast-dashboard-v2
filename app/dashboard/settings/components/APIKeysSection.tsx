"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { settingsService } from "../../../../lib/validation";
import { APIKey } from "../../../../types/forms/settings";

export default function APIKeysSection() {
  const toast = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk-prod-...abc123',
      created: 'Jan 10, 2024',
      lastUsed: '2 uur geleden',
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk-dev-...xyz789',
      created: 'Jan 5, 2024',
      lastUsed: '1 dag geleden',
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleCopyKey = (key: string, name: string) => {
    navigator.clipboard.writeText(key);
    toast.success(`${name} gekopieerd naar klembord!`);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleDeleteKey = (keyId: string, name: string) => {
    if (window.confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
      setApiKeys(prev => prev.filter(k => k.id !== keyId));
      toast.success(`${name} verwijderd`);
    }
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Voer een naam in voor de API key');
      return;
    }

    const newKey = settingsService.generateAPIKey();
    const newApiKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      created: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastUsed: 'Nog niet gebruikt',
    };

    setApiKeys(prev => [newApiKey, ...prev]);
    setGeneratedKey(newKey);
    setNewKeyName('');
    toast.success('API key succesvol aangemaakt!');
  };

  const closeModal = () => {
    setShowNewKeyModal(false);
    setGeneratedKey(null);
    setNewKeyName('');
  };

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Personal Access Tokens</h4>
              <p className="text-gray-400 text-sm">Voor toegang tot de API vanuit externe applicaties</p>
            </div>
            <button
              onClick={() => setShowNewKeyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nieuwe Key
            </button>
          </div>

          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Key className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Geen API keys gevonden</p>
              <p className="text-sm">Maak je eerste API key aan om te beginnen</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => {
                const isVisible = visibleKeys.has(apiKey.id);
                
                return (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{apiKey.name}</h5>
                      <p className="text-gray-400 text-sm font-mono">
                        {isVisible ? apiKey.key : '••••••••••••••••'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Aangemaakt {apiKey.created} • Laatst gebruikt {apiKey.lastUsed}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label={isVisible ? "Verberg API key" : "Toon API key"}
                        title={isVisible ? "Verberg API key" : "Toon API key"}
                      >
                        {isVisible ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopyKey(apiKey.key, apiKey.name)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Kopieer API key"
                        title="Kopieer API key"
                      >
                        <Copy className="h-4 w-4 text-gray-400 hover:text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteKey(apiKey.id, apiKey.name)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Verwijder API key"
                        title="Verwijder API key"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Security Warning */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Belangrijk:</strong> Deel je API keys nooit met anderen en bewaar ze veilig. 
              Als een key gecompromitteerd is, verwijder deze dan onmiddellijk.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {!generatedKey ? (
              <>
                <h3 className="text-xl font-bold text-white mb-4">Nieuwe API Key Aanmaken</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Naam <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="bijv. Production API, Mobile App"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      title="Annuleer het aanmaken van een nieuwe API key"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleGenerateKey}
                      disabled={!newKeyName.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Genereer een nieuwe API key"
                    >
                      Genereer Key
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-4">API Key Gegenereerd!</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-300 text-sm mb-2">
                      ✓ Je nieuwe API key is succesvol aangemaakt
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-black/30 text-green-400 rounded text-sm font-mono break-all">
                        {generatedKey}
                      </code>
                      <button
                        onClick={() => handleCopyKey(generatedKey, 'Nieuwe key')}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        title="Kopieer de nieuwe API key"
                        aria-label="Kopieer de nieuwe API key"
                      >
                        <Copy className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      ⚠️ <strong>Let op:</strong> Kopieer deze key nu. Je zult hem niet meer kunnen zien.
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Sluit het dialoogvenster"
                  >
                    Sluiten
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

