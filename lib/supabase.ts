import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  company: string
  role: string
  phone?: string
  avatar_url?: string
  status: 'active' | 'inactive' | 'suspended'
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  merchant_name: string
  merchant_category: string
  location: string
  card_number: string
  risk_level: 'high' | 'medium' | 'low' | 'pending'
  ai_analysis?: {
    risk_level: 'high' | 'medium' | 'low'
    reasoning: string
    risk_factors: string[]
    confidence: number
  }
  status: 'approved' | 'declined' | 'pending' | 'flagged'
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  user_id: string
  transaction_id?: string
  type: 'fraud' | 'anomaly' | 'pattern' | 'velocity' | 'geographic' | 'amount'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  message: string
  status: 'active' | 'investigating' | 'resolved' | 'dismissed'
  confidence: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface FraudRule {
  id: string
  name: string
  description: string
  type: 'amount' | 'velocity' | 'geographic' | 'pattern' | 'time'
  conditions: Record<string, any>
  action: 'block' | 'flag' | 'review'
  priority: number
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

// Auth functions
export const signUp = async (email: string, password: string, userData: {
  firstName: string
  lastName: string
  company: string
  phone?: string
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        company: userData.company,
        phone: userData.phone,
        role: 'analyst'
      }
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Database functions
export const getTransactions = async (limit = 50, offset = 0) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data
}

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getAlerts = async (limit = 50, offset = 0) => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data
}

export const createAlert = async (alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('alerts')
    .insert([alert])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateAlert = async (id: string, updates: Partial<Alert>) => {
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getFraudRules = async () => {
  const { data, error } = await supabase
    .from('fraud_rules')
    .select('*')
    .order('priority', { ascending: false })
  
  if (error) throw error
  return data
}

export const createFraudRule = async (rule: Omit<FraudRule, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('fraud_rules')
    .insert([rule])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateFraudRule = async (id: string, updates: Partial<FraudRule>) => {
  const { data, error } = await supabase
    .from('fraud_rules')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteFraudRule = async (id: string) => {
  const { error } = await supabase
    .from('fraud_rules')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Real-time subscriptions
export const subscribeToTransactions = (callback: (payload: any) => void) => {
  return supabase
    .channel('transactions')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'transactions' }, 
      callback
    )
    .subscribe()
}

export const subscribeToAlerts = (callback: (payload: any) => void) => {
  return supabase
    .channel('alerts')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'alerts' }, 
      callback
    )
    .subscribe()
}
