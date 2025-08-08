'use client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: string
  avatarUrl?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class MockAuthService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@fraudguard.ai',
      firstName: 'John',
      lastName: 'Doe',
      company: 'FraudGuard AI',
      role: 'admin',
      avatarUrl: '/placeholder.svg?height=40&width=40&text=JD',
      createdAt: new Date().toISOString()
    }
  ]

  private currentUser: User | null = null
  private listeners: ((state: AuthState) => void)[] = []

  constructor() {
    // Check for existing session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('fraudguard_user')
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
    }
  }

  private notifyListeners() {
    const state: AuthState = {
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false
    }
    this.listeners.forEach(listener => listener(state))
  }

  onAuthStateChange(callback: (state: AuthState) => void) {
    this.listeners.push(callback)
    // Immediately call with current state
    callback({
      user: this.currentUser,
      isAuthenticated: !!this.currentUser,
      isLoading: false
    })
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    company: string
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user already exists
    if (this.users.find(user => user.email === email)) {
      throw new Error('User already exists with this email')
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company,
      role: 'user',
      avatarUrl: `/placeholder.svg?height=40&width=40&text=${userData.firstName[0]}${userData.lastName[0]}`,
      createdAt: new Date().toISOString()
    }

    this.users.push(newUser)
    this.currentUser = newUser
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('fraudguard_user', JSON.stringify(newUser))
    }
    
    this.notifyListeners()
    return { user: newUser }
  }

  async signIn(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = this.users.find(u => u.email === email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    this.currentUser = user
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('fraudguard_user', JSON.stringify(user))
    }
    
    this.notifyListeners()
    return { user }
  }

  async signInWithGoogle() {
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500))

    const googleUser: User = {
      id: 'google_' + Date.now(),
      email: 'user@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      company: 'Tech Corp',
      role: 'user',
      avatarUrl: '/placeholder.svg?height=40&width=40&text=GU',
      createdAt: new Date().toISOString()
    }

    this.currentUser = googleUser
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('fraudguard_user', JSON.stringify(googleUser))
    }
    
    this.notifyListeners()
    return { user: googleUser }
  }

  async signOut() {
    this.currentUser = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fraudguard_user')
    }
    
    this.notifyListeners()
  }

  getCurrentUser() {
    return this.currentUser
  }

  async resetPassword(email: string) {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = this.users.find(u => u.email === email)
    if (!user) {
      throw new Error('No user found with this email address')
    }
    
    return { message: 'Password reset email sent' }
  }
}

export const authService = new MockAuthService()
