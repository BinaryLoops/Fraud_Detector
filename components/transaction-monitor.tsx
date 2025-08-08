'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, CheckCircle, XCircle, Search, Filter, Eye, MoreHorizontal } from 'lucide-react'
import { Transaction, generateMockTransaction } from '@/lib/transaction-generator'
import { analyzeTransaction } from '@/lib/fraud-detector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TransactionMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    // Generate initial transactions
    const initialTransactions = Array.from({ length: 25 }, () => generateMockTransaction())
    setTransactions(initialTransactions)
    setFilteredTransactions(initialTransactions)

    // Simulate real-time transaction stream
    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction()
      setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]) // Keep last 100
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cardNumber.includes(searchTerm)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.riskLevel === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter])

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              Live Transaction Monitor
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Real-time transaction processing and fraud detection
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {transaction.id}
                  </span>
                  {getRiskBadge(transaction.riskLevel)}
                  {transaction.timestamp > new Date(Date.now() - 10000) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAnalyzeTransaction(transaction.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {loading === transaction.id ? 'Analyzing...' : 'Analyze'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Flag as Suspicious
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Amount</span>
                  <div className={getAmountColor(transaction.amount, transaction.riskLevel)}>
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 block">Merchant</span>
                  <div className="font-medium truncate">{transaction.merchantName}</div>
                  <div className="text-xs text-gray-400">{transaction.merchantCategory}</div>
                </div>
                <div>
                  <span className="text-gray-500 block">Location</span>
                  <div className="font-medium">{transaction.location}</div>
                </div>
                <div>
                  <span className="text-gray-500 block">Card</span>
                  <div className="font-mono">****{transaction.cardNumber.slice(-4)}</div>
                </div>
                <div>
                  <span className="text-gray-500 block">Status</span>
                  <div className="flex items-center gap-1">
                    {transaction.aiAnalysis ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Analyzed
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                </div>
              </div>

              {transaction.aiAnalysis && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-blue-900">AI Analysis Results</h4>
                    <Badge variant="outline" className="bg-white">
                      Confidence: {(transaction.aiAnalysis.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">{transaction.aiAnalysis.reasoning}</p>
                  {transaction.aiAnalysis.riskFactors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {transaction.aiAnalysis.riskFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No transactions found</div>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
