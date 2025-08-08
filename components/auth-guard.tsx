'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService, AuthState } from '@/lib/mock-auth'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((state) => {
      setAuthState(state)
      
      if (!state.isLoading && !state.isAuthenticated) {
        router.push('/auth/login')
      }
    })

    return unsubscribe
  }, [router])

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return null
  }

  return <>{children}</>
}
