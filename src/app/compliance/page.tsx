'use client'

import { useState } from 'react'
import { Shield, CheckCircle, AlertTriangle, Clock, FileText, ExternalLink } from 'lucide-react'

interface ComplianceItem {
  id: string
  title: string
  description: string
  status: 'compliant' | 'attention' | 'pending'
  dueDate?: string
  lastReviewed?: string
  category: string
}

export default function CompliancePage() {
  const [items] = useState<ComplianceItem[]>([
    {
      id: '1',
      title: '508(c)(1)(A) Status Maintained',
      description: 'Organization operates as a faith-based agricultural ministry under 508(c)(1)(A)',
      status: 'compliant',
      lastReviewed: '2024-12-01',
      category: 'Tax Status'
    },
    {
      id: '2',
      title: 'Annual Filing (Form 990-N)',
      description: 'e-Postcard filed for current tax year',
      status: 'pending',
      dueDate: '2025-05-15',
      category: 'IRS Filings'
    },
    {
      id: '3',
      title: 'Trust Agreement on File',
      description: 'Original trust documents and amendments maintained',
      status: 'compliant',
      lastReviewed: '2024-11-15',
      category: 'Governance'
    },
    {
      id: '4',
      title: 'Meeting Minutes',
      description: 'Board meeting minutes documented and retained',
      status: 'compliant',
      lastReviewed: '2024-12-15',
      category: 'Governance'
    },
    {
      id: '5',
      title: 'Food Safety Compliance',
      description: 'Agricultural operations follow food safety guidelines',
      status: 'compliant',
      lastReviewed: '2024-12-01',
      category: 'Operations'
    },
    {
      id: '6',
      title: 'Volunteer Background Checks',
      description: 'Active volunteers have completed background screening',
      status: 'attention',
      category: 'Operations'
    },
    {
      id: '7',
      title: 'Donation Receipts',
      description: 'Written acknowledgment provided for donations over $250',
      status: 'compliant',
      lastReviewed: '2024-12-20',
      category: 'Financial'
    },
    {
      id: '8',
      title: 'State Registration',
      description: 'Registered with Florida Department of Agriculture',
      status: 'compliant',
      lastReviewed: '2024-01-15',
      category: 'State Compliance'
    }
  ])

  const statusConfig = {
    compliant: { color: 'bg-primary-50 text-primary-700 border-primary-200', icon: CheckCircle, label: 'Compliant' },
    attention: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'Needs Attention' },
    pending: { color: 'bg-secondary-50 text-secondary-700 border-secondary-200', icon: Clock, label: 'Pending' }
  }

  const categories = Array.from(new Set(items.map(i => i.category)))
  const compliantCount = items.filter(i => i.status === 'compliant').length
  const attentionCount = items.filter(i => i.status === 'attention').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary-600" />
            Compliance
          </h2>
          <p className="text-light-500 mt-1">508(c)(1)(A) compliance status and requirements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-900">{compliantCount}</p>
              <p className="text-sm text-light-500">Compliant Items</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-900">{attentionCount}</p>
              <p className="text-sm text-light-500">Need Attention</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary-50">
              <Shield className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-light-900">{Math.round((compliantCount / items.length) * 100)}%</p>
              <p className="text-sm text-light-500">Overall Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Items by Category */}
      {categories.map(category => (
        <div key={category} className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-light-200 bg-light-50">
            <h3 className="font-semibold text-light-900">{category}</h3>
          </div>
          <div className="divide-y divide-light-200">
            {items.filter(i => i.category === category).map(item => {
              const status = statusConfig[item.status]
              const StatusIcon = status.icon
              return (
                <div key={item.id} className="p-4 hover:bg-light-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-1.5 rounded-lg ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-light-900">{item.title}</h4>
                      <p className="text-sm text-light-600 mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-light-500">
                        {item.lastReviewed && (
                          <span>Last reviewed: {new Date(item.lastReviewed).toLocaleDateString()}</span>
                        )}
                        {item.dueDate && (
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Resources */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-light-200">
        <h3 className="font-semibold text-light-900 mb-4">Compliance Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://www.irs.gov/pub/irs-pdf/p1828.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <div className="flex-1">
              <p className="font-medium text-light-900">IRS Publication 1828</p>
              <p className="text-sm text-light-500">Tax Guide for Churches</p>
            </div>
            <ExternalLink className="w-4 h-4 text-light-400" />
          </a>
          <a
            href="https://www.startmybusiness.us/create-a-508-c1a-you-can-put-your-llc-or-corp-into"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-primary-600" />
            <div className="flex-1">
              <p className="font-medium text-light-900">508(c)(1)(A) Support</p>
              <p className="text-sm text-light-500">Professional compliance assistance</p>
            </div>
            <ExternalLink className="w-4 h-4 text-light-400" />
          </a>
        </div>
      </div>
    </div>
  )
}
