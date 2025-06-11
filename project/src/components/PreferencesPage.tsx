import React, { useState } from 'react';
import { Moon, Sun, Volume2, Globe, Bell } from 'lucide-react';

export const PreferencesPage: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [audioLanguage, setAudioLanguage] = useState('english');
  const [subtitleLanguage, setSubtitleLanguage] = useState('english');
  const [autoLoadSubtitles, setAutoLoadSubtitles] = useState(true);
  const [appLanguage, setAppLanguage] = useState('english');
  const [contentRegion, setContentRegion] = useState('global');
  const [notifications, setNotifications] = useState({
    friendActivity: true,
    watchRoomInvites: true,
    newContent: true,
    systemUpdates: true,
  });

  return (
    <div className="space-y-8">
      {/* Theme Settings */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          {theme === 'dark' ? <Moon size={20} className="mr-2" /> : <Sun size={20} className="mr-2" />}
          Theme
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setTheme('light')}
            className={`px-4 py-2 rounded-lg ${theme === 'light' ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-300'}`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-300'}`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('auto')}
            className={`px-4 py-2 rounded-lg ${theme === 'auto' ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-300'}`}
          >
            Auto
          </button>
        </div>
      </div>

      {/* Audio & Subtitles */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Volume2 size={20} className="mr-2" />
          Audio & Subtitles
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Default Audio Language
            </label>
            <select
              value={audioLanguage}
              onChange={(e) => setAudioLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Default Subtitle Language
            </label>
            <select
              value={subtitleLanguage}
              onChange={(e) => setSubtitleLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoLoadSubtitles"
              checked={autoLoadSubtitles}
              onChange={(e) => setAutoLoadSubtitles(e.target.checked)}
              className="h-4 w-4 rounded border-dark-500 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="autoLoadSubtitles" className="ml-2 text-sm text-dark-200">
              Auto-load subtitles
            </label>
          </div>
        </div>
      </div>

      {/* Region & Language */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Globe size={20} className="mr-2" />
          Region & Language
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              App Language
            </label>
            <select
              value={appLanguage}
              onChange={(e) => setAppLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="tamil">Tamil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Content Region
            </label>
            <select
              value={contentRegion}
              onChange={(e) => setContentRegion(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white"
            >
              <option value="global">Global</option>
              <option value="india">India</option>
              <option value="us">United States</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Bell size={20} className="mr-2" />
          Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="friendActivity"
              checked={notifications.friendActivity}
              onChange={(e) => setNotifications({...notifications, friendActivity: e.target.checked})}
              className="h-4 w-4 rounded border-dark-500 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="friendActivity" className="ml-2 text-sm text-dark-200">
              Friend's activity
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="watchRoomInvites"
              checked={notifications.watchRoomInvites}
              onChange={(e) => setNotifications({...notifications, watchRoomInvites: e.target.checked})}
              className="h-4 w-4 rounded border-dark-500 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="watchRoomInvites" className="ml-2 text-sm text-dark-200">
              Watch room invites
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="newContent"
              checked={notifications.newContent}
              onChange={(e) => setNotifications({...notifications, newContent: e.target.checked})}
              className="h-4 w-4 rounded border-dark-500 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="newContent" className="ml-2 text-sm text-dark-200">
              New content drops
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="systemUpdates"
              checked={notifications.systemUpdates}
              onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})}
              className="h-4 w-4 rounded border-dark-500 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="systemUpdates" className="ml-2 text-sm text-dark-200">
              System updates
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button className="btn btn-primary">Save Preferences</button>
      </div>
    </div>
  );
};