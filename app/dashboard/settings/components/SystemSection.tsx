"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Settings, Download, Trash2, LogOut, Activity } from "lucide-react";
import { useAuth } from "../../../providers";
import { useToast } from "../hooks/useToast";
import { SystemStats, ActiveSession } from "@/types/settings";

export default function SystemSection() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - in real app, fetch from API
  const [stats] = useState<SystemStats>({
    accountCreated: '15 januari 2023',
    lastLogin: '2 uur geleden',
    totalLogins: 247,
    activeSessions: 2,
  });

  const [sessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      location: 'Amsterdam, Nederland',
      lastActive: '2 minuten geleden',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari 17',
      location: 'Amsterdam, Nederland',
      lastActive: '3 uur geleden',
      current: false,
    },
  ]);

  const handleExportData = async () => {
    setExporting(true);
    const toastId = toast.loading('Data voorbereiden voor export...');

    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real app, create actual export file
      const exportData = {
        user: {
          id: user?.id,
          name: user?.full_name,
          email: user?.email,
          company: null, // Company not available in current User type
        },
        exportDate: new Date().toISOString(),
        stats,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `account-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success('Data succesvol geëxporteerd!');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Fout bij exporteren van data');
    } finally {
      setExporting(false);
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    if (sessions.find(s => s.id === sessionId)?.current) {
      toast.error('Je kunt je huidige sessie niet uitloggen');
      return;
    }

    // In real app, call API to invalidate session
    toast.success('Sessie succesvol uitgelogd');
  };

  const handleDeleteAccount = async () => {
    // In real app, call API to delete account
    toast.info('Account verwijdering is momenteel niet beschikbaar. Neem contact op met support.');
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Account Statistics */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Account Statistieken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Account Aangemaakt</div>
                <div className="text-white text-lg font-semibold">{stats.accountCreated}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Laatst Ingelogd</div>
                <div className="text-white text-lg font-semibold">{stats.lastLogin}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Totaal Logins</div>
                <div className="text-white text-lg font-semibold">{stats.totalLogins}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Actieve Sessies</div>
                <div className="text-white text-lg font-semibold">{stats.activeSessions}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Actieve Sessies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-white font-medium">{session.device}</h5>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Huidige sessie
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{session.browser}</p>
                  <p className="text-gray-500 text-xs">
                    {session.location} • Laatst actief {session.lastActive}
                  </p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Logout sessie"
                    title="Logout sessie"
                  >
                    <LogOut className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex-1">
                <h5 className="text-white font-medium">Exporteer Gegevens</h5>
                <p className="text-gray-400 text-sm">Download al je account gegevens in JSON formaat (GDPR)</p>
              </div>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Exporteren...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Exporteer
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm">
                ℹ️ <strong>Privacy:</strong> Je hebt recht op een kopie van al je gegevens. 
                De export bevat je profiel, instellingen en activiteit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/10 backdrop-blur-xl border border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex-1">
                <h5 className="text-red-400 font-medium">Verwijder Account</h5>
                <p className="text-gray-300 text-sm">
                  Permanent verwijderen van je account en alle gegevens. Deze actie kan niet ongedaan worden gemaakt.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Verwijder Account
              </button>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⚠️ <strong>Let op:</strong> Het verwijderen van je account is permanent en kan niet ongedaan worden gemaakt. 
                Alle je gegevens, projecten en instellingen zullen worden verwijderd.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-red-400 mb-4">Account Verwijderen?</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Weet je zeker dat je je account wilt verwijderen? Dit zal:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Al je gegevens permanent verwijderen</li>
                <li>Je toegang tot alle projecten verwijderen</li>
                <li>Al je instellingen en voorkeuren wissen</li>
                <li>Deze actie kan niet ongedaan worden gemaakt</li>
              </ul>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">
                  ⚠️ Dit is een permanente actie en kan niet worden teruggedraaid!
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Ja, Verwijder Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

