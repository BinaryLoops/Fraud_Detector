'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, CheckCircle, XCircle, Search, Filter, Eye, MoreHorizontal, Download, RefreshCw, TrendingUp, TrendingDown, Activity, DollarSign, Users, Clock } from 'lucide-react'
import { Transaction, generateMockTransaction } from '@/lib/transaction-generator'
import { analyzeTransaction } from '@/lib/fraud-detector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('24h')
  const [loading, setLoading] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    totalAmount: 0,
    avgAmount: 0
  })

  useEffect(() => {
    // Generate initial transactions
    const initialTransactions = Array.from({ length: 50 }, () => generateMockTransaction())
    setTransactions(initialTransactions)
    setFilteredTransactions(initialTransactions)
    updateStats(initialTransactions)

    // Simulate real-time transaction stream
    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction()
      setTransactions(prev => {
        const updated = [newTransaction, ...prev.slice(0, 199)] // Keep last 200
        updateStats(updated)
        return updated
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cardNumber.includes(searchTerm) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.riskLevel === statusFilter)
    }

    if (timeFilter !== 'all') {
      const now = new Date()
      const timeMap = {
        '1h': 1 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      const timeLimit = timeMap[timeFilter as keyof typeof timeMap]
      if (timeLimit) {
        filtered = filtered.filter(t => now.getTime() - t.timestamp.getTime() <= timeLimit)
      }
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter, timeFilter])

  const updateStats = (transactionList: Transaction[]) => {
    const total = transactionList.length
    const highRisk = transactionList.filter(t => t.riskLevel === 'high').length
    const mediumRisk = transactionList.filter(t => t.riskLevel === 'medium').length
    const lowRisk = transactionList.filter(t => t.riskLevel === 'low').length
    const totalAmount = transactionList.reduce((sum, t) => sum + t.amount, 0)
    const avgAmount = total > 0 ? totalAmount / total : 0

    setStats({ total, highRisk, mediumRisk, lowRisk, totalAmount, avgAmount })
  }

  const handleAnalyzeTransaction = async (transactionId: string) => {
    setLoading(transactionId)
    const transaction = transactions.find(t => t.id === transactionId)
    if (transaction) {
      try {
        const analysis = await analyzeTransaction(transaction)
        setTransactions(prev => 
          prev.map(t => 
            t.id === transactionId 
              ? { ...t, aiAnalysis: analysis, riskLevel: analysis.riskLevel }
              : t
          )
        )
      } catch (error) {
        console.error('Analysis failed:', error)
      }
    }
    setLoading(null)
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive" className="flex items-center gap-1">
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
        return <Badge variant="outline">Pending Analysis</Badge>
    }
  }

  const getAmountColor = (amount: number, riskLevel: string) => {
    if (riskLevel === 'high') return 'text-red-600 font-bold'
    if (amount > 1000) return 'text-orange-600 font-semibold'
    return 'text-gray-900 font-semibold'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Transaction Management</h1>
          <p className="text-gray-400 mt-1">Monitor, analyze, and manage all transactions in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export Data
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
            <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">High Risk</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.highRisk}</div>
            <div className="flex items-center text-sm text-red-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              -8.2% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${stats.totalAmount.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.3% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Amount</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">${stats.avgAmount.toFixed(2)}</div>
            <div className="flex items-center text-sm text-purple-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5.7% from yesterday
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
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Live Transaction Monitor
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time transaction processing and fraud detection
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors bg-gray-900/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {transaction.id}
                    </span>
                    {getRiskBadge(transaction.riskLevel)}
                    {transaction.timestamp > new Date(Date.now() - 10000) && (
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem 
                          onClick={() => handleAnalyzeTransaction(transaction.id)}
                          className="text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {loading === transaction.id ? 'Analyzing...' : 'Analyze'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                          Flag as Suspicious
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                          Add to Whitelist
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                    <div className="text-xs text-gray-500">{transaction.merchantCategory}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Location</span>
                    <div className="font-medium text-white">{transaction.location}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Card</span>
                    <div className="font-mono text-white">****{transaction.cardNumber.slice(-4)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Status</span>
                    <div className="flex items-center gap-1">
                      {transaction.aiAnalysis ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                          Analyzed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-600 text-gray-400">Pending</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {transaction.aiAnalysis && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-blue-400">AI Analysis Results</h4>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Confidence: {(transaction.aiAnalysis.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-300 mb-3">{transaction.aiAnalysis.reasoning}</p>
                    {transaction.aiAnalysis.riskFactors.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {transaction.aiAnalysis.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">No transactions found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
