import { NextRequest, NextResponse } from 'next/server'
import { kraApiService, NILReturnRequest } from '@/lib/kra-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('📝 Received NIL Return request:', body)

    // Handle both old format and new KRA format
    let taxpayerDetails
    if (body.TAXPAYERDETAILS) {
      // New KRA format
      taxpayerDetails = body.TAXPAYERDETAILS
    } else {
      // Old format - convert to KRA format
      taxpayerDetails = {
        TaxpayerPIN: body.pin,
        ObligationCode: body.obligationCode || 1,
        Month: body.month || 1,
        Year: body.year || body.taxYear
      }
    }

    // Validate required fields for KRA format
    if (!taxpayerDetails.TaxpayerPIN || !taxpayerDetails.ObligationCode || !taxpayerDetails.Month || !taxpayerDetails.Year) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        errors: ['TaxpayerPIN, ObligationCode, Month, and Year are required']
      }, { status: 400 })
    }

    // Validate PIN format (basic validation)
    if (!taxpayerDetails.TaxpayerPIN.match(/^[A-Z]\d{9}[A-Z]$/)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid PIN format',
        errors: ['PIN must be in format A123456789M']
      }, { status: 400 })
    }

    // Submit to KRA API using the taxpayer details
    const result = await kraApiService.submitNILReturn({
      pin: taxpayerDetails.TaxpayerPIN,
      obligationCode: taxpayerDetails.ObligationCode,
      month: taxpayerDetails.Month.toString(),
      year: taxpayerDetails.Year.toString(),
      taxpayerName: body.taxpayerName || 'Taxpayer',
      taxType: body.taxType || 'ITR'
    })

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('❌ API Route Error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'KRA NIL Return API endpoint',
    status: 'active',
    domain: 'Sandbox',
    version: '1.0.0'
  })
}
