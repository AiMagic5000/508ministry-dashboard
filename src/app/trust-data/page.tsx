'use client'

import { useEffect, useState } from 'react'
import { Building2, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { supabase, TrustData } from '@/lib/supabase'

export default function TrustDataPage() {
  const [trustData, setTrustData] = useState<TrustData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    trust_name: '',
    ein: '',
    formation_date: '',
    trustees: '',
    status: 'active'
  })

  useEffect(() => {
    fetchTrustData()
  }, [])

  async function fetchTrustData() {
    try {
      const { data, error } = await supabase
        .from('trust_data')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTrustData(data || [])
    } catch (error) {
      console.error('Error fetching trust data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const trustees = formData.trustees.split(',').map(t => t.trim())

      if (editingId) {
        const { error } = await supabase
          .from('trust_data')
          .update({ ...formData, trustees })
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('trust_data')
          .insert({ ...formData, trustees })
        if (error) throw error
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ trust_name: '', ein: '', formation_date: '', trustees: '', status: 'active' })
      fetchTrustData()
    } catch (error) {
      console.error('Error saving trust data:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this trust record?')) return
    try {
      const { error } = await supabase.from('trust_data').delete().eq('id', id)
      if (error) throw error
      fetchTrustData()
    } catch (error) {
      console.error('Error deleting trust data:', error)
    }
  }

  function handleEdit(trust: TrustData) {
    setFormData({
      trust_name: trust.trust_name,
      ein: trust.ein,
      formation_date: trust.formation_date,
      trustees: trust.trustees.join(', '),
      status: trust.status
    })
    setEditingId(trust.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary-600" />
            Trust Data
          </h2>
          <p className="text-light-500 mt-1">Manage 508(c)(1)(A) trust information</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ trust_name: '', ein: '', formation_date: '', trustees: '', status: 'active' }) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Trust Record
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Trust Record' : 'Add Trust Record'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Trust Name</label>
                <input
                  type="text"
                  value={formData.trust_name}
                  onChange={(e) => setFormData({ ...formData, trust_name: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">EIN</label>
                <input
                  type="text"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="XX-XXXXXXX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Formation Date</label>
                <input
                  type="date"
                  value={formData.formation_date}
                  onChange={(e) => setFormData({ ...formData, formation_date: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Trustees (comma-separated)</label>
                <input
                  type="text"
                  value={formData.trustees}
                  onChange={(e) => setFormData({ ...formData, trustees: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe, Jane Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-light-300 text-light-700 rounded-lg hover:bg-light-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-light-500">Loading...</div>
        ) : trustData.length === 0 ? (
          <div className="p-8 text-center text-light-500">No trust records found. Add your first trust record above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-50 border-b border-light-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Trust Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">EIN</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Formation Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Trustees</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Status</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-light-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200">
                {trustData.map((trust) => (
                  <tr key={trust.id} className="hover:bg-light-50">
                    <td className="px-6 py-4 text-sm text-light-900 font-medium">{trust.trust_name}</td>
                    <td className="px-6 py-4 text-sm text-light-600">{trust.ein}</td>
                    <td className="px-6 py-4 text-sm text-light-600">{new Date(trust.formation_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-light-600">{trust.trustees.join(', ')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        trust.status === 'active' ? 'bg-primary-50 text-primary-700' : 'bg-light-200 text-light-600'
                      }`}>
                        {trust.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {trust.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(trust)}
                          className="p-1 text-light-500 hover:text-primary-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(trust.id)}
                          className="p-1 text-light-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
