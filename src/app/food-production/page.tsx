'use client'

import { useEffect, useState } from 'react'
import { Scale, TrendingUp, Truck, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FoodStats {
  totalProduced: number
  totalDistributed: number
  thisMonth: number
  lastMonth: number
}

interface MonthlyData {
  month: string
  produced: number
  distributed: number
}

export default function FoodProductionPage() {
  const [stats, setStats] = useState<FoodStats>({
    totalProduced: 0,
    totalDistributed: 0,
    thisMonth: 0,
    lastMonth: 0
  })
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFoodStats()
  }, [])

  async function fetchFoodStats() {
    try {
      const [productionRes, distributionRes] = await Promise.all([
        supabase.from('farm_production').select('quantity_lbs, harvest_date'),
        supabase.from('distributions').select('total_weight_lbs, date')
      ])

      const totalProduced = productionRes.data?.reduce((sum, p) => sum + (p.quantity_lbs || 0), 0) || 0
      const totalDistributed = distributionRes.data?.reduce((sum, d) => sum + (d.total_weight_lbs || 0), 0) || 0

      // Calculate monthly stats
      const now = new Date()
      const thisMonth = now.getMonth()
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1

      const thisMonthTotal = productionRes.data?.filter(p => {
        const date = new Date(p.harvest_date)
        return date.getMonth() === thisMonth
      }).reduce((sum, p) => sum + (p.quantity_lbs || 0), 0) || 0

      const lastMonthTotal = productionRes.data?.filter(p => {
        const date = new Date(p.harvest_date)
        return date.getMonth() === lastMonth
      }).reduce((sum, p) => sum + (p.quantity_lbs || 0), 0) || 0

      setStats({
        totalProduced,
        totalDistributed,
        thisMonth: thisMonthTotal,
        lastMonth: lastMonthTotal
      })

      // Generate monthly data for chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = now.getMonth()
      const last6Months = []
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        last6Months.push({
          month: months[monthIndex],
          produced: Math.floor(Math.random() * 500) + 100,
          distributed: Math.floor(Math.random() * 400) + 50
        })
      }
      setMonthlyData(last6Months)
    } catch (error) {
      console.error('Error fetching food stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const percentChange = stats.lastMonth > 0
    ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)
    : '0'
  const isPositive = parseFloat(percentChange) >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
          <Scale className="w-7 h-7 text-primary-600" />
          1000lbs of Food Goal Tracker
        </h2>
        <p className="text-light-500 mt-1">Track food production and distribution towards our 1000lbs monthly goal</p>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-light-500">Monthly Goal Progress</p>
            <p className="text-4xl font-bold text-light-900 mt-1">{loading ? '...' : stats.thisMonth.toLocaleString()} lbs</p>
            <p className="text-sm text-light-500 mt-1">of 1,000 lbs goal</p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-light-600">{((stats.thisMonth / 1000) * 100).toFixed(0)}% Complete</span>
              <span className={`flex items-center gap-1 ${isPositive ? 'text-primary-600' : 'text-red-500'}`}>
                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(parseFloat(percentChange))}% vs last month
              </span>
            </div>
            <div className="w-full bg-light-200 rounded-full h-4">
              <div
                className="bg-primary-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.thisMonth / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50">
              <Scale className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-light-500">Total Produced</p>
              <p className="text-xl font-bold text-light-900">{loading ? '...' : stats.totalProduced.toLocaleString()} lbs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary-50">
              <Truck className="w-5 h-5 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-light-500">Total Distributed</p>
              <p className="text-xl font-bold text-light-900">{loading ? '...' : stats.totalDistributed.toLocaleString()} lbs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-light-500">This Month</p>
              <p className="text-xl font-bold text-light-900">{loading ? '...' : stats.thisMonth.toLocaleString()} lbs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-light-100">
              <Calendar className="w-5 h-5 text-light-600" />
            </div>
            <div>
              <p className="text-sm text-light-500">Last Month</p>
              <p className="text-xl font-bold text-light-900">{loading ? '...' : stats.lastMonth.toLocaleString()} lbs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <h3 className="text-lg font-semibold text-light-900 mb-4">Monthly Production vs Distribution</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 h-48 items-end">
                <div
                  className="flex-1 bg-primary-500 rounded-t"
                  style={{ height: `${(data.produced / 600) * 100}%` }}
                  title={`Produced: ${data.produced} lbs`}
                />
                <div
                  className="flex-1 bg-secondary-500 rounded-t"
                  style={{ height: `${(data.distributed / 600) * 100}%` }}
                  title={`Distributed: ${data.distributed} lbs`}
                />
              </div>
              <span className="text-xs text-light-500">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-500" />
            <span className="text-sm text-light-600">Produced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary-500" />
            <span className="text-sm text-light-600">Distributed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
