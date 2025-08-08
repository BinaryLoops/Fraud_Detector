'use client'

import { useEffect, useState } from 'react'
import { authService, AuthState } from '@/lib/mock-auth'
import { LandingPage } from '@/components/landing-page'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(setAuthState)
    return unsubscribe
  }, [])

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading FraudGuard AI...</p>
        </div>
      </div>
    )
  }

  return <LandingPage />
}
