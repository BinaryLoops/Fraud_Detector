'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Circle, Play, BookOpen, Settings, Users, Shield, Zap, BarChart3, Download, ExternalLink, ArrowRight, Clock, Star } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  completed: boolean
  optional?: boolean
}

export function GettingStarted() {
  const [completedSteps, setCompletedSteps] = useState<string[]>(['setup-account'])
  
  const quickStartSteps: Step[] = [
    {
      id: 'setup-account',
      title: 'Account Setup Complete',
      description: 'Your FraudGuard AI account has been created and verified',
      completed: true
    },
    {
      id: 'configure-rules',
      title: 'Configure Detection Rules',
      description: 'Set up your fraud detection rules and thresholds',
      completed: false
    },
    {
      id: 'integrate-api',
      title: 'API Integration',
      description: 'Connect your payment system to FraudGuard AI',
      completed: false
    },
    {
      id: 'test-transactions',
      title: 'Test Transactions',
      description: 'Run test transactions to verify your setup',
      completed: false
    },
    {
      id: 'setup-alerts',
      title: 'Configure Alerts',
      description: 'Set up email and webhook notifications',
      completed: false
    },
    {
      id: 'invite-team',
      title: 'Invite Team Members',
      description: 'Add your team members and assign roles',
      completed: false,
      optional: true
    }
  ]

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    )
  }

  const completionPercentage = (completedSteps.length / quickStartSteps.filter(s => !s.optional).length) * 100

  const resources = [
    {
      title: 'API Documentation',
      description: 'Complete guide to integrating FraudGuard AI with your systems',
      icon: BookOpen,
      link: '#',
      category: 'Development'
    },
    {
      title: 'Best Practices Guide',
      description: 'Learn industry best practices for fraud detection',
      icon: Shield,
      link: '#',
      category: 'Security'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: Play,
      link: '#',
      category: 'Training'
    },
    {
      title: 'Rule Configuration Guide',
      description: 'How to set up and optimize your fraud detection rules',
      icon: Settings,
      link: '#',
      category: 'Configuration'
    },
    {
      title: 'Analytics Dashboard Guide',
      description: 'Make the most of your fraud detection analytics',
      icon: BarChart3,
      link: '#',
      category: 'Analytics'
    },
    {
      title: 'Team Management',
      description: 'Managing users, roles, and permissions',
      icon: Users,
      link: '#',
      category: 'Administration'
    }
  ]

  const tutorials = [
    {
      title: 'Setting Up Your First Fraud Rule',
      duration: '5 min',
      difficulty: 'Beginner',
      description: 'Learn how to create and configure your first fraud detection rule'
    },
    {
      title: 'Understanding Risk Scores',
      duration: '8 min',
      difficulty: 'Beginner',
      description: 'Deep dive into how FraudGuard AI calculates and assigns risk scores'
    },
    {
      title: 'Advanced Pattern Detection',
      duration: '12 min',
      difficulty: 'Intermediate',
      description: 'Configure advanced patterns for sophisticated fraud detection'
    },
    {
      title: 'API Integration Walkthrough',
      duration: '15 min',
      difficulty: 'Intermediate',
      description: 'Complete guide to integrating FraudGuard AI with your payment system'
    },
    {
      title: 'Custom Alert Configuration',
      duration: '10 min',
      difficulty: 'Advanced',
      description: 'Set up custom alerts and notification workflows'
    }
  ]

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
          <p className="text-gray-600 mt-1">Welcome to FraudGuard AI! Let's get you set up for success.</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Star className="w-4 h-4 mr-2" />
          Quick Setup Guide
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Start Progress
              </CardTitle>
              <CardDescription>
                Complete these steps to get the most out of FraudGuard AI
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3 mb-6" />
          <div className="space-y-4">
            {quickStartSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="flex-shrink-0"
                >
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${completedSteps.includes(step.id) ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    {step.optional && (
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  {completedSteps.includes(step.id) ? 'Review' : 'Start'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline">{resource.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {resource.description}
                  </CardDescription>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="space-y-4">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{tutorial.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {tutorial.duration}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            tutorial.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                            tutorial.difficulty === 'Intermediate' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}
                        >
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{tutorial.description}</p>
                    </div>
                    <Button className="ml-4">
                      <Play className="w-4 h-4 mr-2" />
                      Start Tutorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Our support team is here to help you succeed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Knowledge Base
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Support Team
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Schedule Demo Call
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>
                  Frequently accessed resources and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download SDK
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  API Configuration
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Sample Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to Go Live?</h3>
                  <p className="text-blue-100">
                    Once you've completed the setup, you're ready to start protecting your business from fraud.
                  </p>
                </div>
                <Button variant="secondary" size="lg">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
