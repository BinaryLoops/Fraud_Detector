import { Transaction } from './transaction-generator'

export interface FraudAnalysis {
  riskLevel: 'high' | 'medium' | 'low'
  reasoning: string
  riskFactors: string[]
  confidence: number
}

export async function analyzeTransaction(transaction: Transaction): Promise<FraudAnalysis> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  return performAdvancedRuleBasedAnalysis(transaction)
}

function performAdvancedRuleBasedAnalysis(transaction: Transaction): FraudAnalysis {
  const riskFactors: string[] = []
  let riskScore = 0
  const maxScore = 100

  // Amount-based risk factors
  if (transaction.amount > 5000) {
    riskFactors.push('Extremely high transaction amount')
    riskScore += 35
  } else if (transaction.amount > 2000) {
    riskFactors.push('High transaction amount')
    riskScore += 25
  } else if (transaction.amount > 1000) {
    riskFactors.push('Above-average transaction amount')
    riskScore += 15
  }

  // Micro-transaction testing pattern
  if (transaction.amount < 1) {
    riskFactors.push('Micro-transaction (card testing pattern)')
    riskScore += 30
  }

  // Round amount suspicion
  if (transaction.amount % 100 === 0 && transaction.amount >= 100) {
    riskFactors.push('Round amount transaction')
    riskScore += 10
  }

  // Geographic risk assessment
  const highRiskCountries = ['Nigeria', 'Russia', 'China', 'Romania', 'Ukraine']
  const mediumRiskCountries = ['India', 'Brazil', 'Mexico', 'Philippines', 'Indonesia']
  
  const isHighRiskLocation = highRiskCountries.some(country => 
    transaction.location.toLowerCase().includes(country.toLowerCase())
  )
  const isMediumRiskLocation = mediumRiskCountries.some(country => 
    transaction.location.toLowerCase().includes(country.toLowerCase())
  )

  if (isHighRiskLocation) {
    riskFactors.push('High-risk geographic location')
    riskScore += 40
  } else if (isMediumRiskLocation) {
    riskFactors.push('Medium-risk geographic location')
    riskScore += 20
  }

  // Time-based analysis
  const hour = transaction.timestamp.getHours()
  const isWeekend = [0, 6].includes(transaction.timestamp.getDay())
  
  if (hour >= 2 && hour <= 5) {
    riskFactors.push('Very unusual transaction time (2-5 AM)')
    riskScore += 25
  } else if (hour >= 23 || hour <= 6) {
    riskFactors.push('Late night/early morning transaction')
    riskScore += 15
  }

  if (isWeekend && hour >= 23) {
    riskFactors.push('Weekend late-night transaction')
    riskScore += 10
  }

  // Merchant category risk
  const highRiskCategories = ['Online Services', 'Entertainment', 'Travel']
  const lowRiskCategories = ['Grocery', 'Gas Station', 'Utilities']
  
  if (highRiskCategories.includes(transaction.merchantCategory)) {
    riskFactors.push('High-risk merchant category')
    riskScore += 15
  } else if (lowRiskCategories.includes(transaction.merchantCategory)) {
    // Reduce risk for low-risk categories
    riskScore = Math.max(0, riskScore - 10)
  }

  // Velocity simulation (based on transaction timing)
  const recentTransactionPattern = Math.random()
  if (recentTransactionPattern < 0.1) {
    riskFactors.push('High transaction velocity detected')
    riskScore += 30
  } else if (recentTransactionPattern < 0.2) {
    riskFactors.push('Elevated transaction frequency')
    riskScore += 15
  }

  // Card number pattern analysis
  const lastFour = transaction.cardNumber.slice(-4)
  const sequentialPattern = /(\d)\1{2,}/.test(lastFour) // Repeated digits
  if (sequentialPattern) {
    riskFactors.push('Suspicious card number pattern')
    riskScore += 20
  }

  // Merchant name analysis
  const suspiciousMerchantPatterns = ['temp', 'test', 'unknown', 'cash']
  const hasSuspiciousName = suspiciousMerchantPatterns.some(pattern =>
    transaction.merchantName.toLowerCase().includes(pattern)
  )
  
  if (hasSuspiciousName) {
    riskFactors.push('Suspicious merchant name pattern')
    riskScore += 25
  }

  // Calculate final risk level
  let riskLevel: 'high' | 'medium' | 'low'
  let reasoning: string

  if (riskScore >= 60) {
    riskLevel = 'high'
    reasoning = `High fraud risk detected with ${riskFactors.length} critical risk factors. Immediate review recommended.`
  } else if (riskScore >= 30) {
    riskLevel = 'medium'
    reasoning = `Moderate fraud risk identified with ${riskFactors.length} risk factors. Manual review suggested.`
  } else {
    riskLevel = 'low'
    reasoning = `Low fraud risk assessment. Transaction appears legitimate with minimal risk indicators.`
  }

  // Add specific reasoning based on top risk factors
  if (riskFactors.length > 0) {
    const topFactors = riskFactors.slice(0, 3).join(', ')
    reasoning += ` Primary concerns: ${topFactors}.`
  }

  const confidence = Math.min(0.95, Math.max(0.6, riskScore / maxScore + 0.3))

  return {
    riskLevel,
    reasoning,
    riskFactors,
    confidence: Math.round(confidence * 100) / 100
  }
}
