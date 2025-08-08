'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  merchant: string
  timestamp: string
  status: 'approved' | 'flagged' | 'blocked'
  riskScore: number
  cardNumber: string
  location: string
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    amount: 1250.00,
    merchant: 'Amazon.com',
    timestamp: '2024-01-15 14:30:22',
    status: 'approved',
    riskScore: 15,
    cardNumber: '**** **** **** 1234',
    location: 'New York, NY'
  },
  {
    id: 'TXN002',
    amount: 5000.00,
    merchant: 'Luxury Watches Inc',
    timestamp: '2024-01-15 13:45:10',
    status: 'flagged',
    riskScore: 85,
    cardNumber: '**** **** **** 5678',
    location: 'Miami, FL'
  },
  {
    id: 'TXN003',
    amount: 50.00,
    merchant: 'Gas Station',
    timestamp: '2024-01-15 12:15:33',
    status: 'approved',
    riskScore: 5,
    cardNumber: '**** **** **** 9012',
    location: 'Chicago, IL'
  },
  {
    id: 'TXN004',
    amount: 10000.00,
    merchant: 'Electronics Store',
    timestamp: '2024-01-15 11:20:45',
    status: 'blocked',
    riskScore: 95,
    cardNumber: '**** **** **** 3456',
    location: 'Los Angeles, CA'
  }
]

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-800',
      flagged: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-green-100 text-green-800">Low</Badge>
    if (score < 70) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
    return <Badge className="bg-red-100 text-red-800">High</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction Monitor</h1>
        <p className="text-muted-foreground">
          Monitor and analyze all payment transactions in real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">-20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">$</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and filter all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.merchant}</TableCell>
                    <TableCell>{transaction.cardNumber}</TableCell>
                    <TableCell>{transaction.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{transaction.riskScore}%</span>
                        {getRiskBadge(transaction.riskScore)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        {getStatusBadge(transaction.status)}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
