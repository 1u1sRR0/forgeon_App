'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Check,
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  Trash2,
  LogOut,
  Calendar,
  Save,
} from 'lucide-react';

const AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=forgeon1&backgroundColor=6c5ce7',
  'https://api.dicebear.com/7.x/bottts/svg?seed=forgeon2&backgroundColor=00b894',
  'https://api.dicebear.com/7.x/bottts/svg?seed=forgeon3&backgroundColor=e17055',
  'https://api.dicebear.com/7.x/bottts/svg?seed=forgeon4&backgroundColor=0984e3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=forgeon5&backgroundColor=fdcb6e',
  'https://api.dicebear.com/7.x/bottts/svg?seed=forgeon6&backgroundColor=e84393',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=forgeon1&backgroundColor=6c5ce7',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=forgeon2&backgroundColor=00b894',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=forgeon3&backgroundColor=e17055',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=forgeon4&backgroundColor=0984e3',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=forgeon1&backgroundColor=6c5ce7',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=forgeon2&backgroundColor=00b894',
];

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showAvatars, setShowAvatars] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setProfile(d.user);
          setName(d.user.name || '');
          setImage(d.user.image || null);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }),
      });
      const data = await res.json();
      if (!res.ok) { showToast('error', data.error || 'Failed'); setSaving(false); return; }
      await update({ ...session, user: { ...session?.user, name, image } });
      showToast('success', 'Profile saved');
    } catch { showToast('error', 'Something went wrong'); }
    setSaving(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('error', 'Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImage(dataUrl);
      setShowAvatars(false);
    };
    reader.readAsDataURL(file);
  };

  const selectAvatar = (url: string) => {
    setImage(url);
    setShowAvatars(false);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.text}
        </div>
      )}

      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {/* Profile Photo Section */}
      <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-400" /> Profile Photo
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
              {image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              Upload Photo
            </button>
            <button
              onClick={() => setShowAvatars(!showAvatars)}
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-sm transition-colors ml-2"
            >
              Choose Avatar
            </button>
            {image && (
              <button
                onClick={() => setImage(null)}
                className="px-4 py-2 text-red-400 hover:text-red-300 text-sm transition-colors ml-2"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Avatar Grid */}
        {showAvatars && (
          <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Choose an avatar</p>
            <div className="grid grid-cols-6 gap-3">
              {AVATARS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => selectAvatar(url)}
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                    image === url ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personal Info */}
      <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" /> Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={session.user?.email || ''}
                disabled
                className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" /> Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive updates about your projects</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${notifications.email ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Push Notifications</p>
              <p className="text-xs text-gray-500">Get notified when builds complete</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${notifications.push ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" /> Appearance
        </h2>
        <div className="flex gap-3">
          {(['dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                theme === t ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t === 'dark' ? 'Dark' : 'System'}
            </button>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-gray-900/80 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" /> Account
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">User ID</p>
            <p className="text-gray-300 font-mono text-xs mt-0.5">{profile?.id || session.user?.id}</p>
          </div>
          <div>
            <p className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Member since</p>
            <p className="text-gray-300 mt-0.5">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl flex items-center gap-2 transition-all font-medium"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl flex items-center gap-2 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <button className="px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl flex items-center gap-2 text-sm transition-colors border border-red-800/30">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
