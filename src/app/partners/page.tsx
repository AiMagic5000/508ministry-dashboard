'use client'

import { useEffect, useState } from 'react'
import { Church, Plus, Edit2, Trash2, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react'
import { supabase, PartnerChurch } from '@/lib/supabase'

export default function PartnerChurchesPage() {
  const [partners, setPartners] = useState<PartnerChurch[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: 'FL',
    zip: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    partnership_date: '',
    status: 'active'
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    try {
      const { data, error } = await supabase
        .from('partner_churches')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setPartners(data || [])
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase.from('partner_churches').update(formData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('partner_churches').insert(formData)
        if (error) throw error
      }

      resetForm()
      fetchPartners()
    } catch (error) {
      console.error('Error saving partner:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this partner church?')) return
    try {
      const { error } = await supabase.from('partner_churches').delete().eq('id', id)
      if (error) throw error
      fetchPartners()
    } catch (error) {
      console.error('Error deleting partner:', error)
    }
  }

  function handleEdit(partner: PartnerChurch) {
    setFormData({
      name: partner.name,
      address: partner.address,
      city: partner.city,
      state: partner.state,
      zip: partner.zip,
      contact_name: partner.contact_name,
      contact_email: partner.contact_email,
      contact_phone: partner.contact_phone,
      partnership_date: partner.partnership_date,
      status: partner.status
    })
    setEditingId(partner.id)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', address: '', city: '', state: 'FL', zip: '', contact_name: '', contact_email: '', contact_phone: '', partnership_date: '', status: 'active' })
  }

  const activePartners = partners.filter(p => p.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Church className="w-7 h-7 text-primary-600" />
            Partner Churches
          </h2>
          <p className="text-light-500 mt-1">{activePartners} active church partners</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Partner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Partner Church' : 'Add Partner Church'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Church Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    maxLength={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="border-t border-light-200 pt-4">
                <p className="text-sm font-medium text-light-700 mb-3">Contact Information</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-light-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-light-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-light-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Partnership Date</label>
                  <input
                    type="date"
                    value={formData.partnership_date}
                    onChange={(e) => setFormData({ ...formData, partnership_date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
        ) : partners.length === 0 ? (
          <div className="col-span-full text-center py-8 text-light-500">No partner churches yet.</div>
        ) : (
          partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl p-5 shadow-sm border border-light-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary-50">
                    <Church className="w-5 h-5 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-900">{partner.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      partner.status === 'active' ? 'text-primary-600' : 'text-light-500'
                    }`}>
                      {partner.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {partner.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start gap-2 text-light-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{partner.address}, {partner.city}, {partner.state} {partner.zip}</span>
                </div>
                <div className="flex items-center gap-2 text-light-600">
                  <Phone className="w-4 h-4" />
                  <span>{partner.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-light-600">
                  <Mail className="w-4 h-4" />
                  <span>{partner.contact_email}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-light-200 flex items-center justify-between">
                <span className="text-xs text-light-500">Partner since {new Date(partner.partnership_date).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(partner)} className="p-2 text-light-500 hover:text-primary-600 hover:bg-light-100 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(partner.id)} className="p-2 text-light-500 hover:text-red-600 hover:bg-light-100 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
