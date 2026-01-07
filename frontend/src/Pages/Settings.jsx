import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useToastContext } from '../context/ToastContext';
import ScreenContainer from '../Components/ScreenContainer';
import GlassPanel from '../Components/GlassPanel';
import Button from '../Components/Button';
import Input from '../Components/Input';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Moon,
  Sun,
  LogOut,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const { username, email, logout } = useUser();
  const toast = useToastContext();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: true,
    showBadges: true
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, you'd save these to the backend
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // In a real app, you'd call an API endpoint here
    toast.success('Password changed successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-pure-black via-dark-gray/95 to-pure-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple/6 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-purple/4 rounded-full blur-[90px] animate-pulse animation-delay-2000 pointer-events-none"></div>
      </div>

      <ScreenContainer className="pb-20 pt-24 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-text-secondary text-sm font-body">Settings</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-pure-white">
              Account <span className="bg-gradient-to-r from-purple via-pink to-gold bg-clip-text text-transparent">Settings</span>
            </h1>
          </div>

        {/* Profile Settings */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 sm:p-8 group hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <User className="w-5 h-5 text-pure-white" />
            </div>
            <h2 className="font-body text-xl font-bold text-pure-white">
              Profile Information
            </h2>
          </div>
          
          <div className="space-y-4 relative">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-body">
                Username
              </label>
              <Input
                type="text"
                value={username || ''}
                disabled
                className="bg-dark-gray/50 border-purple/20"
              />
              <p className="text-xs text-text-secondary mt-1 font-body">
                Username cannot be changed
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-body">
                Email
              </label>
              <Input
                type="email"
                value={email || ''}
                disabled
                className="bg-dark-gray/50 border-purple/20"
              />
              <p className="text-xs text-text-secondary mt-1 font-body">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 sm:p-8 group hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 text-pure-white" />
            </div>
            <h2 className="font-body text-xl font-bold text-pure-white">
              Notifications
            </h2>
          </div>
          
          <div className="space-y-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-pure-white font-body">Push Notifications</p>
                <p className="text-sm text-text-secondary font-body">Receive notifications about your challenges</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-gray/50 border border-purple/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-pure-white font-body">Email Updates</p>
                <p className="text-sm text-text-secondary font-body">Receive weekly progress summaries via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailUpdates}
                  onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-gray/50 border border-purple/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 sm:p-8 group hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5 text-pure-white" />
            </div>
            <h2 className="font-body text-xl font-bold text-pure-white">
              Display
            </h2>
          </div>
          
          <div className="space-y-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-pure-white font-body">Dark Mode</p>
                <p className="text-sm text-text-secondary font-body">Always enabled for best experience</p>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Moon className="w-5 h-5" />
                <span className="text-sm font-body">Always On</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-pure-white font-body">Show Badges</p>
                <p className="text-sm text-text-secondary font-body">Display badges on your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showBadges}
                  onChange={(e) => handleSettingChange('showBadges', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-gray/50 border border-purple/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="relative bg-gradient-to-br from-dark-gray/95 to-medium-gray/85 backdrop-blur-xl border border-purple/25 rounded-2xl p-6 sm:p-8 group hover:border-purple/50 hover:scale-[1.01] transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple/8 rounded-full blur-3xl"></div>
          <div className="absolute top-3 right-3 w-2 h-2 bg-purple/40 rounded-full group-hover:bg-purple/60 transition-colors"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/20 to-transparent"></div>
          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5 text-pure-white" />
            </div>
            <h2 className="font-body text-xl font-bold text-pure-white">
              Security
            </h2>
          </div>
          
          <div className="space-y-4 relative">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-body">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-purple transition-colors"
                >
                  {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-body">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-purple transition-colors"
                >
                  {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 font-body">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-purple transition-colors"
                >
                  {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button
              onClick={handleChangePassword}
              className="w-full sm:w-auto"
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSaveSettings}
            className="flex-1 group"
          >
            <Save className="w-4 h-4 mr-2 inline group-hover:scale-110 transition-transform" />
            Save Settings
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="flex-1 group"
          >
            <LogOut className="w-4 h-4 mr-2 inline group-hover:translate-x-1 transition-transform" />
            Logout
          </Button>
        </div>
      </div>
      </ScreenContainer>
    </div>
  );
};

export default Settings;

