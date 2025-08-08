'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Bell, CheckCircle, XCircle } from 'lucide-react'

interface Alert {
  id: string
  type: 'fraud' | 'anomaly' | 'pattern'
  severity: 'high' | 'medium' | 'low'
  message: string
  timestamp: Date
  status: 'active' | 'resolved' | 'dismissed'
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // Generate initial alerts
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'fraud',
        severity: 'high',
        message: 'Multiple high-value transactions from unusual location detected',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active'
      },
      {
        id: '2',
        type: 'anomaly',
        severity: 'medium',
        message: 'Transaction velocity exceeded normal pattern for user',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'active'
      },
      {
        id: '3',
        type: 'pattern',
        severity: 'low',
        message: 'New merchant category detected for frequent user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'resolved'
      }
    ]
    setAlerts(initialAlerts)

    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: ['fraud', 'anomaly', 'pattern'][Math.floor(Math.random() * 3)] as Alert['type'],
          severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as Alert['severity'],
          message: [
            'Suspicious transaction pattern detected',
            'Unusual spending behavior identified',
            'Geographic anomaly in transaction location',
            'Time-based transaction anomaly detected'
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          status: 'active'
        }
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    )
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'dismissed' } : alert
      )
    )
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'pattern':
        return <Bell className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Active Alerts
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {activeAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, 8).map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border ${
              alert.status === 'active' ? 'bg-white' : 'bg-gray-50 opacity-75'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(alert.type)}
                  {getSeverityBadge(alert.severity)}
                </div>
                <span className="text-xs text-gray-500">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{alert.message}</p>
              
              {alert.status === 'active' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveAlert(alert.id)}
                    className="text-xs"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              )}
              
              {alert.status === 'resolved' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
