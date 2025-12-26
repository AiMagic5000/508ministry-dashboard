'use client'

import { useEffect, useState } from 'react'
import { Activity, RefreshCw, Filter } from 'lucide-react'
import { supabase, ActivityLog } from '@/lib/supabase'

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching activity log:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.category === filter)

  const categories = ['all', ...Array.from(new Set(logs.map(l => l.category)))]

  const categoryColors: Record<string, string> = {
    donation: 'bg-pink-50 text-pink-700',
    production: 'bg-primary-50 text-primary-700',
    distribution: 'bg-secondary-50 text-secondary-700',
    volunteer: 'bg-purple-50 text-purple-700',
    system: 'bg-light-100 text-light-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary-600" />
            AI Activity Log
          </h2>
          <p className="text-light-500 mt-1">System activity and AI-assisted operations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-light-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-light-100 text-light-700 rounded-lg hover:bg-light-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-light-500">Loading activity log...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-light-500">No activity recorded yet.</div>
        ) : (
          <div className="divide-y divide-light-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-light-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-light-900">{log.action}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[log.category] || 'bg-light-100 text-light-700'}`}>
                        {log.category}
                      </span>
                    </div>
                    <p className="text-sm text-light-600 mt-1">{log.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-light-500">
                      <span>{log.user}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
