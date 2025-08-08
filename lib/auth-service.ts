'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AuthUser {
  id: string
  email?: string
  phone?: string
  user_metadata: {
    first_name?: string
    last_name?: string
    full_name?: string
    company?: string
    avatar_url?: string
  }
}

export class AuthService {
  // Email/Password Authentication
  static async signUpWithEmail(
    email: string, 
    password: string, 
    userData: {
      firstName: string
      lastName: string
      company: string
      phone?: string
    }
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`,
          company: userData.company,
          phone: userData.phone,
          role: 'user'
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Phone Authentication
  static async signUpWithPhone(
    phone: string, 
    password: string, 
    userData: {
      firstName: string
      lastName: string
      company: string
      email?: string
    }
  ) {
    const { data, error } = await supabase.auth.signUp({
      phone,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`,
          company: userData.company,
          email: userData.email,
          role: 'user'
        }
      }
    })

    if (error) throw error
    return data
  }

  static async signInWithPhone(phone: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password
    })

    if (error) throw error
    return data
  }

  // Phone OTP Authentication
  static async sendPhoneOTP(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: true
      }
    })

    if (error) throw error
    return data
  }

  static async verifyPhoneOTP(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })

    if (error) throw error
    return data
  }

  // Google OAuth Authentication
  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) throw error
    return data
  }

  // Password Reset
  static async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
    return data
  }

  static async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    })

    if (error) throw error
    return data
  }

  // Session Management
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Auth State Listener
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // User Profile Management
  static async updateUserProfile(updates: {
    first_name?: string
    last_name?: string
    company?: string
    phone?: string
    avatar_url?: string
  }) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })

    if (error) throw error
    return data
  }

  // Link Identity (for linking Google to existing account)
  static async linkGoogleIdentity() {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'google'
    })

    if (error) throw error
    return data
  }

  // Unlink Identity
  static async unlinkIdentity(identityId: string) {
    const { data, error } = await supabase.auth.unlinkIdentity({
      identity_id: identityId
    })

    if (error) throw error
    return data
  }

  // Get User Identities
  static async getUserIdentities() {
    const { data, error } = await supabase.auth.getUserIdentities()
    if (error) throw error
    return data
  }
}
