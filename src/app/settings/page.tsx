'use client'

import { useState } from 'react'
import { Settings, User, Bell, Shield, Database, Palette, Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: 'Harvest Hope Farm',
    email: 'admin@harvesthope.org',
    phone: '(305) 555-0123',
    address: 'Homestead, FL',
    notifications: {
      email: true,
      donations: true,
      volunteers: true,
      distributions: false
    },
    theme: 'light'
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // Save settings logic would go here
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary-600" />
          Settings
        </h2>
        <p className="text-light-500 mt-1">Manage your dashboard preferences</p>
      </div>

      {/* Organization Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-light-200 flex items-center gap-2">
          <User className="w-5 h-5 text-light-500" />
          <h3 className="font-semibold text-light-900">Organization Details</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-light-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-700 mb-1">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-light-700 mb-1">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-light-200 flex items-center gap-2">
          <Bell className="w-5 h-5 text-light-500" />
          <h3 className="font-semibold text-light-900">Notifications</h3>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-light-50">
            <div>
              <p className="font-medium text-light-900">Email Notifications</p>
              <p className="text-sm text-light-500">Receive email alerts for important updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: e.target.checked }
              })}
              className="w-5 h-5 rounded border-light-300 text-primary-500 focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-light-50">
            <div>
              <p className="font-medium text-light-900">Donation Alerts</p>
              <p className="text-sm text-light-500">Get notified when new donations are received</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.donations}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, donations: e.target.checked }
              })}
              className="w-5 h-5 rounded border-light-300 text-primary-500 focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-light-50">
            <div>
              <p className="font-medium text-light-900">Volunteer Sign-ups</p>
              <p className="text-sm text-light-500">Notifications for new volunteer registrations</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.volunteers}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, volunteers: e.target.checked }
              })}
              className="w-5 h-5 rounded border-light-300 text-primary-500 focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-light-50">
            <div>
              <p className="font-medium text-light-900">Distribution Updates</p>
              <p className="text-sm text-light-500">Alerts for scheduled distributions</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.distributions}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, distributions: e.target.checked }
              })}
              className="w-5 h-5 rounded border-light-300 text-primary-500 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Database Connection */}
      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-light-200 flex items-center gap-2">
          <Database className="w-5 h-5 text-light-500" />
          <h3 className="font-semibold text-light-900">Database Connection</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <div>
              <p className="font-medium text-primary-800">Connected to Cognabase</p>
              <p className="text-sm text-primary-600">cognabase.com • Supabase instance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="text-primary-600 text-sm">Settings saved successfully!</span>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  )
}
