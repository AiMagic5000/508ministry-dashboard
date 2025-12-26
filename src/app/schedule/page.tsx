'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, Edit2, Trash2, Clock, MapPin } from 'lucide-react'
import { supabase, ScheduleEvent } from '@/lib/supabase'

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    start_date: string
    end_date: string
    location: string
    type: 'harvest' | 'distribution' | 'volunteer' | 'meeting' | 'other'
  }>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    type: 'other'
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .order('start_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase.from('schedule_events').update(formData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('schedule_events').insert(formData)
        if (error) throw error
      }
      resetForm()
      fetchEvents()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    try {
      const { error } = await supabase.from('schedule_events').delete().eq('id', id)
      if (error) throw error
      fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  function handleEdit(event: ScheduleEvent) {
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: event.start_date,
      end_date: event.end_date || '',
      location: event.location || '',
      type: event.type
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', description: '', start_date: '', end_date: '', location: '', type: 'other' })
  }

  const typeColors = {
    harvest: 'bg-primary-50 text-primary-700 border-primary-200',
    distribution: 'bg-secondary-50 text-secondary-700 border-secondary-200',
    volunteer: 'bg-purple-50 text-purple-700 border-purple-200',
    meeting: 'bg-orange-50 text-orange-700 border-orange-200',
    other: 'bg-light-100 text-light-700 border-light-300'
  }

  const upcomingEvents = events.filter(e => new Date(e.start_date) >= new Date())

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary-600" />
            Schedule
          </h2>
          <p className="text-light-500 mt-1">{upcomingEvents.length} upcoming events</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-light-900 mb-4">
              {editingId ? 'Edit Event' : 'Add Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">Start Date/Time</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-700 mb-1">End Date/Time</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-light-700 mb-1">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="harvest">Harvest</option>
                  <option value="distribution">Distribution</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
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
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-8 text-light-500">No events scheduled.</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`rounded-xl p-5 border-2 ${typeColors[event.type]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium uppercase">{event.type}</span>
                  <h3 className="font-semibold text-light-900 mt-1">{event.title}</h3>
                </div>
              </div>
              {event.description && (
                <p className="text-sm text-light-600 mt-2">{event.description}</p>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-light-600">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(event.start_date).toLocaleString()}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-light-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-current/10 flex justify-end gap-2">
                <button onClick={() => handleEdit(event)} className="p-2 hover:bg-white/50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-white/50 rounded-lg">
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
