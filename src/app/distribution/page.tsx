'use client'

import { useEffect, useState } from 'react'
import { Truck, Plus, Edit2, Trash2, MapPin, Calendar, Package } from 'lucide-react'
import { supabase, Distribution } from '@/lib/supabase'

export default function DistributionPage() {
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [partners, setPartners] = useState<{id: string, name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    partner_id: '',
    partner_name: '',
    date: '',
    items: [{ name: '', quantity: 1, weight_lbs: 0, category: 'produce' }],
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [distRes, partnerRes] = await Promise.all([
        supabase.from('distributions').select('*').order('date', { ascending: false }),
        supabase.from('partner_churches').select('id, name').eq('status', 'active')
      ])

      setDistributions(distRes.data || [])
      setPartners(partnerRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const selectedPartner = partners.find(p => p.id === formData.partner_id)
      const totalWeight = formData.items.reduce((sum, item) => sum + item.weight_lbs, 0)

      const payload = {
        partner_id: formData.partner_id,
        partner_name: selectedPartner?.name || formData.partner_name,
        date: formData.date,
        items: formData.items,
        total_weight_lbs: totalWeight,
        notes: formData.notes
      }

      if (editingId) {
        const { error } = await supabase.from('distributions').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('distributions').insert(payload)
        if (error) throw error
      }

      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving distribution:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this distribution record?')) return
    try {
      const { error } = await supabase.from('distributions').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting distribution:', error)
    }
  }

  function handleEdit(dist: Distribution) {
    setFormData({
      partner_id: dist.partner_id,
      partner_name: dist.partner_name,
      date: dist.date,
      items: dist.items || [{ name: '', quantity: 1, weight_lbs: 0, category: 'produce' }],
      notes: dist.notes || ''
    })
    setEditingId(dist.id)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      partner_id: '',
      partner_name: '',
      date: '',
      items: [{ name: '', quantity: 1, weight_lbs: 0, category: 'produce' }],
      notes: ''
    })
  }

  function addItem() {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, weight_lbs: 0, category: 'produce' }]
    })
  }

  function updateItem(index: number, field: string, value: any) {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  function removeItem(index: number) {
    if (formData.items.length <= 1) return
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const totalDistributed = distributions.reduce((sum, d) => sum + d.total_weight_lbs, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Truck className="w-7 h-7 text-primary-600" />
            Distribution
          </h2>
          <p className="text-light-500 mt-1">Track food deliveries to partner churches</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Record Distribution
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-secondary-50">
            <Package className="w-8 h-8 text-secondary-500" />
          </div>
          <div>
            <p className="text-sm text-light-500">Total Food Distributed</p>
            <p className="text-3xl font-bold text-light-900">{totalDistributed.toLocaleString()} lbs</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Distribution' : 'Record Distribution'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Partner Church</label>
                  <select
                    value={formData.partner_id}
                    onChange={(e) => setFormData({ ...formData, partner_id: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select partner...</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Distribution Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-light-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-light-700">Items Distributed</p>
                  <button type="button" onClick={addItem} className="text-sm text-primary-600 hover:text-primary-700">
                    + Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        placeholder="Item name"
                        className="flex-1 px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        placeholder="Qty"
                        className="w-20 px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        value={item.weight_lbs}
                        onChange={(e) => updateItem(index, 'weight_lbs', parseFloat(e.target.value))}
                        placeholder="Weight (lbs)"
                        className="w-28 px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        min="0"
                        step="0.1"
                        required
                      />
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        className="w-28 px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="produce">Produce</option>
                        <option value="dairy">Dairy</option>
                        <option value="protein">Protein</option>
                        <option value="grains">Grains</option>
                        <option value="other">Other</option>
                      </select>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-light-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-light-300 text-light-700 rounded-lg hover:bg-light-100">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  {editingId ? 'Update' : 'Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-light-500">Loading...</div>
        ) : distributions.length === 0 ? (
          <div className="p-8 text-center text-light-500">No distributions recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-50 border-b border-light-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Partner Church</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Items</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Total Weight</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-light-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200">
                {distributions.map((dist) => (
                  <tr key={dist.id} className="hover:bg-light-50">
                    <td className="px-6 py-4 text-sm text-light-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(dist.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-light-900 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-light-400" />
                        {dist.partner_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-light-600">
                      {dist.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-light-900">
                      {dist.total_weight_lbs} lbs
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(dist)} className="p-1 text-light-500 hover:text-primary-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(dist.id)} className="p-1 text-light-500 hover:text-red-600">
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
