'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Mail, Chrome } from 'lucide-react'
import { GoogleAuthButton } from './google-auth-button'
import { EmailAuthForm } from './email-auth-form'

interface CompleteAuthFormProps {
  mode: 'signin' | 'signup'
}

export function CompleteAuthForm({ mode }: CompleteAuthFormProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email')

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-2xl border-0 backdrop-blur-sm bg-gray-900/95 rounded-3xl overflow-hidden border border-gray-800">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === 'signin' 
              ? 'Sign in to your FraudGuard AI dashboard' 
              : 'Create your FraudGuard AI account'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'email' | 'google')}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800 border-gray-700">
              <TabsTrigger value="email" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="google" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400">
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <EmailAuthForm mode={mode} />
            </TabsContent>

            <TabsContent value="google" className="space-y-4">
              <div className="text-center py-8">
                <Chrome className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {mode === 'signin' 
                    ? 'Use your Google account to sign in quickly and securely'
                    : 'Create your account using your Google credentials'
                  }
                </p>
                <GoogleAuthButton 
                  mode={mode} 
                  className="w-full h-12 rounded-xl border-2 hover:bg-gray-700"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Protected by enterprise-grade security</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
