'use client'

import { useState } from 'react'
import { Bell, Search, Menu, X, User, LogOut, Settings } from 'lucide-react'

interface HeaderProps {
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 bg-white border-b border-light-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 -ml-2 text-light-600 hover:text-light-900 hover:bg-light-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div>
          <h1 className="text-lg font-semibold text-light-900">
            Harvest Hope Farm Dashboard
          </h1>
          <p className="text-xs text-light-500 hidden sm:block">
            508(c)(1)(A) Agricultural Faith-Based Organization
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - Desktop */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 md:w-64 pl-10 pr-4 py-2 text-sm border border-light-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow bg-white"
          />
        </div>

        {/* Search Icon - Mobile */}
        <button className="sm:hidden p-2 text-light-500 hover:text-light-700 hover:bg-light-100 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-light-500 hover:text-light-700 hover:bg-light-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-500" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-light-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-primary-500">
              A
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-light-900">Admin</p>
              <p className="text-xs text-light-500">admin@harvesthope.org</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-light-200 py-1 z-50">
              <a
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-light-700 hover:bg-light-100"
              >
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <a
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm text-light-700 hover:bg-light-100"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
