'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import { AlertsManager } from '@/components/alerts-manager'

interface Alert {
  id: string
  type: 'high_risk' | 'suspicious_pattern' | 'velocity_check' | 'geolocation' | 'device_fingerprint'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'investigating' | 'resolved' | 'false_positive'
  transactionId: string
  amount: number
  merchant: string
  timestamp: string
  riskScore: number
}

export default function AlertsPage() {
  return <AlertsManager />
}
