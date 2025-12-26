'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Edit2, Trash2, Phone, Mail, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase, Volunteer } from '@/lib/supabase'

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    skills: '',
    availability: [] as string[],
    status: 'active',
    hours_logged: 0
  })

  const availabilityOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    fetchVolunteers()
  }, [])

  async function fetchVolunteers() {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('last_name', { ascending: true })

      if (error) throw error
      setVolunteers(data || [])
    } catch (error) {
      console.error('Error fetching volunteers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        joined_date: editingId ? undefined : new Date().toISOString().split('T')[0]
      }

      if (editingId) {
        const { error } = await supabase.from('volunteers').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('volunteers').insert(payload)
        if (error) throw error
      }

      resetForm()
      fetchVolunteers()
    } catch (error) {
      console.error('Error saving volunteer:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this volunteer?')) return
    try {
      const { error } = await supabase.from('volunteers').delete().eq('id', id)
      if (error) throw error
      fetchVolunteers()
    } catch (error) {
      console.error('Error deleting volunteer:', error)
    }
  }

  function handleEdit(vol: Volunteer) {
    setFormData({
      first_name: vol.first_name,
      last_name: vol.last_name,
      email: vol.email,
      phone: vol.phone,
      skills: vol.skills.join(', '),
      availability: vol.availability,
      status: vol.status,
      hours_logged: vol.hours_logged
    })
    setEditingId(vol.id)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      skills: '',
      availability: [],
      status: 'active',
      hours_logged: 0
    })
  }

  function toggleAvailability(day: string) {
    const newAvailability = formData.availability.includes(day)
      ? formData.availability.filter(d => d !== day)
      : [...formData.availability, day]
    setFormData({ ...formData, availability: newAvailability })
  }

  const activeVolunteers = volunteers.filter(v => v.status === 'active').length
  const totalHours = volunteers.reduce((sum, v) => sum + v.hours_logged, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-primary-600" />
            Volunteers
          </h2>
          <p className="text-light-500 mt-1">{activeVolunteers} active volunteers • {totalHours} total hours</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Volunteer
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Volunteer' : 'Add Volunteer'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Farming, Driving, Cooking"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-2">Availability</label>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleAvailability(day)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.availability.includes(day)
                          ? 'bg-primary-500 text-white'
                          : 'bg-light-100 text-light-600 hover:bg-light-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                {editingId && (
                  <div>
                    <label className="block text-sm font-medium text-light-700 mb-1">Hours Logged</label>
                    <input
                      type="number"
                      value={formData.hours_logged}
                      onChange={(e) => setFormData({ ...formData, hours_logged: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-light-300 text-light-700 rounded-lg hover:bg-light-100">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-light-500">Loading...</div>
        ) : volunteers.length === 0 ? (
          <div className="col-span-full text-center py-8 text-light-500">No volunteers yet.</div>
        ) : (
          volunteers.map((vol) => (
            <div key={vol.id} className="bg-white rounded-xl p-5 shadow-sm border border-light-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {vol.first_name.charAt(0)}{vol.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-light-900">{vol.first_name} {vol.last_name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      vol.status === 'active' ? 'text-primary-600' : 'text-light-500'
                    }`}>
                      {vol.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {vol.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-light-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{vol.email}</span>
                </div>
                <div className="flex items-center gap-2 text-light-600">
                  <Phone className="w-4 h-4" />
                  <span>{vol.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-light-600">
                  <Clock className="w-4 h-4" />
                  <span>{vol.hours_logged} hours logged</span>
                </div>
              </div>

              {vol.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {vol.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-light-100 text-light-600 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {vol.skills.length > 3 && (
                    <span className="px-2 py-0.5 bg-light-100 text-light-600 rounded text-xs">
                      +{vol.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-light-200 flex justify-end gap-2">
                <button onClick={() => handleEdit(vol)} className="p-2 text-light-500 hover:text-primary-600 hover:bg-light-100 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(vol.id)} className="p-2 text-light-500 hover:text-red-600 hover:bg-light-100 rounded-lg">
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
