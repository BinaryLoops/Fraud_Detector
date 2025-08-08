'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, User, Bell, Shield, Database, Mail, Palette, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  timezone: string
  language: string
}

interface SystemSettings {
  id: string
  setting_key: string
  setting_value: string
  category: string
  description: string
}

export function SettingsManager() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const [profileResponse, settingsResponse] = await Promise.all([
        supabase.from('users').select('*').single(),
        supabase.from('system_settings').select('*')
      ])

      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        throw profileResponse.error
      }
      if (settingsResponse.error) throw settingsResponse.error

      setUserProfile(profileResponse.data)
      setSystemSettings(settingsResponse.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userProfile?.id)
        .select()
        .single()

      if (error) throw error

      setUserProfile(data)
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const updateSystemSetting = async (settingKey: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: value })
        .eq('setting_key', settingKey)

      if (error) throw error

      setSystemSettings(settings =>
        settings.map(setting =>
          setting.setting_key === settingKey ? { ...setting, setting_value: value } : setting
        )
      )

      toast({
        title: "Success",
        description: "Setting updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      })
    }
  }

  const getSettingValue = (key: string) => {
    const setting = systemSettings.find(s => s.setting_key === key)
    return setting?.setting_value || ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Settings
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {userProfile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={userProfile?.full_name || ''}
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile?.email || ''}
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={userProfile?.phone || ''}
                    onChange={(e) => setUserProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={userProfile?.timezone || ''}
                    onValueChange={(value) => setUserProfile(prev => prev ? { ...prev, timezone: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => userProfile && updateUserProfile(userProfile)}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                  <Switch
                    checked={getSettingValue('email_notifications') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('email_notifications', checked.toString())}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive push notifications in browser</div>
                  </div>
                  <Switch
                    checked={getSettingValue('push_notifications') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('push_notifications', checked.toString())}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Fraud Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified of fraud detection events</div>
                  </div>
                  <Switch
                    checked={getSettingValue('fraud_alerts') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('fraud_alerts', checked.toString())}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">System Updates</div>
                    <div className="text-sm text-muted-foreground">Notifications about system updates</div>
                  </div>
                  <Switch
                    checked={getSettingValue('system_updates') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('system_updates', checked.toString())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input id="current_password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input id="new_password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input id="confirm_password" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                  </div>
                  <Switch
                    checked={getSettingValue('two_factor_auth') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('two_factor_auth', checked.toString())}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Login Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified of new login attempts</div>
                  </div>
                  <Switch
                    checked={getSettingValue('login_notifications') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('login_notifications', checked.toString())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={getSettingValue('session_timeout')}
                    onChange={(e) => updateSystemSetting('session_timeout', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    value={getSettingValue('max_login_attempts')}
                    onChange={(e) => updateSystemSetting('max_login_attempts', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="data_retention">Data Retention (days)</Label>
                  <Input
                    id="data_retention"
                    type="number"
                    value={getSettingValue('data_retention')}
                    onChange={(e) => updateSystemSetting('data_retention', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="backup_frequency">Backup Frequency</Label>
                  <Select
                    value={getSettingValue('backup_frequency')}
                    onValueChange={(value) => updateSystemSetting('backup_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-muted-foreground">Enable maintenance mode</div>
                  </div>
                  <Switch
                    checked={getSettingValue('maintenance_mode') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('maintenance_mode', checked.toString())}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Debug Mode</div>
                    <div className="text-sm text-muted-foreground">Enable debug logging</div>
                  </div>
                  <Switch
                    checked={getSettingValue('debug_mode') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('debug_mode', checked.toString())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={getSettingValue('theme')}
                  onValueChange={(value) => updateSystemSetting('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={getSettingValue('language')}
                  onValueChange={(value) => updateSystemSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Compact Mode</div>
                    <div className="text-sm text-muted-foreground">Use compact layout for tables and lists</div>
                  </div>
                  <Switch
                    checked={getSettingValue('compact_mode') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('compact_mode', checked.toString())}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Animations</div>
                    <div className="text-sm text-muted-foreground">Enable UI animations and transitions</div>
                  </div>
                  <Switch
                    checked={getSettingValue('animations') === 'true'}
                    onCheckedChange={(checked) => updateSystemSetting('animations', checked.toString())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
