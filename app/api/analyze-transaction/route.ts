import { NextRequest, NextResponse } from 'next/server'
import { analyzeTransaction } from '@/lib/fraud-detector'

export async function POST(request: NextRequest) {
  try {
    const transaction = await request.json()
    
    if (!transaction || !transaction.id) {
      return NextResponse.json(
        { error: 'Invalid transaction data' },
        { status: 400 }
      )
    }

    const analysis = await analyzeTransaction(transaction)
    
    return NextResponse.json({
      success: true,
      analysis
    })
  } catch (error) {
    console.error('Transaction analysis error:', error)
    
    return NextResponse.json(
      { error: 'Failed to analyze transaction' },
      { status: 500 }
    )
  }
}
