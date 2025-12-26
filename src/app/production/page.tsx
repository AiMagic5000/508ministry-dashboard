'use client'

import { useEffect, useState } from 'react'
import { Leaf, Plus, Edit2, Trash2, Sprout, Check } from 'lucide-react'
import { supabase, FarmProduction } from '@/lib/supabase'

export default function FarmProductionPage() {
  const [productions, setProductions] = useState<FarmProduction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    crop_name: '',
    variety: '',
    planted_date: '',
    harvest_date: '',
    quantity_lbs: '',
    status: 'planted',
    notes: ''
  })

  useEffect(() => {
    fetchProductions()
  }, [])

  async function fetchProductions() {
    try {
      const { data, error } = await supabase
        .from('farm_production')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProductions(data || [])
    } catch (error) {
      console.error('Error fetching productions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        quantity_lbs: parseFloat(formData.quantity_lbs) || 0,
        harvest_date: formData.harvest_date || null
      }

      if (editingId) {
        const { error } = await supabase
          .from('farm_production')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('farm_production').insert(payload)
        if (error) throw error
      }

      resetForm()
      fetchProductions()
    } catch (error) {
      console.error('Error saving production:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this production record?')) return
    try {
      const { error } = await supabase.from('farm_production').delete().eq('id', id)
      if (error) throw error
      fetchProductions()
    } catch (error) {
      console.error('Error deleting production:', error)
    }
  }

  function handleEdit(prod: FarmProduction) {
    setFormData({
      crop_name: prod.crop_name,
      variety: prod.variety,
      planted_date: prod.planted_date,
      harvest_date: prod.harvest_date || '',
      quantity_lbs: prod.quantity_lbs.toString(),
      status: prod.status,
      notes: prod.notes || ''
    })
    setEditingId(prod.id)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ crop_name: '', variety: '', planted_date: '', harvest_date: '', quantity_lbs: '', status: 'planted', notes: '' })
  }

  const statusColors = {
    planted: 'bg-yellow-50 text-yellow-700',
    growing: 'bg-primary-50 text-primary-700',
    harvested: 'bg-secondary-50 text-secondary-700',
    distributed: 'bg-light-200 text-light-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Leaf className="w-7 h-7 text-primary-600" />
            Farm Production
          </h2>
          <p className="text-light-500 mt-1">Track crops from planting to distribution</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log Production
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Production Record' : 'Log New Production'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  value={formData.crop_name}
                  onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Tomatoes"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Variety</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Roma"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Planted Date</label>
                  <input
                    type="date"
                    value={formData.planted_date}
                    onChange={(e) => setFormData({ ...formData, planted_date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={formData.harvest_date}
                    onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Quantity (lbs)</label>
                  <input
                    type="number"
                    value={formData.quantity_lbs}
                    onChange={(e) => setFormData({ ...formData, quantity_lbs: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="harvested">Harvested</option>
                    <option value="distributed">Distributed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-light-300 text-light-700 rounded-lg hover:bg-light-100">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-light-500">Loading...</div>
        ) : productions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-light-500">No production records yet.</div>
        ) : (
          productions.map((prod) => (
            <div key={prod.id} className="bg-white rounded-xl p-5 shadow-sm border border-light-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-50">
                    {prod.status === 'planted' ? <Sprout className="w-5 h-5 text-primary-600" /> :
                     prod.status === 'harvested' ? <Check className="w-5 h-5 text-primary-600" /> :
                     <Leaf className="w-5 h-5 text-primary-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-900">{prod.crop_name}</h3>
                    {prod.variety && <p className="text-sm text-light-500">{prod.variety}</p>}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[prod.status as keyof typeof statusColors]}`}>
                  {prod.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-light-500">Planted:</span>
                  <span className="text-light-700">{new Date(prod.planted_date).toLocaleDateString()}</span>
                </div>
                {prod.harvest_date && (
                  <div className="flex justify-between">
                    <span className="text-light-500">Harvested:</span>
                    <span className="text-light-700">{new Date(prod.harvest_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-light-500">Quantity:</span>
                  <span className="font-medium text-light-900">{prod.quantity_lbs} lbs</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-light-200 flex justify-end gap-2">
                <button onClick={() => handleEdit(prod)} className="p-2 text-light-500 hover:text-primary-600 hover:bg-light-100 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(prod.id)} className="p-2 text-light-500 hover:text-red-600 hover:bg-light-100 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
