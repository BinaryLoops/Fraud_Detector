'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Brain, Zap, Eye, TrendingUp, Users, Lock, Globe, ArrowRight, CheckCircle } from 'lucide-react'

export function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms detect fraud patterns in real-time with 99.7% accuracy."
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Process millions of transactions per second with sub-millisecond response times."
    },
    {
      icon: Eye,
      title: "Behavioral Analytics",
      description: "Monitor user behavior patterns to identify anomalies and suspicious activities."
    },
    {
      icon: TrendingUp,
      title: "Predictive Intelligence",
      description: "Predict and prevent fraud before it happens using predictive analytics."
    }
  ]

  const stats = [
    { value: "99.7%", label: "Detection Accuracy" },
    { value: "<1ms", label: "Response Time" },
    { value: "10M+", label: "Transactions/Day" },
    { value: "24/7", label: "Monitoring" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">FraudGuard</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link href="/auth/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-600/20 text-blue-300 border-blue-600/30">
            AI-Powered Fraud Detection
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Stop Fraud Before
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {' '}It Happens
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Protect your business with our advanced AI-powered fraud detection system. 
            Real-time monitoring, predictive analytics, and comprehensive security in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Advanced Fraud Detection
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive suite of tools provides complete protection against all types of fraud.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our three-step process ensures maximum protection with minimal false positives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Data Collection</h3>
              <p className="text-gray-300">
                Collect and analyze transaction data, user behavior, and contextual information in real-time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
              <p className="text-gray-300">
                Our advanced AI models analyze patterns and detect anomalies using machine learning algorithms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Action & Prevention</h3>
              <p className="text-gray-300">
                Take immediate action to prevent fraud while maintaining a seamless user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core fraud detection features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Starter</CardTitle>
                <CardDescription className="text-gray-300">Perfect for small businesses</CardDescription>
                <div className="text-4xl font-bold text-white">$99<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Up to 10K transactions/month
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Basic fraud detection
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Email support
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-blue-500/50 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Professional</CardTitle>
                <CardDescription className="text-gray-300">For growing businesses</CardDescription>
                <div className="text-4xl font-bold text-white">$299<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Up to 100K transactions/month
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Advanced AI detection
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  24/7 priority support
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Custom rules engine
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-gray-300">For large organizations</CardDescription>
                <div className="text-4xl font-bold text-white">Custom</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Unlimited transactions
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Custom AI models
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Dedicated support team
                </div>
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  On-premise deployment
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Fraud?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses that trust FraudGuard to protect their transactions and customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">FraudGuard</span>
              </div>
              <p className="text-gray-400">
                Advanced AI-powered fraud detection for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FraudGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
