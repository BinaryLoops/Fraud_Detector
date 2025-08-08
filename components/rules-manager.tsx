'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Shield, AlertTriangle, CheckCircle, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface FraudRule {
  id: string
  name: string
  description: string
  condition: string
  action: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  is_active: boolean
  created_at: string
  updated_at: string
  triggered_count: number
}

export function RulesManager() {
  const [rules, setRules] = useState<FraudRule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRule, setSelectedRule] = useState<FraudRule | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('fraud_rules')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRules(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fraud rules",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddRule = async (ruleData: Partial<FraudRule>) => {
    try {
      const { data, error } = await supabase
        .from('fraud_rules')
        .insert([{ ...ruleData, triggered_count: 0 }])
        .select()

      if (error) throw error
      
      setRules([...rules, data[0]])
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: "Fraud rule added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add fraud rule",
        variant: "destructive"
      })
    }
  }

  const handleUpdateRule = async (ruleId: string, updates: Partial<FraudRule>) => {
    try {
      const { data, error } = await supabase
        .from('fraud_rules')
        .update(updates)
        .eq('id', ruleId)
        .select()

      if (error) throw error
      
      setRules(rules.map(rule => rule.id === ruleId ? data[0] : rule))
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: "Fraud rule updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fraud rule",
        variant: "destructive"
      })
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('fraud_rules')
        .delete()
        .eq('id', ruleId)

      if (error) throw error
      
      setRules(rules.filter(rule => rule.id !== ruleId))
      toast({
        title: "Success",
        description: "Fraud rule deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fraud rule",
        variant: "destructive"
      })
    }
  }

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    await handleUpdateRule(ruleId, { is_active: isActive })
  }

  const getRuleStats = () => {
    const total = rules.length
    const active = rules.filter(r => r.is_active).length
    const inactive = rules.filter(r => !r.is_active).length
    const critical = rules.filter(r => r.severity === 'critical').length

    return { total, active, inactive, critical }
  }

  const stats = getRuleStats()

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
          <h1 className="text-3xl font-bold">Fraud Rules Management</h1>
          <p className="text-muted-foreground">Configure and manage fraud detection rules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Fraud Rule</DialogTitle>
              <DialogDescription>Create a new fraud detection rule</DialogDescription>
            </DialogHeader>
            <RuleForm onSubmit={handleAddRule} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Rules</CardTitle>
            <Shield className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Rules</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Rules</CardTitle>
          <CardDescription>Manage your fraud detection rules and their configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Triggered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground">{rule.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        rule.severity === 'critical' ? 'destructive' :
                        rule.severity === 'high' ? 'destructive' :
                        rule.severity === 'medium' ? 'default' : 'secondary'
                      }
                    >
                      {rule.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={(checked) => toggleRuleStatus(rule.id, checked)}
                      />
                      <span className="text-sm">
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.triggered_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRule(rule)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Fraud Rule</DialogTitle>
            <DialogDescription>Update fraud rule configuration</DialogDescription>
          </DialogHeader>
          {selectedRule && (
            <RuleForm
              rule={selectedRule}
              onSubmit={(data) => handleUpdateRule(selectedRule.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RuleForm({ rule, onSubmit }: { rule?: FraudRule; onSubmit: (data: Partial<FraudRule>) => void }) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    condition: rule?.condition || '',
    action: rule?.action || 'flag',
    severity: rule?.severity || 'medium',
    is_active: rule?.is_active ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Rule Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="condition">Condition</Label>
        <Textarea
          id="condition"
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          placeholder="e.g., amount > 10000 AND location != user_location"
          required
        />
      </div>
      <div>
        <Label htmlFor="action">Action</Label>
        <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flag">Flag Transaction</SelectItem>
            <SelectItem value="block">Block Transaction</SelectItem>
            <SelectItem value="review">Send for Review</SelectItem>
            <SelectItem value="alert">Generate Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="severity">Severity</Label>
        <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
      <DialogFooter>
        <Button type="submit">Save Rule</Button>
      </DialogFooter>
    </form>
  )
}
