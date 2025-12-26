'use client'

import { useEffect, useState } from 'react'
import { FileText, Plus, Download, Trash2, Upload, Folder, File } from 'lucide-react'
import { supabase, Document } from '@/lib/supabase'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this document?')) return
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id)
      if (error) throw error
      fetchDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const filteredDocs = filter === 'all'
    ? documents
    : documents.filter(d => d.category === filter)

  const categoryColors: Record<string, string> = {
    tax: 'bg-primary-50 text-primary-700',
    legal: 'bg-secondary-50 text-secondary-700',
    compliance: 'bg-purple-50 text-purple-700',
    other: 'bg-light-100 text-light-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-600" />
            Documents
          </h2>
          <p className="text-light-500 mt-1">Ministry documents and files</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'tax', 'legal', 'compliance', 'other'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-light-300 text-light-700 hover:bg-light-100'
            }`}
          >
            {cat === 'all' ? 'All Documents' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-light-900 mb-4">Upload Document</h3>
            <div className="border-2 border-dashed border-light-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-light-400 mx-auto mb-4" />
              <p className="text-light-600 mb-2">Drag and drop files here</p>
              <p className="text-sm text-light-500">or click to browse</p>
              <input type="file" className="hidden" />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-light-300 text-light-700 rounded-lg hover:bg-light-100"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-light-500">Loading documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-light-500">
            <Folder className="w-12 h-12 text-light-300 mx-auto mb-4" />
            <p>No documents found</p>
          </div>
        ) : (
          <div className="divide-y divide-light-200">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-light-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-light-100">
                    <File className="w-5 h-5 text-light-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-light-900">{doc.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[doc.category]}`}>
                        {doc.category}
                      </span>
                      <span className="text-xs text-light-500">{doc.type}</span>
                      <span className="text-xs text-light-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-light-500 hover:text-primary-600 hover:bg-light-100 rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-light-500 hover:text-red-600 hover:bg-light-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
