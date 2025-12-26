'use client'

import { useState } from 'react'
import { Mic, Play, Square, Download, Trash2, Clock } from 'lucide-react'

interface Recording {
  id: string
  title: string
  duration: string
  date: string
  transcript?: string
}

export default function MeetingsPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      title: 'Board Meeting - December 2024',
      duration: '45:32',
      date: '2024-12-15',
      transcript: 'Meeting notes and action items discussed...'
    },
    {
      id: '2',
      title: 'Volunteer Orientation',
      duration: '28:15',
      date: '2024-12-10',
      transcript: 'Welcome and training overview...'
    }
  ])
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)

  function toggleRecording() {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording logic would go here
      console.log('Started recording')
    } else {
      // Stop recording and save
      console.log('Stopped recording')
    }
  }

  function deleteRecording(id: string) {
    if (!confirm('Delete this recording?')) return
    setRecordings(recordings.filter(r => r.id !== id))
    if (selectedRecording?.id === id) {
      setSelectedRecording(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Mic className="w-7 h-7 text-primary-600" />
            Meeting Recorder
          </h2>
          <p className="text-light-500 mt-1">Record and transcribe ministry meetings</p>
        </div>
      </div>

      {/* Recording Control */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={toggleRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          <p className="text-light-600">
            {isRecording ? 'Recording in progress...' : 'Click to start recording'}
          </p>
          {isRecording && (
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono">00:00:00</span>
            </div>
          )}
        </div>
      </div>

      {/* Recordings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-light-200">
          <div className="p-4 border-b border-light-200">
            <h3 className="font-semibold text-light-900">Recent Recordings</h3>
          </div>
          <div className="divide-y divide-light-200">
            {recordings.length === 0 ? (
              <div className="p-8 text-center text-light-500">No recordings yet</div>
            ) : (
              recordings.map((recording) => (
                <div
                  key={recording.id}
                  onClick={() => setSelectedRecording(recording)}
                  className={`p-4 cursor-pointer hover:bg-light-50 transition-colors ${
                    selectedRecording?.id === recording.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-light-900">{recording.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-light-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recording.duration}
                        </span>
                        <span>{new Date(recording.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-light-500 hover:text-primary-600 hover:bg-light-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteRecording(recording.id); }}
                        className="p-2 text-light-500 hover:text-red-600 hover:bg-light-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transcript View */}
        <div className="bg-white rounded-xl shadow-sm border border-light-200">
          <div className="p-4 border-b border-light-200">
            <h3 className="font-semibold text-light-900">Transcript</h3>
          </div>
          <div className="p-4">
            {selectedRecording ? (
              <div>
                <h4 className="font-medium text-light-900 mb-2">{selectedRecording.title}</h4>
                <p className="text-sm text-light-600 whitespace-pre-wrap">
                  {selectedRecording.transcript || 'No transcript available for this recording.'}
                </p>
              </div>
            ) : (
              <p className="text-light-500 text-center py-8">
                Select a recording to view its transcript
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
