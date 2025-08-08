'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key, Globe, Database, Server } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface SecurityEvent {
  id: string
  event_type: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  user_id?: string
  ip_address?: string
  status: 'resolved' | 'investigating' | 'open'
}

interface SecuritySetting {
  id: string
  setting_name: string
  setting_value: boolean
  description: string
  category: string
}

export function SecurityManager() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      const [eventsResponse, settingsResponse] = await Promise.all([
        supabase.from('security_events').select('*').order('timestamp', { ascending: false }).limit(50),
        supabase.from('security_settings').select('*').order('category', { ascending: true })
      ])

      if (eventsResponse.error) throw eventsResponse.error
      if (settingsResponse.error) throw settingsResponse.error

      setSecurityEvents(eventsResponse.data || [])
      setSecuritySettings(settingsResponse.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch security data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSecuritySetting = async (settingId: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('security_settings')
        .update({ setting_value: value })
        .eq('id', settingId)

      if (error) throw error

      setSecuritySettings(settings =>
        settings.map(setting =>
          setting.id === settingId ? { ...setting, setting_value: value } : setting
        )
      )

      toast({
        title: "Success",
        description: "Security setting updated"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security setting",
        variant: "destructive"
      })
    }
  }

  const getSecurityScore = () => {
    const enabledSettings = securitySettings.filter(s => s.setting_value).length
    const totalSettings = securitySettings.length
    return totalSettings > 0 ? Math.round((enabledSettings / totalSettings) * 100) : 0
  }

  const getEventStats = () => {
    const total = securityEvents.length
    const critical = securityEvents.filter(e => e.severity === 'critical').length
    const resolved = securityEvents.filter(e => e.status === 'resolved').length
    const open = securityEvents.filter(e => e.status === 'open').length

    return { total, critical, resolved, open }
  }

  const stats = getEventStats()
  const securityScore = getSecurityScore()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground">Monitor and manage system security</p>
        </div>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={securityScore} className="h-3" />
            </div>
            <div className="text-2xl font-bold">{securityScore}%</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {securityScore >= 80 ? 'Excellent security posture' :
             securityScore >= 60 ? 'Good security posture' :
             securityScore >= 40 ? 'Fair security posture' : 'Poor security posture'}
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Monitor security incidents and threats</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.event_type}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            event.severity === 'critical' ? 'destructive' :
                            event.severity === 'high' ? 'destructive' :
                            event.severity === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            event.status === 'resolved' ? 'default' :
                            event.status === 'investigating' ? 'secondary' : 'destructive'
                          }
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-4">
            {['Authentication', 'Network', 'Data Protection', 'Monitoring'].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {category === 'Authentication' && <Key className="h-5 w-5 mr-2" />}
                    {category === 'Network' && <Globe className="h-5 w-5 mr-2" />}
                    {category === 'Data Protection' && <Database className="h-5 w-5 mr-2" />}
                    {category === 'Monitoring' && <Eye className="h-5 w-5 mr-2" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securitySettings
                      .filter(setting => setting.category === category.toLowerCase())
                      .map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{setting.setting_name}</div>
                            <div className="text-sm text-muted-foreground">{setting.description}</div>
                          </div>
                          <Switch
                            checked={setting.setting_value}
                            onCheckedChange={(checked) => updateSecuritySetting(setting.id, checked)}
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Network Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Firewall Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SSL Certificate</span>
                    <Badge variant="default">Valid</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>DDoS Protection</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Intrusion Detection</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
