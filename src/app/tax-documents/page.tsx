'use client'

import { useState } from 'react'
import { Receipt, Download, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

interface TaxDocument {
  id: string
  name: string
  year: string
  type: string
  status: 'filed' | 'pending' | 'due'
  dueDate?: string
  fileUrl?: string
}

export default function TaxDocumentsPage() {
  const [documents] = useState<TaxDocument[]>([
    { id: '1', name: 'Form 990-N (e-Postcard)', year: '2024', type: 'Annual Filing', status: 'pending', dueDate: '2025-05-15' },
    { id: '2', name: 'Form 990-N (e-Postcard)', year: '2023', type: 'Annual Filing', status: 'filed', fileUrl: '#' },
    { id: '3', name: 'Form 990-N (e-Postcard)', year: '2022', type: 'Annual Filing', status: 'filed', fileUrl: '#' },
    { id: '4', name: 'IRS Determination Letter', year: '2022', type: '508(c)(1)(A) Status', status: 'filed', fileUrl: '#' },
    { id: '5', name: 'State Registration', year: '2024', type: 'Florida', status: 'filed', fileUrl: '#' },
  ])
  const [selectedYear, setSelectedYear] = useState('all')

  const years = ['all', '2024', '2023', '2022']

  const filteredDocs = selectedYear === 'all'
    ? documents
    : documents.filter(d => d.year === selectedYear)

  const statusConfig = {
    filed: { color: 'bg-primary-50 text-primary-700', icon: CheckCircle, label: 'Filed' },
    pending: { color: 'bg-yellow-50 text-yellow-700', icon: AlertCircle, label: 'Pending' },
    due: { color: 'bg-red-50 text-red-700', icon: AlertCircle, label: 'Due' }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-primary-600" />
            Tax Documents
          </h2>
          <p className="text-light-500 mt-1">508(c)(1)(A) tax filings and compliance documents</p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-primary-800">508(c)(1)(A) Tax-Exempt Status</h3>
            <p className="text-sm text-primary-700 mt-1">
              As a 508(c)(1)(A) organization, Harvest Hope Farm Ministry is exempt from federal income tax
              and is not required to apply for 501(c)(3) status. Annual filing of Form 990-N is recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Year Filter */}
      <div className="flex gap-2">
        {years.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedYear === year
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-light-300 text-light-700 hover:bg-light-100'
            }`}
          >
            {year === 'all' ? 'All Years' : year}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        <div className="divide-y divide-light-200">
          {filteredDocs.map((doc) => {
            const status = statusConfig[doc.status]
            const StatusIcon = status.icon
            return (
              <div key={doc.id} className="p-4 hover:bg-light-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-light-100">
                    <FileText className="w-5 h-5 text-light-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-light-900">{doc.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-light-600">{doc.type}</span>
                      <span className="text-sm text-light-500">Tax Year {doc.year}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    {doc.dueDate && (
                      <span className="flex items-center gap-1 text-sm text-light-500">
                        <Calendar className="w-4 h-4" />
                        Due {new Date(doc.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        className="p-2 text-light-500 hover:text-primary-600 hover:bg-light-100 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Helpful Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <h3 className="font-semibold text-light-900 mb-4">Helpful Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://www.irs.gov/charities-non-profits/annual-electronic-filing-requirement-for-small-exempt-organizations-form-990-n-e-postcard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-light-900">IRS Form 990-N Guide</p>
              <p className="text-sm text-light-500">Annual e-Postcard filing instructions</p>
            </div>
          </a>
          <a
            href="https://www.startmybusiness.us/create-a-508-c1a-you-can-put-your-llc-or-corp-into"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <Receipt className="w-5 h-5 text-primary-600" />
            <div>
              <p className="font-medium text-light-900">508(c)(1)(A) Services</p>
              <p className="text-sm text-light-500">Start My Business - 508 formation help</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
