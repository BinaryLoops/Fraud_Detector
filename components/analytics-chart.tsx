'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Shield, AlertTriangle, Download, Calendar } from 'lucide-react'

interface ChartData {
  name: string
  value: number
  change: number
}

interface TrendData {
  date: string
  transactions: number
  fraud: number
  blocked: number
}

export function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState('7d')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateMockData()
  }, [timeRange])

  const generateMockData = () => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate fraud type distribution
      const fraudTypes: ChartData[] = [
        { name: 'Card Testing', value: 35, change: -12 },
        { name: 'Account Takeover', value: 28, change: 8 },
        { name: 'Synthetic Identity', value: 18, change: 15 },
        { name: 'Payment Fraud', value: 12, change: -5 },
        { name: 'Other', value: 7, change: 3 }
      ]

      // Generate trend data
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const trends: TrendData[] = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        
        return {
          date: date.toISOString().split('T')[0],
          transactions: Math.floor(Math.random() * 50000) + 100000,
          fraud: Math.floor(Math.random() * 500) + 100,
          blocked: Math.floor(Math.random() * 2000000) + 1000000
        }
      })

      setChartData(fraudTypes)
      setTrendData(trends)
      setLoading(false)
    }, 1000)
  }

  const totalFraud = chartData.reduce((sum, item) => sum + item.value, 0)
  const avgChange = chartData.reduce((sum, item) => sum + item.change, 0) / chartData.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Comprehensive fraud detection analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Fraud Cases</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalFraud.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              {avgChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
              )}
              <span className={avgChange > 0 ? 'text-red-400' : 'text-green-400'}>
                {Math.abs(avgChange).toFixed(1)}%
              </span>
              <span className="text-gray-400 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Detection Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">99.2%</div>
            <Progress value={99.2} className="mt-2 h-2" />
            <p className="text-xs text-gray-400 mt-1">Industry leading accuracy</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Amount Blocked</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$12.4M</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">+18.2%</span>
              <span className="text-gray-400 ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">False Positives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0.8%</div>
            <div className="flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">-12.5%</span>
              <span className="text-gray-400 ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="bg-gray-900 border-gray-700">
          <TabsTrigger value="trends" className="data-[state=active]:bg-gray-800 text-gray-300">Fraud Trends</TabsTrigger>
          <TabsTrigger value="distribution" className="data-[state=active]:bg-gray-800 text-gray-300">Fraud Distribution</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-800 text-gray-300">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card className="glass-effect border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Fraud Detection Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Daily fraud detection and prevention metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border border-gray-700">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Interactive Trend Chart</p>
                    <p className="text-sm text-gray-400">
                      Showing {trendData.length} days of fraud detection data
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Fraud Types Distribution</CardTitle>
                <CardDescription className="text-gray-400">
                  Breakdown of detected fraud by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                          }}
                        />
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{item.value}%</span>
                        <Badge 
                          variant={item.change > 0 ? "destructive" : "secondary"}
                          className={item.change > 0 ? "" : "bg-green-500/20 text-green-400"}
                        >
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Geographic Distribution</CardTitle>
                <CardDescription className="text-gray-400">
                  Fraud attempts by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center border border-gray-700">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-300">Geographic Heat Map</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Model Performance</CardTitle>
                <CardDescription className="text-gray-400">
                  AI model accuracy and efficiency metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Precision</span>
                    <span className="text-sm font-medium text-white">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Recall</span>
                    <span className="text-sm font-medium text-white">99.1%</span>
                  </div>
                  <Progress value={99.1} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">F1 Score</span>
                    <span className="text-sm font-medium text-white">98.9%</span>
                  </div>
                  <Progress value={98.9} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">System Efficiency</CardTitle>
                <CardDescription className="text-gray-400">
                  Processing speed and resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">CPU Usage</span>
                    <span className="text-sm font-medium text-white">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Memory Usage</span>
                    <span className="text-sm font-medium text-white">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Network I/O</span>
                    <span className="text-sm font-medium text-white">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
