'use client'

import { useEffect, useState } from 'react'
import { Heart, Plus, Edit2, Trash2, DollarSign, Mail, Check } from 'lucide-react'
import { supabase, Donation } from '@/lib/supabase'

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    donor_name: string
    amount: string
    date: string
    type: 'cash' | 'check' | 'online' | 'in-kind'
    notes: string
    receipt_sent: boolean
  }>({
    donor_name: '',
    amount: '',
    date: '',
    type: 'cash',
    notes: '',
    receipt_sent: false
  })

  useEffect(() => {
    fetchDonations()
  }, [])

  async function fetchDonations() {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount) || 0
      }

      if (editingId) {
        const { error } = await supabase.from('donations').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('donations').insert(payload)
        if (error) throw error
      }

      resetForm()
      fetchDonations()
    } catch (error) {
      console.error('Error saving donation:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this donation record?')) return
    try {
      const { error } = await supabase.from('donations').delete().eq('id', id)
      if (error) throw error
      fetchDonations()
    } catch (error) {
      console.error('Error deleting donation:', error)
    }
  }

  async function toggleReceiptSent(id: string, currentValue: boolean) {
    try {
      const { error } = await supabase.from('donations').update({ receipt_sent: !currentValue }).eq('id', id)
      if (error) throw error
      fetchDonations()
    } catch (error) {
      console.error('Error updating receipt status:', error)
    }
  }

  function handleEdit(donation: Donation) {
    setFormData({
      donor_name: donation.donor_name,
      amount: donation.amount.toString(),
      date: donation.date,
      type: donation.type,
      notes: donation.notes || '',
      receipt_sent: donation.receipt_sent
    })
    setEditingId(donation.id)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ donor_name: '', amount: '', date: '', type: 'cash', notes: '', receipt_sent: false })
  }

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)

  const typeColors = {
    cash: 'bg-primary-50 text-primary-700',
    check: 'bg-secondary-50 text-secondary-700',
    online: 'bg-purple-50 text-purple-700',
    'in-kind': 'bg-orange-50 text-orange-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Heart className="w-7 h-7 text-primary-600" />
            Donations
          </h2>
          <p className="text-light-500 mt-1">Track and manage ministry donations</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Record Donation
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-50">
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-light-500">Total Donations</p>
            <p className="text-3xl font-bold text-light-900">${totalDonations.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Donation' : 'Record Donation'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Donor Name</label>
                <input
                  type="text"
                  value={formData.donor_name}
                  onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="online">Online</option>
                  <option value="in-kind">In-Kind</option>
                </select>
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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.receipt_sent}
                  onChange={(e) => setFormData({ ...formData, receipt_sent: e.target.checked })}
                  className="rounded border-light-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-light-700">Receipt Sent</span>
              </label>
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

      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-light-500">Loading...</div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-light-500">No donations recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-50 border-b border-light-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Donor</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Type</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-light-700">Receipt</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-light-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-light-50">
                    <td className="px-6 py-4 text-sm text-light-900 font-medium">{donation.donor_name}</td>
                    <td className="px-6 py-4 text-sm text-light-900 font-semibold">${donation.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-light-600">{new Date(donation.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColors[donation.type]}`}>
                        {donation.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleReceiptSent(donation.id, donation.receipt_sent)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          donation.receipt_sent ? 'bg-primary-50 text-primary-700' : 'bg-light-200 text-light-600'
                        }`}
                      >
                        {donation.receipt_sent ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                        {donation.receipt_sent ? 'Sent' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(donation)} className="p-1 text-light-500 hover:text-primary-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(donation.id)} className="p-1 text-light-500 hover:text-red-600">
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
