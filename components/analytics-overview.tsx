'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from 'lucide-react'

interface AnalyticsData {
  totalTransactions: number
  fraudDetected: number
  falsePositives: number
  accuracy: number
  trendsData: {
    fraudRate: number
    trend: 'up' | 'down'
    change: number
  }
}

export function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTransactions: 0,
    fraudDetected: 0,
    falsePositives: 0,
    accuracy: 0,
    trendsData: {
      fraudRate: 0,
      trend: 'down',
      change: 0
    }
  })

  useEffect(() => {
    // Simulate real-time analytics updates
    const updateAnalytics = () => {
      setAnalytics({
        totalTransactions: Math.floor(Math.random() * 10000) + 50000,
        fraudDetected: Math.floor(Math.random() * 100) + 150,
        falsePositives: Math.floor(Math.random() * 20) + 5,
        accuracy: 94 + Math.random() * 4,
        trendsData: {
          fraudRate: Math.random() * 2 + 0.5,
          trend: Math.random() > 0.5 ? 'down' : 'up',
          change: Math.random() * 15 + 5
        }
      })
    }

    updateAnalytics()
    const interval = setInterval(updateAnalytics, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          System Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalTransactions.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {analytics.fraudDetected}
            </div>
            <div className="text-xs text-gray-500">Fraud Detected</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Detection Accuracy</span>
            <span className="text-sm text-gray-600">{analytics.accuracy.toFixed(1)}%</span>
          </div>
          <Progress value={analytics.accuracy} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">False Positives</span>
            </div>
            <span className="font-semibold">{analytics.falsePositives}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {analytics.trendsData.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm">Fraud Rate</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{analytics.trendsData.fraudRate.toFixed(2)}%</div>
              <div className={`text-xs ${
                analytics.trendsData.trend === 'up' ? 'text-red-500' : 'text-green-500'
              }`}>
                {analytics.trendsData.trend === 'up' ? '+' : '-'}{analytics.trendsData.change.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
