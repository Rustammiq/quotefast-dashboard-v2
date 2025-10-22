"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useStandby } from "../../../../contexts/StandbyContext";
import { useToast } from "../hooks/useToast";
import { authService } from "../../../../lib/auth";
import { securitySchema, pinSchema, calculatePasswordStrength } from "../utils/validation";
import { SecurityFormData, PinFormData } from "../../../../types/forms/settings";
import { INACTIVITY_TIMEOUT_OPTIONS } from "../utils/constants";

export default function SecuritySection() {
  const {
    isStandbyEnabled,
    setStandbyEnabled,
    currentPin,
    setCurrentPin,
    inactivityTimeout,
    setInactivityTimeout
  } = useStandby();
  const toast = useToast();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);

  const [passwordForm, setPasswordForm] = useState<SecurityFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [pinForm, setPinForm] = useState<PinFormData>({
    newPin: '',
    confirmPin: '',
  });

  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof SecurityFormData, string>>>({});
  const [pinErrors, setPinErrors] = useState<Partial<Record<keyof PinFormData, string>>>({});

  const passwordStrength = calculatePasswordStrength(passwordForm.newPassword);

  const handlePasswordChange = async () => {
    // Validate
    try {
      securitySchema.parse(passwordForm);
      setPasswordErrors({});
    } catch (error: any) {
      const newErrors: Partial<Record<keyof SecurityFormData, string>> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0]) {
          newErrors[err.path[0] as keyof SecurityFormData] = err.message;
        }
      });
      setPasswordErrors(newErrors);
      toast.error('Controleer de wachtwoord velden');
      return;
    }

    setSavingPassword(true);
    const toastId = toast.loading('Wachtwoord wijzigen...');

    try {
      // In a real app, verify current password first
      const { error } = await authService.updatePassword(passwordForm.newPassword);

      if (error) {
        toast.dismiss(toastId);
        toast.error(error);
        return;
      }

      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.dismiss(toastId);
      toast.success('Wachtwoord succesvol gewijzigd!');
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Fout bij wijzigen wachtwoord');
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePinUpdate = () => {
    // Validate
    try {
      pinSchema.parse(pinForm);
      setPinErrors({});
    } catch (error: any) {
      const newErrors: Partial<Record<keyof PinFormData, string>> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0]) {
          newErrors[err.path[0] as keyof PinFormData] = err.message;
        }
      });
      setPinErrors(newErrors);
      toast.error('Controleer de PIN velden');
      return;
    }

    setSavingPin(true);
    
    try {
      setCurrentPin(pinForm.newPin);
      setPinForm({ newPin: '', confirmPin: '' });
      toast.success('PIN succesvol bijgewerkt!');
    } finally {
      setSavingPin(false);
    }
  };

  const handle2FAToggle = () => {
    if (!enable2FA) {
      toast.info('2FA functionaliteit komt binnenkort beschikbaar');
    }
    setEnable2FA(!enable2FA);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Beveiligings Instellingen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Standby Mode Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Sluimerstand Instellingen</h3>

          {/* Enable/Disable Standby */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Sluimerstand Activeren</div>
              <div className="text-gray-400 text-sm">Automatisch vergrendelen na inactiviteit</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isStandbyEnabled}
                onChange={(e) => {
                  setStandbyEnabled(e.target.checked);
                  toast.success(e.target.checked ? 'Sluimerstand geactiveerd' : 'Sluimerstand gedeactiveerd');
                }}
                className="sr-only peer"
                aria-label="Toggle standby mode"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Inactivity Timeout */}
          {isStandbyEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Inactiviteit Timeout
              </label>
              <select
                value={inactivityTimeout / (60 * 1000)}
                onChange={(e) => {
                  setInactivityTimeout(parseInt(e.target.value) * 60 * 1000);
                  toast.success('Timeout bijgewerkt');
                }}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select inactivity timeout"
              >
                {INACTIVITY_TIMEOUT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PIN Code Settings */}
          {isStandbyEnabled && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">Pincode Instellingen</h4>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Huidige Pincode
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {currentPin.split('').map((_, index) => (
                      <div key={index} className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">4 cijfers</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nieuwe Pincode
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinForm.newPin}
                  onChange={(e) => {
                    setPinForm(prev => ({ ...prev, newPin: e.target.value.replace(/\D/g, '') }));
                    if (pinErrors.newPin) setPinErrors(prev => ({ ...prev, newPin: undefined }));
                  }}
                  placeholder="Voer 4 cijfers in"
                  className={`w-full px-3 py-2 bg-white/10 border ${
                    pinErrors.newPin ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {pinErrors.newPin && (
                  <p className="mt-1 text-sm text-red-400">{pinErrors.newPin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bevestig Nieuwe Pincode
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinForm.confirmPin}
                  onChange={(e) => {
                    setPinForm(prev => ({ ...prev, confirmPin: e.target.value.replace(/\D/g, '') }));
                    if (pinErrors.confirmPin) setPinErrors(prev => ({ ...prev, confirmPin: undefined }));
                  }}
                  placeholder="Bevestig 4 cijfers"
                  className={`w-full px-3 py-2 bg-white/10 border ${
                    pinErrors.confirmPin ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {pinErrors.confirmPin && (
                  <p className="mt-1 text-sm text-red-400">{pinErrors.confirmPin}</p>
                )}
              </div>

              {pinForm.newPin.length === 4 && pinForm.confirmPin.length === 4 && (
                <button
                  onClick={handlePinUpdate}
                  disabled={savingPin}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {savingPin ? 'Bijwerken...' : 'Pincode Bijwerken'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Password Settings */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Wachtwoord Wijzigen</h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Huidig Wachtwoord <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => {
                  setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }));
                  if (passwordErrors.currentPassword) setPasswordErrors(prev => ({ ...prev, currentPassword: undefined }));
                }}
                placeholder="Voer huidig wachtwoord in"
                className={`w-full px-3 py-2 pr-10 bg-white/10 border ${
                  passwordErrors.currentPassword ? 'border-red-500' : 'border-white/20'
                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nieuw Wachtwoord <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }));
                  if (passwordErrors.newPassword) setPasswordErrors(prev => ({ ...prev, newPassword: undefined }));
                }}
                placeholder="Voer nieuw wachtwoord in"
                className={`w-full px-3 py-2 pr-10 bg-white/10 border ${
                  passwordErrors.newPassword ? 'border-red-500' : 'border-white/20'
                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>
            )}
            
            {/* Password Strength Indicator */}
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Wachtwoord Sterkte:</span>
                  <span className={`font-medium ${
                    passwordStrength.label === 'Zwak' ? 'text-red-400' :
                    passwordStrength.label === 'Gemiddeld' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    data-strength={passwordStrength.score}
                    aria-label={`Password strength: ${passwordStrength.label}`}
                  />
                </div>
                <style jsx>{`
                  div[data-strength="1"] { width: 16.67%; }
                  div[data-strength="2"] { width: 33.33%; }
                  div[data-strength="3"] { width: 50%; }
                  div[data-strength="4"] { width: 66.67%; }
                  div[data-strength="5"] { width: 83.33%; }
                  div[data-strength="6"] { width: 100%; }
                `}</style>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bevestig Nieuw Wachtwoord <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                  if (passwordErrors.confirmPassword) setPasswordErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Bevestig nieuw wachtwoord"
                className={`w-full px-3 py-2 pr-10 bg-white/10 border ${
                  passwordErrors.confirmPassword ? 'border-red-500' : 'border-white/20'
                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={savingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingPassword ? 'Wachtwoord Wijzigen...' : 'Wachtwoord Wijzigen'}
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div>
            <h4 className="text-yellow-400 font-medium">Two-Factor Authentication</h4>
            <p className="text-gray-300 text-sm">Voeg een extra beveiligingslaag toe aan je account</p>
          </div>
          <button
            onClick={handle2FAToggle}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            {enable2FA ? '2FA Uitschakelen' : '2FA Inschakelen'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

