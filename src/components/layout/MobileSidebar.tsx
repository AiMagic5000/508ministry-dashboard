'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ExternalLink } from 'lucide-react'
import {
  LayoutDashboard,
  Building2,
  Scale,
  Leaf,
  Heart,
  Church,
  Truck,
  Users,
  Calendar,
  Activity,
  Mic,
  FileText,
  Receipt,
  Shield,
  Settings,
  HelpCircle,
} from 'lucide-react'

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Trust Data', href: '/trust-data', icon: Building2 },
  { name: '1000lbs of Food', href: '/food-production', icon: Scale },
  { name: 'Farm Production', href: '/production', icon: Leaf },
  { name: 'Donations', href: '/donations', icon: Heart },
  { name: 'Partner Churches', href: '/partners', icon: Church },
  { name: 'Distribution', href: '/distribution', icon: Truck },
  { name: 'Volunteers', href: '/volunteers', icon: Users },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'AI Activity Log', href: '/activity-log', icon: Activity },
  { name: 'Meeting Recorder', href: '/meetings', icon: Mic },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Tax Documents', href: '/tax-documents', icon: Receipt },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="lg:hidden fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-light-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-primary-50">
              <img
                alt="Start My Business"
                width={40}
                height={40}
                className="object-contain"
                src="https://cdn.prod.website-files.com/6784053e7b7422e48efa5a84/6833a36f90c60fba010cee72_start_my_business_logo-removebg-preview.png"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-light-900">Harvest Hope</h1>
              <p className="text-[10px] text-light-500">Florida Farm Ministry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-light-100 transition-colors"
          >
            <X className="w-5 h-5 text-light-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-light-600 hover:bg-light-100 hover:text-light-900'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-primary-100' : 'group-hover:bg-light-200'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-light-200 bg-white">
          <a
            href="https://508-trust-services.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            <span className="text-sm font-medium">508 Software</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </aside>
    </>
  )
}
