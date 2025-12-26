'use client'

import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, Phone, FileText, Video } from 'lucide-react'

export default function HelpPage() {
  const faqs = [
    {
      question: 'What is a 508(c)(1)(A) organization?',
      answer: 'A 508(c)(1)(A) organization is a faith-based religious organization that is automatically tax-exempt under the Internal Revenue Code. Unlike 501(c)(3) organizations, 508(c)(1)(A) organizations are not required to apply for recognition of tax-exempt status from the IRS.'
    },
    {
      question: 'How do I record a donation?',
      answer: 'Navigate to the Donations page from the sidebar. Click "Record Donation" and fill in the donor information, amount, date, and type of donation. You can also track whether a receipt has been sent.'
    },
    {
      question: 'How do I add a new partner church?',
      answer: 'Go to Partner Churches in the sidebar and click "Add Partner". Fill in the church details including name, address, and contact information. You can set the partnership status as active or inactive.'
    },
    {
      question: 'How do I track food production?',
      answer: 'Use the Farm Production page to log crops from planting to harvest. You can track crop name, variety, dates, quantity, and status. The 1000lbs of Food page shows your progress toward the monthly goal.'
    },
    {
      question: 'How do I schedule a distribution?',
      answer: 'Go to the Schedule page and click "Add Event". Select "Distribution" as the event type, choose the date, location (partner church), and add any relevant notes.'
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-light-900 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-primary-600" />
          Help & Support
        </h2>
        <p className="text-light-500 mt-1">Get help with using the Harvest Hope Farm Dashboard</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="#faq"
          className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-light-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
        >
          <Book className="w-8 h-8 text-primary-600" />
          <span className="font-medium text-light-900">FAQ</span>
        </a>
        <a
          href="mailto:support@harvesthope.org"
          className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-light-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
        >
          <Mail className="w-8 h-8 text-primary-600" />
          <span className="font-medium text-light-900">Email Support</span>
        </a>
        <a
          href="https://www.startmybusiness.us"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-light-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
        >
          <ExternalLink className="w-8 h-8 text-primary-600" />
          <span className="font-medium text-light-900">508 Services</span>
        </a>
        <a
          href="#contact"
          className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl border border-light-200 hover:border-primary-200 hover:bg-primary-50 transition-colors"
        >
          <MessageCircle className="w-8 h-8 text-primary-600" />
          <span className="font-medium text-light-900">Contact Us</span>
        </a>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-light-200">
          <h3 className="font-semibold text-light-900">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-light-200">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-light-50">
                <span className="font-medium text-light-900">{faq.question}</span>
                <span className="text-light-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-light-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-white rounded-xl shadow-sm border border-light-200 p-6">
        <h3 className="font-semibold text-light-900 mb-4">Contact Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-50">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-light-500">Email</p>
                <p className="font-medium text-light-900">support@harvesthope.org</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-50">
                <Phone className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-light-500">Phone</p>
                <p className="font-medium text-light-900">(305) 555-0123</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-light-600 mb-4">
              Need help with 508(c)(1)(A) formation, compliance, or ministry management?
              Our partners at Start My Business can assist you.
            </p>
            <a
              href="https://www.startmybusiness.us/create-a-508-c1a-you-can-put-your-llc-or-corp-into"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Visit 508 Services
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-light-200 p-6">
        <h3 className="font-semibold text-light-900 mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="#"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 transition-colors"
          >
            <FileText className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-light-900">User Guide</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 transition-colors"
          >
            <Video className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-light-900">Video Tutorials</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 border border-light-200 rounded-lg hover:border-primary-200 transition-colors"
          >
            <Book className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-light-900">Documentation</span>
          </a>
        </div>
      </div>
    </div>
  )
}
