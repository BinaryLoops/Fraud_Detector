'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, MessageSquare, ArrowRight, Loader2 } from 'lucide-react'
import { AuthService } from '@/lib/auth-service'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface PhoneAuthFormProps {
  mode: 'signin' | 'signup'
}

export function PhoneAuthForm({ mode }: PhoneAuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('otp')
  const { toast } = useToast()
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await AuthService.sendPhoneOTP(phone)
      setOtpSent(true)
      toast({
        title: "OTP sent",
        description: "Please check your phone for the verification code."
      })
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await AuthService.verifyPhoneOTP(phone, otp)
      toast({
        title: "Phone verified",
        description: "You have been successfully authenticated."
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "OTP verification failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const phoneNumber = formData.get('phone') as string
      const password = formData.get('password') as string

      if (mode === 'signin') {
        await AuthService.signInWithPhone(phoneNumber, password)
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in."
        })
      } else {
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const company = formData.get('company') as string
        const email = formData.get('email') as string

        await AuthService.signUpWithPhone(phoneNumber, password, {
          firstName,
          lastName,
          company,
          email
        })
        toast({
          title: "Account created",
          description: "Your account has been successfully created."
        })
      }
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: `${mode === 'signin' ? 'Sign in' : 'Sign up'} failed`,
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <CardTitle>
          {mode === 'signin' ? 'Sign in with Phone' : 'Sign up with Phone'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your phone number to sign in' 
            : 'Create an account using your phone number'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'password' | 'otp')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="otp">
              <MessageSquare className="w-4 h-4 mr-2" />
              OTP
            </TabsTrigger>
            <TabsTrigger value="password">
              <Phone className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="otp">
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12"
                  />
                  <p className="text-sm text-gray-500">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="h-12 text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-gray-500">
                    Enter the 6-digit code sent to {phone}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setOtpSent(false)}
                  disabled={loading}
                >
                  Change Phone Number
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="password">
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Acme Corp"
                      required
                      className="h-12"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
