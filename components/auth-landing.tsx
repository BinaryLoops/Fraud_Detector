'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Zap, BarChart3, Users, Lock, TrendingUp, CheckCircle, ArrowRight, Play, Star, Globe, Clock, Award, Eye, EyeOff, Phone, Mail, Chrome } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export function AuthLanding() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [phoneAuth, setPhoneAuth] = useState(false)
  const router = useRouter()

  const { signUp, signIn, signInWithGoogle } = useAuth()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      if (authMode === 'login') {
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        await signIn(email, password)
      } else {
        const email = formData.get('signupEmail') as string
        const password = formData.get('signupPassword') as string
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const company = formData.get('company') as string
        const phone = formData.get('signupPhone') as string
        
        await signUp(email, password, {
          firstName,
          lastName,
          company,
          phone: phoneAuth ? phone : undefined
        })
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms detect fraud patterns in real-time with 99.2% accuracy.'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Process millions of transactions per second with sub-millisecond response times.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards and reports provide deep insights into fraud trends.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Multi-user support with role-based access control and audit trails.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption and compliance certifications.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Learning',
      description: 'Self-improving AI models that adapt to new fraud patterns automatically.'
    }
  ]

  const stats = [
    { value: '99.2%', label: 'Detection Accuracy' },
    { value: '<1ms', label: 'Response Time' },
    { value: '10M+', label: 'Transactions/Day' },
    { value: '500+', label: 'Enterprise Clients' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FraudGuard AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#analytics" className="text-gray-700 hover:text-blue-600 transition-colors">Analytics</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Award className="w-4 h-4 mr-2" />
                Winner 2024
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Side - Hero Content */}
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              <Award className="w-4 h-4 mr-2" />
              Winner - FinTech Innovation Award 2024
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Fraud Before It
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Happens
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Advanced AI-powered fraud detection platform that protects your business with real-time monitoring, 
              intelligent alerts, and comprehensive analytics. Trusted by 500+ financial institutions worldwide.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-lg transform hover:scale-105 transition-all"
                onClick={() => setAuthMode('signup')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 glass-effect hover:bg-white/20"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Side - 3D Auth Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 transform rotate-6 scale-105"></div>
            <Card className="relative shadow-2xl border-0 backdrop-blur-sm bg-white/90 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">
                  {authMode === 'login' ? 'Welcome Back' : 'Get Started'}
                </CardTitle>
                <CardDescription>
                  {authMode === 'login' 
                    ? 'Sign in to your FraudGuard AI dashboard' 
                    : 'Create your FraudGuard AI account'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'signup')} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleAuth} className="space-y-4">
                      {!phoneAuth ? (
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@company.com"
                            required
                            className="h-12 rounded-xl"
                            name="email"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            className="h-12 rounded-xl pr-12"
                            name="password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <Button 
                          type="button" 
                          variant="link" 
                          className="text-sm text-blue-600 hover:text-blue-500 p-0"
                          onClick={() => setPhoneAuth(!phoneAuth)}
                        >
                          {phoneAuth ? 'Use Email' : 'Use Phone'}
                        </Button>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleAuth} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            required
                            className="h-12 rounded-xl"
                            name="firstName"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            required
                            className="h-12 rounded-xl"
                            name="lastName"
                          />
                        </div>
                      </div>

                      {!phoneAuth ? (
                        <div className="space-y-2">
                          <label htmlFor="signupEmail" className="text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <Input
                            id="signupEmail"
                            type="email"
                            placeholder="john@company.com"
                            required
                            className="h-12 rounded-xl"
                            name="signupEmail"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label htmlFor="signupPhone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <Input
                            id="signupPhone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            required
                            className="h-12 rounded-xl"
                            name="signupPhone"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Acme Corp"
                          required
                          className="h-12 rounded-xl"
                          name="company"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signupPassword" className="text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            required
                            className="h-12 rounded-xl pr-12"
                            name="signupPassword"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-gray-300" required />
                        <span className="text-sm text-gray-600">
                          I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </span>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating account...
                          </div>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <Button 
                          type="button" 
                          variant="link" 
                          className="text-sm text-blue-600 hover:text-blue-500"
                          onClick={() => setPhoneAuth(!phoneAuth)}
                        >
                          {phoneAuth ? (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Use Email Instead
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 mr-2" />
                              Use Phone Instead
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-2 hover:bg-gray-50"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Protected by enterprise-grade security</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Complete Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive fraud detection platform combines cutting-edge AI with intuitive design 
              to deliver unmatched security and user experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg transform hover:scale-105 glass-effect">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
