'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Bell, CheckCircle, XCircle, Search, Filter, Eye, MoreHorizontal, Clock, TrendingUp, TrendingDown, Shield, Activity, Download, RefreshCw } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Alert {
  id: string
  type: 'fraud' | 'anomaly' | 'pattern' | 'velocity' | 'geographic' | 'amount'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  message: string
  timestamp: Date
  status: 'active' | 'investigating' | 'resolved' | 'dismissed'
  transactionId?: string
  userId?: string
  location?: string
  amount?: number
  confidence: number
}

export function AlertsManager() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    // Generate initial alerts
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'fraud',
        severity: 'critical',
        title: 'Suspicious Card Testing Pattern',
        message: 'Multiple small-amount transactions detected from same IP address across different cards',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active',
        transactionId: 'TXN-001',
        location: 'Lagos, Nigeria',
        amount: 1.99,
        confidence: 0.95
      },
      {
        id: '2',
        type: 'anomaly',
        severity: 'high',
        title: 'Unusual Transaction Velocity',
        message: 'User exceeded normal transaction frequency by 400% in the last hour',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'investigating',
        userId: 'USER-456',
        confidence: 0.87
      },
      {
        id: '3',
        type: 'geographic',
        severity: 'medium',
        title: 'Geographic Anomaly',
        message: 'Transaction from unusual location for this user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'resolved',
        location: 'Moscow, Russia',
        amount: 2500.00,
        confidence: 0.72
      },
      {
        id: '4',
        type: 'amount',
        severity: 'high',
        title: 'High-Value Transaction',
        message: 'Transaction amount significantly exceeds user\'s typical spending pattern',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'active',
        amount: 8750.00,
        confidence: 0.91
      },
      {
        id: '5',
        type: 'velocity',
        severity: 'medium',
        title: 'Rapid Transaction Sequence',
        message: 'Multiple transactions within 2-minute window detected',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'dismissed',
        confidence: 0.68
      },
      {
        id: '6',
        type: 'pattern',
        severity: 'low',
        title: 'New Merchant Category',
        message: 'First-time transaction in luxury goods category for this user',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'resolved',
        amount: 450.00,
        confidence: 0.55
      }
    ]
    setAlerts(initialAlerts)
    setFilteredAlerts(initialAlerts)

    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alertTypes = ['fraud', 'anomaly', 'pattern', 'velocity', 'geographic', 'amount'] as const
        const severities = ['critical', 'high', 'medium', 'low'] as const
        const titles = [
          'Suspicious Transaction Pattern',
          'Unusual User Behavior',
          'Geographic Risk Alert',
          'High-Value Transaction',
          'Velocity Threshold Exceeded',
          'Account Takeover Attempt',
          'Card Testing Activity',
          'Synthetic Identity Detected'
        ]
        const messages = [
          'Automated fraud detection system flagged this activity',
          'Machine learning model detected anomalous behavior',
          'Transaction originated from high-risk location',
          'Amount exceeds established user patterns',
          'Multiple rapid transactions detected',
          'Login attempt from new device and location',
          'Small-amount transactions across multiple cards',
          'Identity verification failed multiple checks'
        ]

        const newAlert: Alert = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          title: titles[Math.floor(Math.random() * titles.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          status: 'active',
          confidence: 0.5 + Math.random() * 0.5
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 49)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = alerts

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, severityFilter, statusFilter, typeFilter])

  const handleUpdateAlertStatus = (alertId: string, newStatus: Alert['status']) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    )
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="bg-red-600">Critical</Badge>
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Medium</Badge>
      case 'low':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'pattern':
        return <Bell className="w-4 h-4 text-blue-400" />
      case 'velocity':
        return <TrendingUp className="w-4 h-4 text-orange-400" />
      case 'geographic':
        return <Shield className="w-4 h-4 text-purple-400" />
      case 'amount':
        return <Activity className="w-4 h-4 text-green-400" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive" className="animate-pulse">Active</Badge>
      case 'investigating':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Investigating</Badge>
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Resolved</Badge>
      case 'dismissed':
        return <Badge variant="outline" className="border-gray-600 text-gray-400">Dismissed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active')
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical')
  const resolvedToday = alerts.filter(alert => 
    alert.status === 'resolved' && 
    new Date(alert.timestamp).toDateString() === new Date().toDateString()
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alert Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage fraud detection alerts in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export Alerts
          </Button>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{activeAlerts.length}</div>
            <div className="flex items-center text-sm text-red-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3 in last hour
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Critical Alerts</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              -2 from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{resolvedToday.length}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12 from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">2.3m</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              -15% improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-effect border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                Real-time Alert Monitor
              </CardTitle>
              <CardDescription className="text-gray-400">
                AI-powered fraud detection alerts and notifications
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                  <SelectItem value="velocity">Velocity</SelectItem>
                  <SelectItem value="geographic">Geographic</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 transition-colors bg-gray-900/50 ${
                alert.status === 'active' ? 'border-l-4 border-l-red-500 border-gray-700' : 
                alert.status === 'investigating' ? 'border-l-4 border-l-blue-500 border-gray-700' : 'border-gray-700'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold text-white">{alert.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>ID: {alert.id}</span>
                    <span>{alert.timestamp.toLocaleString()}</span>
                    {alert.location && <span>📍 {alert.location}</span>}
                    {alert.amount && <span>💰 ${alert.amount.toFixed(2)}</span>}
                    <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.status === 'active' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateAlertStatus(alert.id, 'investigating')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Investigate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateAlertStatus(alert.id, 'resolved')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                    {alert.status === 'investigating' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateAlertStatus(alert.id, 'resolved')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleUpdateAlertStatus(alert.id, 'dismissed')}
                          className="text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          Dismiss Alert
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                          Create Rule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                          Export Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">No alerts found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
