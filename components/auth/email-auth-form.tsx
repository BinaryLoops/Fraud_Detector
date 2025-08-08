'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/mock-auth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail, Lock, User, Building } from 'lucide-react'

interface EmailAuthFormProps {
  mode: 'signin' | 'signup'
}

export function EmailAuthForm({ mode }: EmailAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: ''
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        await authService.signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company
        })
        toast({
          title: "Account created successfully!",
          description: "Welcome to FraudGuard AI. You're now signed in.",
        })
      } else {
        await authService.signIn(formData.email, formData.password)
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'signup' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300">Company</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="company"
                type="text"
                placeholder="Your Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            required
          />
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'signup' ? 'Create Account' : 'Sign In'}
      </Button>
    </form>
  )
}
