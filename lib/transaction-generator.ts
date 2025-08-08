export interface Transaction {
  id: string
  amount: number
  merchantName: string
  merchantCategory: string
  location: string
  cardNumber: string
  timestamp: Date
  riskLevel: 'high' | 'medium' | 'low' | 'pending'
  aiAnalysis?: {
    riskLevel: 'high' | 'medium' | 'low'
    reasoning: string
    riskFactors: string[]
    confidence: number
  }
}

const merchants = [
  'Amazon', 'Walmart', 'Target', 'Starbucks', 'McDonald\'s', 'Shell', 'Exxon',
  'Home Depot', 'Best Buy', 'CVS Pharmacy', 'Walgreens', 'Costco', 'Apple Store',
  'Google Play', 'Netflix', 'Spotify', 'Uber', 'Lyft', 'DoorDash', 'Grubhub'
]

const categories = [
  'Grocery', 'Gas Station', 'Restaurant', 'Retail', 'Entertainment', 'Transportation',
  'Healthcare', 'Utilities', 'Online Services', 'Travel', 'Hotels', 'Airlines'
]

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC'
]

const suspiciousLocations = [
  'Lagos, Nigeria', 'Moscow, Russia', 'Beijing, China', 'Mumbai, India', 'São Paulo, Brazil'
]

export function generateMockTransaction(): Transaction {
  const isSuspicious = Math.random() < 0.15 // 15% chance of suspicious transaction
  
  // More sophisticated amount generation
  let amount: number
  if (isSuspicious) {
    const suspicionType = Math.random()
    if (suspicionType < 0.3) {
      // Micro transactions (card testing)
      amount = Math.random() * 0.99 + 0.01
    } else if (suspicionType < 0.7) {
      // High value transactions
      amount = Math.random() * 8000 + 2000
    } else {
      // Round amounts
      amount = Math.floor(Math.random() * 20 + 1) * 100
    }
  } else {
    // Normal transaction amounts
    amount = Math.random() * 300 + 5
  }
  
  const location = isSuspicious && Math.random() < 0.6
    ? suspiciousLocations[Math.floor(Math.random() * suspiciousLocations.length)]
    : locations[Math.floor(Math.random() * locations.length)]
  
  // More realistic merchant selection
  let merchantName = merchants[Math.floor(Math.random() * merchants.length)]
  if (isSuspicious && Math.random() < 0.3) {
    // Add suspicious merchant names
    const suspiciousMerchants = ['TempMerchant', 'TestStore', 'UnknownVendor', 'CashAdvance']
    merchantName = suspiciousMerchants[Math.floor(Math.random() * suspiciousMerchants.length)]
  }
  
  const merchantCategory = categories[Math.floor(Math.random() * categories.length)]
  
  // Generate more realistic card numbers
  const cardNumber = `****-****-****-${Math.floor(Math.random() * 9000) + 1000}`
  
  // Determine risk level based on various factors
  let riskLevel: Transaction['riskLevel'] = 'pending'
  
  if (isSuspicious) {
    riskLevel = amount > 3000 || amount < 1 ? 'high' : 'medium'
  } else {
    riskLevel = Math.random() < 0.05 ? 'medium' : 'low'
  }
  
  // Sometimes generate transactions at suspicious times
  let timestamp = new Date()
  if (isSuspicious && Math.random() < 0.4) {
    // Generate suspicious timing (2-5 AM)
    const suspiciousHour = Math.floor(Math.random() * 4) + 2
    timestamp = new Date()
    timestamp.setHours(suspiciousHour, Math.floor(Math.random() * 60), 0, 0)
  }
  
  return {
    id: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
    merchantName,
    merchantCategory,
    location,
    cardNumber,
    timestamp,
    riskLevel
  }
}
