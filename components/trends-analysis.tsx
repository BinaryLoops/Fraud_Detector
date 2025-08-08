'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Shield, AlertTriangle, Clock, Calendar, Globe, Users, CreditCard } from 'lucide-react'

interface TrendData {
  period: string
  fraudAttempts: number
  successfulBlocks: number
  falsePositives: number
  totalTransactions: number
  averageRiskScore: number
}

interface GeographicTrend {
  country: string
  fraudAttempts: number
  change: number
  riskLevel: 'high' | 'medium' | 'low'
}

export function TrendsAnalysis() {
  const [timeRange, setTimeRange] = useState('30d')
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [geographicTrends, setGeographicTrends] = useState<GeographicTrend[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateTrendData()
  }, [timeRange])

  const generateTrendData = () => {
    setLoading(true)
    
    setTimeout(() => {
      // Generate mock trend data
      const periods = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const trends: TrendData[] = Array.from({ length: periods }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (periods - 1 - i))
        
        return {
          period: date.toISOString().split('T')[0],
          fraudAttempts: Math.floor(Math.random() * 100) + 50,
          successfulBlocks: Math.floor(Math.random() * 80) + 40,
          falsePositives: Math.floor(Math.random() * 10) + 2,
          totalTransactions: Math.floor(Math.random() * 10000) + 50000,
          averageRiskScore: Math.random() * 0.4 + 0.3
        }
      })

      const geoTrends: GeographicTrend[] = [
        { country: 'United States', fraudAttempts: 1247, change: -12.5, riskLevel: 'medium' },
        { country: 'Nigeria', fraudAttempts: 892, change: 23.8, riskLevel: 'high' },
        { country: 'Russia', fraudAttempts: 634, change: 8.2, riskLevel: 'high' },
        { country: 'India', fraudAttempts: 567, change: -5.3, riskLevel: 'medium' },
        { country: 'Brazil', fraudAttempts: 423, change: 15.7, riskLevel: 'medium' },
        { country: 'China', fraudAttempts: 389, change: -18.9, riskLevel: 'low' },
        { country: 'United Kingdom', fraudAttempts: 234, change: -8.1, riskLevel: 'low' },
        { country: 'Germany', fraudAttempts: 198, change: -15.2, riskLevel: 'low' }
      ]

      setTrendData(trends)
      setGeographicTrends(geoTrends)
      setLoading(false)
    }, 1000)
  }

  const calculateTrend = (data: TrendData[], field: keyof TrendData) => {
    if (data.length < 2) return { value: 0, trend: 'neutral' as const }
    
    const recent = data.slice(-7).reduce((sum, item) => sum + (item[field] as number), 0) / 7
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + (item[field] as number), 0) / 7
    
    const change = ((recent - previous) / previous) * 100
    return {
      value: change,
      trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    }
  }

  const fraudTrend = calculateTrend(trendData, 'fraudAttempts')
  const blockTrend = calculateTrend(trendData, 'successfulBlocks')
  const fpTrend = calculateTrend(trendData, 'falsePositives')
  const riskTrend = calculateTrend(trendData, 'averageRiskScore')

  const totalFraudAttempts = trendData.reduce((sum, item) => sum + item.fraudAttempts, 0)
  const totalBlocks = trendData.reduce((sum, item) => sum + item.successfulBlocks, 0)
  const avgRiskScore = trendData.length > 0 ? trendData.reduce((sum, item) => sum + item.averageRiskScore, 0) / trendData.length : 0

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fraud Trends Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze fraud patterns and trends over time</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="hover:bg-blue-50">
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fraud Attempts</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFraudAttempts.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              {fraudTrend.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
              ) : fraudTrend.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              ) : null}
              <span className={fraudTrend.trend === 'up' ? 'text-red-600' : fraudTrend.trend === 'down' ? 'text-green-600' : 'text-gray-600'}>
                {fraudTrend.value > 0 ? '+' : ''}{fraudTrend.value.toFixed(1)}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Successful Blocks</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalBlocks.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              {blockTrend.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : blockTrend.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span className={blockTrend.trend === 'up' ? 'text-green-600' : blockTrend.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                {blockTrend.value > 0 ? '+' : ''}{blockTrend.value.toFixed(1)}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Detection Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalBlocks > 0 ? ((totalBlocks / totalFraudAttempts) * 100).toFixed(1) : 0}%
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.3% improvement
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{(avgRiskScore * 100).toFixed(1)}</div>
            <div className="flex items-center text-sm">
              {riskTrend.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
              ) : riskTrend.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              ) : null}
              <span className={riskTrend.trend === 'up' ? 'text-red-600' : riskTrend.trend === 'down' ? 'text-green-600' : 'text-gray-600'}>
                {riskTrend.value > 0 ? '+' : ''}{(riskTrend.value * 100).toFixed(1)}% vs last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Trends</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Fraud Activity Timeline</CardTitle>
              <CardDescription>
                Track fraud attempts and successful blocks over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading trend data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Interactive Timeline Chart</p>
                    <p className="text-sm text-gray-500">
                      Showing {trendData.length} days of fraud detection trends
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
                <CardDescription>Recent daily fraud activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendData.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{new Date(day.period).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600">
                          {day.fraudAttempts} attempts, {day.successfulBlocks} blocked
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {((day.successfulBlocks / day.fraudAttempts) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">success rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Detection Accuracy</span>
                    <span className="text-sm font-medium">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">False Positive Rate</span>
                    <span className="text-sm font-medium">1.3%</span>
                  </div>
                  <Progress value={1.3} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">0.3ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Geographic Fraud Distribution</CardTitle>
              <CardDescription>
                Fraud attempts by country and region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geographicTrends.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{country.country}</div>
                        <div className="text-sm text-gray-600">
                          {country.fraudAttempts.toLocaleString()} attempts
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={country.riskLevel === 'high' ? 'destructive' : 
                                country.riskLevel === 'medium' ? 'secondary' : 'outline'}
                        className={country.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  country.riskLevel === 'low' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {country.riskLevel} risk
                      </Badge>
                      <div className="text-right">
                        <div className={`font-medium ${country.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {country.change > 0 ? '+' : ''}{country.change.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">change</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Attack Patterns</CardTitle>
                <CardDescription>Common fraud attack vectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { pattern: 'Card Testing', percentage: 35, trend: 'up' },
                    { pattern: 'Account Takeover', percentage: 28, trend: 'down' },
                    { pattern: 'Synthetic Identity', percentage: 18, trend: 'up' },
                    { pattern: 'Payment Fraud', percentage: 12, trend: 'stable' },
                    { pattern: 'Other', percentage: 7, trend: 'down' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">{item.pattern}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.percentage}%</span>
                        {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-red-500" />}
                        {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Time-based Patterns</CardTitle>
                <CardDescription>Fraud activity by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '00:00 - 06:00', activity: 'High', percentage: 35 },
                    { time: '06:00 - 12:00', activity: 'Low', percentage: 15 },
                    { time: '12:00 - 18:00', activity: 'Medium', percentage: 25 },
                    { time: '18:00 - 24:00', activity: 'Medium', percentage: 25 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.time}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={item.activity === 'High' ? 'destructive' : 
                                  item.activity === 'Medium' ? 'secondary' : 'outline'}
                          className={item.activity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        >
                          {item.activity}
                        </Badge>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Fraud Predictions</CardTitle>
              <CardDescription>
                AI-powered predictions for upcoming fraud trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">+15%</div>
                    <div className="text-sm text-gray-600">Expected increase in next 7 days</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">High</div>
                    <div className="text-sm text-gray-600">Risk level for weekend</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">2-4 AM</div>
                    <div className="text-sm text-gray-600">Peak activity window</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Predicted Trends</h4>
                  {[
                    {
                      prediction: 'Card testing attacks expected to increase by 20% next week',
                      confidence: 87,
                      impact: 'High'
                    },
                    {
                      prediction: 'Geographic shift towards Eastern European countries',
                      confidence: 73,
                      impact: 'Medium'
                    },
                    {
                      prediction: 'Synthetic identity fraud likely to decrease by 12%',
                      confidence: 65,
                      impact: 'Low'
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.prediction}</span>
                        <Badge variant="outline">{item.impact} Impact</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <Progress value={item.confidence} className="h-1 flex-1" />
                        <span className="text-xs font-medium">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
