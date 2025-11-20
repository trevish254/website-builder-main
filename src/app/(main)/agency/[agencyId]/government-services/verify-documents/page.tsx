'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  User, 
  Building, 
  Calendar,
  ArrowLeft,
  Download,
  Award,
  AlertTriangle,
  Info
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  params: { agencyId: string }
}

interface NILReturnFormData {
  taxpayerName: string
  pin: string
  taxType: string
  taxYear: string
  obligationCode: number
}

interface SubmissionResult {
  success: boolean
  message: string
  returnId?: string
  acknowledgmentNumber?: string
  submissionDate?: string
  errors?: string[]
  errorCode?: string
  errorMessage?: string
  isValidationError?: boolean
  demoMode?: boolean
  sandboxMode?: boolean
  tc002Passed?: boolean
  originalError?: {
    errorCode: string
    errorMessage: string
  }
}

const NILReturnFilingPage = ({ params }: Props) => {
  const router = useRouter()
  const [formData, setFormData] = useState<NILReturnFormData>({
    taxpayerName: '',
    pin: '',
    taxType: 'ITR',
    taxYear: '2024',
    obligationCode: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
  const [pinValidation, setPinValidation] = useState<{valid: boolean, taxpayerName?: string, error?: string} | null>(null)

  const taxTypes = [
    { value: 'ITR', label: 'Individual Income Tax - Resident (ITR)', description: 'Resident individual income tax return', obligationCode: 1 },
    { value: 'ITNR', label: 'Individual Income Tax - Non Resident (ITNR)', description: 'Non-resident individual income tax return', obligationCode: 2 },
    { value: 'IT2P', label: 'Income Tax - Partnership (IT2P)', description: 'Partnership income tax return', obligationCode: 3 },
    { value: 'IT2C', label: 'Income Tax - Corporate (IT2C)', description: 'Corporate income tax return', obligationCode: 4 },
    { value: 'VAT', label: 'Value Added Tax (VAT)', description: 'VAT return', obligationCode: 5 },
    { value: 'PAYE', label: 'Pay As You Earn (PAYE)', description: 'PAYE return', obligationCode: 6 },
    { value: 'EXCISE', label: 'Excise Tax', description: 'Excise tax return', obligationCode: 7 },
    { value: 'RENTAL', label: 'Monthly Rental Income', description: 'Monthly rental income return', obligationCode: 8 },
    { value: 'TOT', label: 'Turn Over Tax (TOT)', description: 'Turn over tax return', obligationCode: 9 }
  ]

  const taxYears = Array.from({ length: 16 }, (_, i) => {
    const year = 2025 - i
    return { value: year.toString(), label: `${year}/${year + 1}` }
  })

  const validatePIN = async (pin: string) => {
    // KRA PIN format: Letter + 9 digits + Letter (e.g., A123456789K)
    if (!pin || !pin.match(/^[A-Z]\d{9}[A-Z]$/)) {
      setPinValidation({ 
        valid: false, 
        error: 'Invalid PIN format. KRA PIN should be in format: A123456789K (Letter + 9 digits + Letter)' 
      })
      return
    }

    try {
      // Simulate KRA PIN verification API call
      console.log('🔍 Verifying PIN with KRA:', pin)
      
      // Mock API call - in real implementation, this would call KRA's PIN verification endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful verification
      setPinValidation({ 
        valid: true, 
        taxpayerName: 'John Doe Enterprises Ltd' // This would come from KRA API
      })
      
      // Auto-populate taxpayer name
      setFormData(prev => ({ ...prev, taxpayerName: 'John Doe Enterprises Ltd' }))
      
    } catch (error) {
      console.error('❌ PIN verification error:', error)
      setPinValidation({ 
        valid: false, 
        error: 'Failed to verify PIN with KRA. Please check your internet connection and try again.' 
      })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmissionResult(null)
    
    try {
      const selectedTaxType = taxTypes.find(type => type.value === formData.taxType)
      
      // Prepare KRA API payload based on the JSON structure
      const kraPayload = {
        TAXPAYERDETAILS: {
          TaxpayerPIN: formData.pin,
          ObligationCode: selectedTaxType?.obligationCode || 1,
          Month: 1, // KRA uses month 1 for yearly returns
          Year: parseInt(formData.taxYear)
        }
      }
      
      console.log('🚀 Submitting NIL Return to KRA:', kraPayload)
      
      const response = await fetch('/api/kra/nil-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kraPayload)
      })

      const result = await response.json()
      
      console.log('📋 KRA API Response:', result)
      
      setSubmissionResult({
        ...result,
        taxYear: formData.taxYear,
        taxType: selectedTaxType?.label,
        taxpayerName: formData.taxpayerName || pinValidation?.taxpayerName || 'Taxpayer',
        referenceNumber: result.success ? `NIL-${formData.taxType}-${Date.now()}` : undefined
      })
      
    } catch (error) {
      console.error('❌ Submission error:', error)
      setSubmissionResult({
        success: false,
        message: 'Network error occurred',
        errors: ['Failed to connect to KRA API']
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <FileText className="h-8 w-8 text-green-600" />
            NIL Return Filing
          </h1>
          <p className="text-muted-foreground">
            File a NIL return with KRA for taxpayers with no taxable income during the tax year
          </p>
        </div>
      </div>

      {/* Sandbox Environment Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">KRA TC002 Sandbox Environment</h3>
              <p className="text-sm text-blue-700">
                This form integrates with KRA&apos;s TC002 NIL Return Filing test case. All submissions will trigger the sandbox test case and automatically pass, appearing in the Validation dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                NIL Return Filing Form
              </CardTitle>
              <CardDescription>
                Complete the form below to file a NIL return with KRA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Taxpayer Name */}
              <div className="space-y-2">
                <Label htmlFor="taxpayerName">Taxpayer Name</Label>
                <Input
                  id="taxpayerName"
                  value={formData.taxpayerName}
                  onChange={(e) => setFormData({...formData, taxpayerName: e.target.value})}
                  placeholder={pinValidation?.valid ? "Auto-populated from PIN verification" : "Enter taxpayer name or verify PIN"}
                  readOnly={pinValidation?.valid}
                  className={pinValidation?.valid ? 'bg-gray-50' : ''}
                />
              </div>
              
              {/* KRA PIN */}
              <div className="space-y-2">
                <Label htmlFor="pin">KRA PIN</Label>
                <div className="flex gap-2">
                  <Input
                    id="pin"
                    value={formData.pin}
                    onChange={(e) => {
                      setFormData({...formData, pin: e.target.value})
                      setPinValidation(null)
                    }}
                    placeholder="Enter KRA PIN (e.g., A123456789M)"
                    className={pinValidation ? (pinValidation.valid ? 'border-green-500' : 'border-red-500') : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => validatePIN(formData.pin)}
                    disabled={!formData.pin}
                  >
                    Verify
                  </Button>
                </div>
                {pinValidation && (
                  <div className={`text-sm p-2 rounded ${
                    pinValidation.valid 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {pinValidation.valid ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Valid PIN - {pinValidation.taxpayerName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        <span>{pinValidation.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tax Type */}
              <div className="space-y-2">
                <Label>Tax Type</Label>
                <select
                  value={formData.taxType}
                  onChange={(e) => {
                    const selectedType = taxTypes.find(type => type.value === e.target.value)
                    setFormData({
                      ...formData, 
                      taxType: e.target.value,
                      obligationCode: selectedType?.obligationCode || 1
                    })
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {taxTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  {taxTypes.find(type => type.value === formData.taxType)?.description}
                </p>
              </div>

              {/* Tax Year */}
              <div className="space-y-2">
                <Label htmlFor="taxYear">Tax Year</Label>
                <select
                  id="taxYear"
                  value={formData.taxYear}
                  onChange={(e) => setFormData({...formData, taxYear: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {taxYears.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.pin || !formData.taxpayerName || !formData.taxType || !formData.taxYear}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting to KRA...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Submit NIL Return
                  </div>
                )}
              </Button>

              {/* Form Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">📋 Form Status</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={formData.taxpayerName ? 'text-green-600' : 'text-red-600'}>
                      {formData.taxpayerName ? '✅' : '❌'}
                    </span>
                    Taxpayer Name: {formData.taxpayerName ? 'Provided' : 'Required'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={formData.pin ? 'text-green-600' : 'text-red-600'}>
                      {formData.pin ? '✅' : '❌'}
                    </span>
                    KRA PIN: {formData.pin ? 'Entered' : 'Required'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={formData.taxType ? 'text-green-600' : 'text-red-600'}>
                      {formData.taxType ? '✅' : '❌'}
                    </span>
                    Tax Type: {formData.taxType ? 'Selected' : 'Required'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={formData.taxYear ? 'text-green-600' : 'text-red-600'}>
                      {formData.taxYear ? '✅' : '❌'}
                    </span>
                    Tax Year: {formData.taxYear ? `${formData.taxYear}/${parseInt(formData.taxYear) + 1}` : 'Required'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Success Message */}
          {submissionResult?.success && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  🎉 NIL Return Successfully Filed!
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  Your NIL return for Tax Year {formData.taxYear}/{parseInt(formData.taxYear) + 1} has been submitted to KRA.
                  {submissionResult.demoMode && (
                    <span className="block mt-2 text-blue-600 font-medium">
                      📋 Demo Mode - This is a simulation for testing purposes
                    </span>
                  )}
                  {submissionResult.sandboxMode && (
                    <span className="block mt-2 text-blue-600 font-medium">
                      🧪 Sandbox Test Passed - This submission triggered the sandbox test case and will appear in the Validation dashboard
                    </span>
                  )}
                  {submissionResult.tc002Passed && (
                    <span className="block mt-2 text-green-600 font-medium">
                      ✅ TC002 Test Passed - KRA NIL Return Filing test case completed successfully
                    </span>
                  )}
                </p>
                
                {submissionResult.acknowledgmentNumber && (
                  <div className="bg-white p-3 rounded-lg border mb-4">
                    <div className="text-sm text-gray-600">Acknowledgment Number</div>
                    <div className="font-mono text-lg font-bold text-green-600">
                      {submissionResult.acknowledgmentNumber}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Acknowledgment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {submissionResult && !submissionResult.success && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-bold text-red-800">
                    {submissionResult.isValidationError ? 'KRA Validation Error' : 'Submission Failed'}
                  </h3>
                </div>
                
                {submissionResult.isValidationError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">KRA Validation Error</span>
                    </div>
                    <div className="text-sm text-yellow-700">
                      <strong>Error Code:</strong> {submissionResult.errorCode}<br/>
                      <strong>Error Message:</strong> {submissionResult.errorMessage}
                    </div>
                  </div>
                )}
                
                <p className="text-red-700 text-sm mb-3">
                  {submissionResult.message}
                </p>
                {submissionResult.errors && (
                  <div className="space-y-1">
                    {submissionResult.errors.map((error: string, index: number) => (
                      <div key={index} className="text-sm text-red-600">
                        • {error}
                      </div>
                    ))}
                  </div>
                )}
                
                {submissionResult.isValidationError && submissionResult.errorCode === '82002' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <div className="text-sm text-blue-800">
                      <strong>💡 What this means:</strong><br/>
                      The PIN you entered is not active for Income Tax Resident Individual obligations. This could mean:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>The PIN is not registered for Income Tax</li>
                        <li>The taxpayer has not activated this obligation type</li>
                        <li>The PIN format is incorrect</li>
                      </ul>
                      <strong>Next steps:</strong> Verify the PIN with KRA or contact the taxpayer to ensure their tax obligations are properly set up.
                    </div>
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  className="mt-3"
                  onClick={() => {
                    setSubmissionResult(null)
                  }}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>What is a NIL Return?</strong>
                <p className="text-gray-600 mt-1">
                  A NIL return is filed when a taxpayer has no taxable income during a specific tax year.
                </p>
              </div>
              <div className="text-sm">
                <strong>When to file?</strong>
                <p className="text-gray-600 mt-1">
                  File within 6 months after the end of the tax year (June 30th for most taxpayers).
                </p>
              </div>
              <div className="text-sm">
                <strong>Sandbox Testing</strong>
                <p className="text-gray-600 mt-1">
                  This form uses KRA&apos;s sandbox environment. All submissions will appear in the Validation dashboard for testing purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Filings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Filings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { period: '2023/2024', status: 'Filed', time: '2 months ago' },
                  { period: '2022/2023', status: 'Filed', time: '1 year ago' },
                  { period: '2021/2022', status: 'Filed', time: '2 years ago' }
                ].map((filing, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{filing.period}</div>
                      <div className="text-xs text-gray-500">{filing.time}</div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {filing.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NILReturnFilingPage
