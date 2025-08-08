'use client'

import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const useAuth = () => {
  const router = useRouter()
  const { toast } = useToast()

  const signUp = async (email: string, password: string, userData: {
    firstName: string
    lastName: string
    company: string
    phone?: string
  }) => {
    try {
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
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration."
        })
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to FraudGuard AI!"
        })
        router.push('/dashboard')
      }

      return data
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully."
      })
      
      router.push('/dashboard')
      return data
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error
      return data
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive"
      })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Signed out",
        description: "You've been signed out successfully."
      })
      
      router.push('/')
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  }
}
