import { NextRequest, NextResponse } from 'next/server'
import { kraApiService } from '@/lib/kra-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pin } = body
    
    console.log('🔍 PIN Verification request:', { pin })

    if (!pin) {
      return NextResponse.json({
        valid: false,
        error: 'PIN is required'
      }, { status: 400 })
    }

    // Validate PIN format
    if (!pin.match(/^[A-Z]\d{9}[A-Z]$/)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid PIN format. Must be in format A123456789M'
      }, { status: 400 })
    }

    // Verify with KRA API
    const result = await kraApiService.verifyPIN(pin)

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('❌ PIN Verification Error:', error)
    
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to verify PIN'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'KRA PIN Verification API endpoint',
    status: 'active',
    domain: 'Sandbox',
    version: '1.0.0'
  })
}
