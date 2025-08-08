'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Activity, AlertTriangle, CheckCircle, XCircle, DollarSign, Users, TrendingUp, TrendingDown, Shield, Zap, Clock, Eye, Ban, Flag, MoreHorizontal } from 'lucide-react'
import { liveEngine, LiveStats, LiveAlert } from '@/lib/live-transaction-engine'
import { Transaction } from '@/lib/transaction-generator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

export function DashboardOverview() {
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
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [alerts, setAlerts] = useState<LiveAlert[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsConnected(true)
    
    const unsubscribe = liveEngine.subscribe((data) => {
      setStats(data.stats)
      setTransactions(data.transactions)
      setAlerts(data.alerts)
    })

    return () => {
      unsubscribe()
      setIsConnected(false)
    }
  }, [])

  const handleQuickAction = async (action: string, transactionId: string, transactionAmount?: number) => {
    let success = false
    let message = ''

    switch (action) {
      case 'block':
        success = liveEngine.blockTransaction(transactionId)
        message = success ? 'Transaction blocked successfully' : 'Failed to block transaction'
        break
      case 'approve':
        success = liveEngine.approveTransaction(transactionId)
        message = success ? 'Transaction approved successfully' : 'Failed to approve transaction'
        break
      case 'flag':
        success = liveEngine.flagTransaction(transactionId)
        message = success ? 'Transaction flagged for review' : 'Failed to flag transaction'
        break
    }

    toast({
      title: success ? 'Action Completed' : 'Action Failed',
      description: message,
      variant: success ? 'default' : 'destructive'
    })
  }

  const handleDismissAlert = (alertId: string) => {
    const success = liveEngine.dismissAlert(alertId)
    toast({
      title: success ? 'Alert Dismissed' : 'Failed to Dismiss',
      description: success ? 'Alert has been removed from the list' : 'Could not dismiss alert',
      variant: success ? 'default' : 'destructive'
    })
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
          <XCircle className="w-3 h-3" />
          High Risk
        </Badge>
      case 'medium':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3" />
          Medium Risk
        </Badge>
      case 'low':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Low Risk
        </Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getAlertBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="animate-pulse">Critical</Badge>
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fraud Detection Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-300">
            {isConnected ? 'Live Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-gray-800 hover:border-blue-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              {stats.transactionsPerSecond}/sec
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800 hover:border-red-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Fraud Detected</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.fraudDetected}</div>
            <div className="flex items-center text-sm text-red-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {((stats.fraudDetected / Math.max(stats.totalTransactions, 1)) * 100).toFixed(1)}% rate
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800 hover:border-green-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${stats.totalAmount.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              Avg: ${stats.averageAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800 hover:border-purple-500/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">System Health</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stats.accuracy.toFixed(1)}%</div>
            <div className="flex items-center text-sm text-purple-400">
              <Clock className="w-4 h-4 mr-1" />
              {stats.processingSpeed.toFixed(2)}ms avg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Transaction Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Live Transaction Stream
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time transaction monitoring
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                {transactions.length} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="border border-gray-700 rounded-lg p-3 hover:bg-gray-800/50 transition-colors bg-gray-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {transaction.id}
                      </span>
                      {getRiskBadge(transaction.riskLevel)}
                      {transaction.timestamp > new Date(Date.now() - 5000) && (
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem 
                          onClick={() => handleQuickAction('approve', transaction.id, transaction.amount)}
                          className="text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleQuickAction('flag', transaction.id, transaction.amount)}
                          className="text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          <Flag className="w-3 h-3 mr-2" />
                          Flag
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleQuickAction('block', transaction.id, transaction.amount)}
                          className="text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          <Ban className="w-3 h-3 mr-2" />
                          Block
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block">Amount</span>
                      <div className={`font-semibold ${
                        transaction.riskLevel === 'high' ? 'text-red-400' :
                        transaction.amount > 1000 ? 'text-orange-400' : 'text-white'
                      }`}>
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Merchant</span>
                      <div className="font-medium text-white truncate">{transaction.merchantName}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Time</span>
                      <div className="text-white">{new Date(transaction.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Alerts */}
        <Card className="glass-effect border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Security Alerts
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time fraud detection alerts
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">
                {alerts.length} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {alerts.slice(0, 8).map((alert) => (
                <div key={alert.id} className="border border-red-500/20 rounded-lg p-3 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertBadge(alert.severity)}
                      <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-600">
                        {alert.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-gray-400 hover:text-white h-6 w-6 p-0"
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm text-white mb-1">{alert.title}</h4>
                  <p className="text-xs text-gray-300">{alert.message}</p>
                  {alert.transactionId && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/50">
                        TXN: {alert.transactionId}
                      </Badge>
                      {alert.amount && (
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/50">
                          ${alert.amount.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {alerts.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <div className="text-gray-400 mb-1">All Clear</div>
                  <p className="text-sm text-gray-500">No active security alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <Card className="glass-effect border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">System Performance</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="text-gray-400">Active Users</span>
                <span className="text-white font-medium">{stats.activeUsers.toLocaleString()}</span>
              </div>
              <Progress value={Math.min(100, (stats.activeUsers / 15000) * 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
