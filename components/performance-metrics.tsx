'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, Cpu, HardDrive, Wifi, Server, Zap, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, Database, Shield, Users } from 'lucide-react'
import { liveEngine, LiveStats } from '@/lib/live-transaction-engine'

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: number
  responseTime: number
  throughput: number
  errorRate: number
  activeConnections: number
  queueSize: number
}

export function PerformanceMetrics() {
  const [stats, setStats] = useState<LiveStats>({
    totalTransactions: 0,
    fraudDetected: 0,
    totalAmount: 0,
    averageAmount: 0,
    riskScore: 2.3,
    accuracy: 97.8,
    processingSpeed: 0.3,
    activeUsers: 8429,
    transactionsPerSecond: 0,
    blockedTransactions: 0,
    flaggedTransactions: 0,
    approvedTransactions: 0
  })

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 34,
    uptime: 99.9,
    responseTime: 0.3,
    throughput: 1250,
    errorRate: 0.02,
    activeConnections: 8429,
    queueSize: 12
  })

  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setIsConnected(true)
    
    const unsubscribe = liveEngine.subscribe((data) => {
      setStats(data.stats)
    })

    // Simulate system metrics updates
    const metricsInterval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(30, Math.min(95, prev.disk + (Math.random() - 0.5) * 3)),
        network: Math.max(5, Math.min(80, prev.network + (Math.random() - 0.5) * 15)),
        uptime: Math.max(98, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
        responseTime: Math.max(0.1, Math.min(2.0, prev.responseTime + (Math.random() - 0.5) * 0.2)),
        throughput: Math.max(800, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 100)),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.05)),
        activeConnections: Math.max(5000, Math.min(15000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 200))),
        queueSize: Math.max(0, Math.min(100, prev.queueSize + Math.floor((Math.random() - 0.5) * 10)))
      }))
    }, 2000)

    return () => {
      unsubscribe()
      clearInterval(metricsInterval)
      setIsConnected(false)
    }
  }, [])

  const getHealthStatus = (value: number, thresholds: { good: number, warning: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'text-green-400', icon: CheckCircle }
    if (value <= thresholds.warning) return { status: 'warning', color: 'text-yellow-400', icon: AlertTriangle }
    return { status: 'critical', color: 'text-red-400', icon: AlertTriangle }
  }

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime * 365 / 100)
    const hours = Math.floor((uptime * 365 * 24 / 100) % 24)
    return `${days}d ${hours}h`
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Performance</h1>
          <p className="text-gray-400 mt-1">Real-time system health and performance monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-300">
            {isConnected ? 'Live Monitoring' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-gray-800 hover:border-blue-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.cpu.toFixed(1)}%</div>
            <Progress value={systemMetrics.cpu} className="mt-2 h-2" />
            <div className="flex items-center text-sm text-gray-400 mt-1">
              {systemMetrics.cpu > 80 ? (
                <TrendingUp className="w-4 h-4 mr-1 text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-green-400" />
              )}
              {systemMetrics.cpu > 80 ? 'High load' : 'Normal'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800 hover:border-purple-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.memory.toFixed(1)}%</div>
            <Progress value={systemMetrics.memory} className="mt-2 h-2" />
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <Activity className="w-4 h-4 mr-1" />
              {(systemMetrics.memory * 16 / 100).toFixed(1)}GB / 16GB
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800 hover:border-green-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Network I/O</CardTitle>
            <Wifi className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.network.toFixed(1)}%</div>
            <Progress value={systemMetrics.network} className="mt-2 h-2" />
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {(systemMetrics.network * 10).toFixed(0)} Mbps
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800 hover:border-orange-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemMetrics.disk.toFixed(1)}%</div>
            <Progress value={systemMetrics.disk} className="mt-2 h-2" />
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <Server className="w-4 h-4 mr-1" />
              {(systemMetrics.disk * 500 / 100).toFixed(0)}GB / 500GB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Application Performance</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time application metrics and health indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white font-medium">{systemMetrics.responseTime.toFixed(2)}ms</span>
                </div>
                <Progress value={Math.min(100, (2 - systemMetrics.responseTime) * 50)} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Throughput</span>
                  <span className="text-white font-medium">{systemMetrics.throughput}/sec</span>
                </div>
                <Progress value={Math.min(100, systemMetrics.throughput / 20)} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Error Rate</span>
                  <span className="text-white font-medium">{(systemMetrics.errorRate * 100).toFixed(2)}%</span>
                </div>
                <Progress value={systemMetrics.errorRate * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white font-medium">{systemMetrics.uptime.toFixed(2)}%</span>
                </div>
                <Progress value={systemMetrics.uptime} className="h-2" />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Active Connections</span>
                  <div className="text-xl font-bold text-blue-400">{systemMetrics.activeConnections.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-400 block">Queue Size</span>
                  <div className="text-xl font-bold text-purple-400">{systemMetrics.queueSize}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Fraud Detection Performance</CardTitle>
            <CardDescription className="text-gray-400">
              AI model performance and detection metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Detection Accuracy</span>
                  <span className="text-white font-medium">{stats.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={stats.accuracy} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Speed</span>
                  <span className="text-white font-medium">{stats.processingSpeed.toFixed(2)}ms</span>
                </div>
                <Progress value={Math.min(100, (1 - stats.processingSpeed) * 100)} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="text-white font-medium">{stats.riskScore.toFixed(1)}/10</span>
                </div>
                <Progress value={stats.riskScore * 10} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">TPS Rate</span>
                  <span className="text-white font-medium">{stats.transactionsPerSecond}/sec</span>
                </div>
                <Progress value={Math.min(100, stats.transactionsPerSecond * 10)} className="h-2" />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Blocked</span>
                  <div className="text-xl font-bold text-red-400">{stats.blockedTransactions}</div>
                </div>
                <div>
                  <span className="text-gray-400 block">Flagged</span>
                  <div className="text-xl font-bold text-yellow-400">{stats.flaggedTransactions}</div>
                </div>
                <div>
                  <span className="text-gray-400 block">Approved</span>
                  <div className="text-xl font-bold text-green-400">{stats.approvedTransactions}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="glass-effect border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-blue-400" />
            System Health Alerts
          </CardTitle>
          <CardDescription className="text-gray-400">
            Automated system health monitoring and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                name: 'CPU Load', 
                value: systemMetrics.cpu, 
                threshold: { good: 70, warning: 85 },
                unit: '%'
              },
              { 
                name: 'Memory Usage', 
                value: systemMetrics.memory, 
                threshold: { good: 75, warning: 90 },
                unit: '%'
              },
              { 
                name: 'Response Time', 
                value: systemMetrics.responseTime, 
                threshold: { good: 0.5, warning: 1.0 },
                unit: 'ms'
              },
              { 
                name: 'Error Rate', 
                value: systemMetrics.errorRate * 100, 
                threshold: { good: 0.1, warning: 0.5 },
                unit: '%'
              }
            ].map((metric) => {
              const health = getHealthStatus(metric.value, metric.threshold)
              const Icon = health.icon
              
              return (
                <div key={metric.name} className="border border-gray-700 rounded-lg p-3 bg-gray-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{metric.name}</span>
                    <Icon className={`w-4 h-4 ${health.color}`} />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metric.value.toFixed(metric.name === 'Response Time' ? 2 : 1)}{metric.unit}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 text-xs ${
                      health.status === 'good' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                      health.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                      'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}
                  >
                    {health.status === 'good' ? 'Healthy' : 
                     health.status === 'warning' ? 'Warning' : 'Critical'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
