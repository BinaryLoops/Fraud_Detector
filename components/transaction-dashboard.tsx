'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, CheckCircle, XCircle, Search, Filter } from 'lucide-react'
import { Transaction, generateMockTransaction } from '@/lib/transaction-generator'
import { analyzeTransaction } from '@/lib/fraud-detector'

export function TransactionDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Generate initial transactions
    const initialTransactions = Array.from({ length: 20 }, () => generateMockTransaction())
    setTransactions(initialTransactions)
    setFilteredTransactions(initialTransactions)

    // Simulate real-time transaction stream
    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction()
      setTransactions(prev => [newTransaction, ...prev.slice(0, 49)]) // Keep last 50
    }, 3000)

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
    setLoading(true)
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
        // Show user-friendly error handling
        setTransactions(prev => 
          prev.map(t => 
            t.id === transactionId 
              ? { 
                  ...t, 
                  aiAnalysis: {
                    riskLevel: 'medium' as const,
                    reasoning: 'Analysis temporarily unavailable. Using fallback assessment.',
                    riskFactors: ['System analysis pending'],
                    confidence: 0.5
                  },
                  riskLevel: 'medium' as const
                }
              : t
          )
        )
      }
    }
    setLoading(false)
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
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction Monitoring</span>
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
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm text-gray-600">{transaction.id}</span>
                  {getRiskBadge(transaction.riskLevel)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAnalyzeTransaction(transaction.id)}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Merchant:</span>
                  <div className="font-semibold">{transaction.merchantName}</div>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <div className="font-semibold">{transaction.location}</div>
                </div>
                <div>
                  <span className="text-gray-500">Card:</span>
                  <div className="font-mono">****{transaction.cardNumber.slice(-4)}</div>
                </div>
              </div>

              {transaction.aiAnalysis && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-blue-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-blue-800">{transaction.aiAnalysis.reasoning}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {transaction.aiAnalysis.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
