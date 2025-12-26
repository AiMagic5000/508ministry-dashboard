'use client'

import { useEffect, useState } from 'react'
import {
  Scale,
  Church,
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  Leaf,
  Truck,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashboardStats {
  totalFoodDistributed: number
  partnerChurches: number
  activeVolunteers: number
  totalDonations: number
  monthlyGrowth: {
    food: number
    churches: number
    volunteers: number
    donations: number
  }
}

interface RecentActivity {
  id: string
  type: 'distribution' | 'donation' | 'volunteer' | 'harvest'
  description: string
  timestamp: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFoodDistributed: 0,
    partnerChurches: 0,
    activeVolunteers: 0,
    totalDonations: 0,
    monthlyGrowth: { food: 0, churches: 0, volunteers: 0, donations: 0 }
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      // Fetch stats from Cognabase
      const [distributions, partners, volunteers, donations] = await Promise.all([
        supabase.from('distributions').select('total_weight_lbs'),
        supabase.from('partner_churches').select('id').eq('status', 'active'),
        supabase.from('volunteers').select('id').eq('status', 'active'),
        supabase.from('donations').select('amount'),
      ])

      const totalFood = distributions.data?.reduce((sum, d) => sum + (d.total_weight_lbs || 0), 0) || 0
      const totalDonationAmount = donations.data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

      setStats({
        totalFoodDistributed: totalFood,
        partnerChurches: partners.data?.length || 0,
        activeVolunteers: volunteers.data?.length || 0,
        totalDonations: totalDonationAmount,
        monthlyGrowth: { food: 12, churches: 5, volunteers: 8, donations: 15 }
      })

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5)

      if (activityData) {
        setRecentActivity(activityData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Food Distributed',
      value: `${stats.totalFoodDistributed.toLocaleString()} lbs`,
      icon: Scale,
      growth: stats.monthlyGrowth.food,
      color: 'primary',
      href: '/food-production'
    },
    {
      title: 'Partner Churches',
      value: stats.partnerChurches.toString(),
      icon: Church,
      growth: stats.monthlyGrowth.churches,
      color: 'secondary',
      href: '/partners'
    },
    {
      title: 'Active Volunteers',
      value: stats.activeVolunteers.toString(),
      icon: Users,
      growth: stats.monthlyGrowth.volunteers,
      color: 'primary',
      href: '/volunteers'
    },
    {
      title: 'Total Donations',
      value: `$${stats.totalDonations.toLocaleString()}`,
      icon: Heart,
      growth: stats.monthlyGrowth.donations,
      color: 'secondary',
      href: '/donations'
    },
  ]

  const quickActions = [
    { title: 'Log Harvest', icon: Leaf, href: '/production', color: 'bg-primary-50 text-primary-600' },
    { title: 'Record Distribution', icon: Truck, href: '/distribution', color: 'bg-secondary-50 text-secondary-500' },
    { title: 'Add Volunteer', icon: Users, href: '/volunteers', color: 'bg-primary-50 text-primary-600' },
    { title: 'Schedule Event', icon: Calendar, href: '/schedule', color: 'bg-secondary-50 text-secondary-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-light-900">Dashboard Overview</h2>
        <p className="text-light-500 mt-1">Welcome back to Harvest Hope Farm Ministry</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.growth >= 0
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-light-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${stat.color === 'primary' ? 'bg-primary-50' : 'bg-secondary-50'}`}>
                  <Icon className={`w-5 h-5 ${stat.color === 'primary' ? 'text-primary-600' : 'text-secondary-500'}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-primary-600' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.growth)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-light-900">{loading ? '...' : stat.value}</p>
                <p className="text-sm text-light-500 mt-1">{stat.title}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <h3 className="text-lg font-semibold text-light-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} hover:opacity-80 transition-opacity`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">{action.title}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-light-900">Recent Activity</h3>
            <Link href="/activity-log" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-light-500 text-sm">Loading activity...</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-light-500 text-sm">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-light-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-light-800">{activity.description}</p>
                    <p className="text-xs text-light-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-light-900">Upcoming Events</h3>
          <Link href="/schedule" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View Calendar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-light-200 hover:border-primary-200 transition-colors">
            <div className="flex items-center gap-2 text-primary-600 text-sm font-medium mb-2">
              <Calendar className="w-4 h-4" />
              This Week
            </div>
            <p className="text-light-800 font-medium">Tomato Harvest</p>
            <p className="text-sm text-light-500">North Field - 200 lbs expected</p>
          </div>
          <div className="p-4 rounded-lg border border-light-200 hover:border-secondary-200 transition-colors">
            <div className="flex items-center gap-2 text-secondary-500 text-sm font-medium mb-2">
              <Truck className="w-4 h-4" />
              Saturday
            </div>
            <p className="text-light-800 font-medium">Food Distribution</p>
            <p className="text-sm text-light-500">Grace Community Church</p>
          </div>
          <div className="p-4 rounded-lg border border-light-200 hover:border-primary-200 transition-colors">
            <div className="flex items-center gap-2 text-primary-600 text-sm font-medium mb-2">
              <Users className="w-4 h-4" />
              Next Monday
            </div>
            <p className="text-light-800 font-medium">Volunteer Training</p>
            <p className="text-sm text-light-500">New volunteer orientation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
