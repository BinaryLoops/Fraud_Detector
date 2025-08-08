import { Transaction, generateMockTransaction } from './transaction-generator'

export interface LiveStats {
  totalTransactions: number
  fraudDetected: number
  totalAmount: number
  averageAmount: number
  riskScore: number
  accuracy: number
  processingSpeed: number
  activeUsers: number
  transactionsPerSecond: number
  blockedTransactions: number
  flaggedTransactions: number
  approvedTransactions: number
}

export interface LiveAlert {
  id: string
  type: 'fraud' | 'anomaly' | 'pattern' | 'velocity' | 'geographic' | 'amount'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  message: string
  timestamp: Date
  transactionId?: string
  amount?: number
  location?: string
  confidence: number
}

class LiveTransactionEngine {
  private transactions: Transaction[] = []
  private alerts: LiveAlert[] = []
  private stats: LiveStats = {
    totalTransactions: 0,
    fraudDetected: 0,
    totalAmount: 0,
    averageAmount: 0,
    riskScore: 2.3,
    accuracy: 97.8,
    processingSpeed: 0.3,
    activeUsers: 8429,
    transactionsPerSecond: 0,
    blockedTransactions: 0,
    flaggedTransactions: 0,
    approvedTransactions: 0
  }
  
  private subscribers: Set<(data: any) => void> = new Set()
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null
  private transactionCount = 0
  private lastSecondCount = 0

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Generate initial transactions
    for (let i = 0; i < 100; i++) {
      const transaction = generateMockTransaction()
      this.transactions.push(transaction)
    }
    this.updateStats()
  }

  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    
    // Generate transactions at varying intervals (0.5-3 seconds)
    const generateTransaction = () => {
      if (!this.isRunning) return
      
      const transaction = generateMockTransaction()
      this.transactions.unshift(transaction)
      
      // Keep only last 1000 transactions for performance
      if (this.transactions.length > 1000) {
        this.transactions = this.transactions.slice(0, 1000)
      }
      
      this.transactionCount++
      
      // Generate alert for high-risk transactions
      if (transaction.riskLevel === 'high' || (transaction.riskLevel === 'medium' && Math.random() > 0.7)) {
        this.generateAlert(transaction)
      }
      
      this.updateStats()
      this.notifySubscribers()
      
      // Schedule next transaction with random interval
      const nextInterval = Math.random() * 2500 + 500 // 0.5-3 seconds
      setTimeout(generateTransaction, nextInterval)
    }
    
    // Start generating transactions
    generateTransaction()
    
    // Update transactions per second counter
    this.intervalId = setInterval(() => {
      this.stats.transactionsPerSecond = this.transactionCount - this.lastSecondCount
      this.lastSecondCount = this.transactionCount
      
      // Update other dynamic stats
      this.stats.activeUsers += Math.floor(Math.random() * 20) - 10
      this.stats.activeUsers = Math.max(5000, Math.min(15000, this.stats.activeUsers))
      
      this.stats.processingSpeed = 0.1 + Math.random() * 0.4 // 0.1-0.5ms
      
      this.notifySubscribers()
    }, 1000)
  }

  stop() {
    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private generateAlert(transaction: Transaction) {
    const alertTypes = [
      {
        type: 'fraud' as const,
        severity: 'critical' as const,
        title: 'High-Risk Fraud Detected',
        message: `Suspicious transaction of $${transaction.amount.toFixed(2)} at ${transaction.merchantName}`
      },
      {
        type: 'anomaly' as const,
        severity: 'high' as const,
        title: 'Transaction Anomaly',
        message: `Unusual spending pattern detected for card ${transaction.cardNumber}`
      },
      {
        type: 'velocity' as const,
        severity: 'medium' as const,
        title: 'Velocity Check Alert',
        message: `Multiple transactions detected in rapid succession`
      },
      {
        type: 'geographic' as const,
        severity: 'high' as const,
        title: 'Geographic Risk Alert',
        message: `Transaction from high-risk location: ${transaction.location}`
      },
      {
        type: 'amount' as const,
        severity: transaction.amount > 5000 ? 'critical' as const : 'high' as const,
        title: 'High-Value Transaction',
        message: `Large transaction amount: $${transaction.amount.toFixed(2)}`
      }
    ]

    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    
    const alert: LiveAlert = {
      id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...alertType,
      timestamp: new Date(),
      transactionId: transaction.id,
      amount: transaction.amount,
      location: transaction.location,
      confidence: 0.7 + Math.random() * 0.3
    }

    this.alerts.unshift(alert)
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100)
    }
  }

  private updateStats() {
    const total = this.transactions.length
    const fraudCount = this.transactions.filter(t => t.riskLevel === 'high').length
    const flaggedCount = this.transactions.filter(t => t.riskLevel === 'medium').length
    const approvedCount = this.transactions.filter(t => t.riskLevel === 'low').length
    const totalAmount = this.transactions.reduce((sum, t) => sum + t.amount, 0)
    
    // Calculate risk score based on recent transactions
    const recentTransactions = this.transactions.slice(0, 50)
    const riskValues = recentTransactions.map(t => {
      switch (t.riskLevel) {
        case 'high': return 9
        case 'medium': return 5
        case 'low': return 1
        default: return 3
      }
    })
    const avgRisk = riskValues.reduce((sum, val) => sum + val, 0) / riskValues.length
    
    this.stats = {
      ...this.stats,
      totalTransactions: total,
      fraudDetected: fraudCount,
      totalAmount,
      averageAmount: total > 0 ? totalAmount / total : 0,
      riskScore: avgRisk || 2.3,
      accuracy: Math.max(95, 100 - (fraudCount / Math.max(total, 1)) * 15),
      blockedTransactions: fraudCount,
      flaggedTransactions: flaggedCount,
      approvedTransactions: approvedCount
    }
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.add(callback)
    
    // Send initial data
    callback({
      transactions: this.transactions.slice(0, 20),
      alerts: this.alerts.slice(0, 10),
      stats: this.stats
    })
    
    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notifySubscribers() {
    const data = {
      transactions: this.transactions.slice(0, 20),
      alerts: this.alerts.slice(0, 10),
      stats: this.stats
    }
    
    this.subscribers.forEach(callback => callback(data))
  }

  // Public getters
  getTransactions(limit = 20) {
    return this.transactions.slice(0, limit)
  }

  getAlerts(limit = 10) {
    return this.alerts.slice(0, limit)
  }

  getStats() {
    return { ...this.stats }
  }

  getAllTransactions() {
    return [...this.transactions]
  }

  getAllAlerts() {
    return [...this.alerts]
  }

  // Quick actions
  blockTransaction(transactionId: string) {
    const index = this.transactions.findIndex(t => t.id === transactionId)
    if (index !== -1) {
      this.transactions[index] = {
        ...this.transactions[index],
        riskLevel: 'high',
        status: 'blocked'
      }
      this.updateStats()
      this.notifySubscribers()
      return true
    }
    return false
  }

  approveTransaction(transactionId: string) {
    const index = this.transactions.findIndex(t => t.id === transactionId)
    if (index !== -1) {
      this.transactions[index] = {
        ...this.transactions[index],
        riskLevel: 'low',
        status: 'approved'
      }
      this.updateStats()
      this.notifySubscribers()
      return true
    }
    return false
  }

  flagTransaction(transactionId: string) {
    const index = this.transactions.findIndex(t => t.id === transactionId)
    if (index !== -1) {
      this.transactions[index] = {
        ...this.transactions[index],
        riskLevel: 'medium',
        status: 'flagged'
      }
      this.updateStats()
      this.notifySubscribers()
      return true
    }
    return false
  }

  dismissAlert(alertId: string) {
    const index = this.alerts.findIndex(a => a.id === alertId)
    if (index !== -1) {
      this.alerts.splice(index, 1)
      this.notifySubscribers()
      return true
    }
    return false
  }
}

// Singleton instance
export const liveEngine = new LiveTransactionEngine()

// Auto-start the engine
if (typeof window !== 'undefined') {
  liveEngine.start()
}
