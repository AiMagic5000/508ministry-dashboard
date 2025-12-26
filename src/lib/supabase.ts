import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cognabase.com'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface TrustData {
  id: string
  trust_name: string
  ein: string
  formation_date: string
  trustees: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_name: string
  amount: number
  date: string
  type: 'cash' | 'check' | 'online' | 'in-kind'
  notes?: string
  receipt_sent: boolean
  created_at: string
}

export interface PartnerChurch {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  contact_name: string
  contact_email: string
  contact_phone: string
  partnership_date: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface Distribution {
  id: string
  partner_id: string
  partner_name: string
  date: string
  items: DistributionItem[]
  total_weight_lbs: number
  notes?: string
  created_at: string
}

export interface DistributionItem {
  name: string
  quantity: number
  weight_lbs: number
  category: string
}

export interface Volunteer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  skills: string[]
  availability: string[]
  status: 'active' | 'inactive'
  hours_logged: number
  joined_date: string
  created_at: string
}

export interface FarmProduction {
  id: string
  crop_name: string
  variety: string
  planted_date: string
  harvest_date?: string
  quantity_lbs: number
  status: 'planted' | 'growing' | 'harvested' | 'distributed'
  notes?: string
  created_at: string
}

export interface ScheduleEvent {
  id: string
  title: string
  description?: string
  start_date: string
  end_date?: string
  location?: string
  type: 'harvest' | 'distribution' | 'volunteer' | 'meeting' | 'other'
  created_at: string
}

export interface Document {
  id: string
  name: string
  type: string
  category: 'tax' | 'legal' | 'compliance' | 'other'
  file_url: string
  uploaded_by: string
  created_at: string
}

export interface ActivityLog {
  id: string
  action: string
  description: string
  user: string
  timestamp: string
  category: string
}
