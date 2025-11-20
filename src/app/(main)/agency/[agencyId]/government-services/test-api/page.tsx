'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const KRATestComponent = () => {
  const [testPin, setTestPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testPINVerification = async () => {
    if (!testPin) return

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/kra/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: testPin })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        valid: false,
        error: 'Network error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testNILReturn = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/kra/nil-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taxpayerName: 'Test Taxpayer',
          pin: 'A000000000L',
          taxType: 'company',
          period: 'April',
          year: '2000',
          description: 'Test NIL return submission'
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error occurred',
        errors: ['Failed to connect to KRA API']
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 KRA API Test Console</CardTitle>
          <CardDescription>
            Test the KRA API integration with your sandbox credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Verification Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PIN Verification Test</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter PIN (e.g., A000000000L)"
                value={testPin}
                onChange={(e) => setTestPin(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={testPINVerification}
                disabled={isLoading || !testPin}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test PIN'}
              </Button>
            </div>
          </div>

          {/* NIL Return Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">NIL Return Test</h3>
            <Button 
              onClick={testNILReturn}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Test NIL Return Submission
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <div className={`p-4 rounded-lg border ${
                result.valid || result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.valid || result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {result.valid || result.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                
                <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* API Status */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">API Configuration</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Environment</Label>
                <Badge variant="outline">Sandbox</Badge>
              </div>
              <div>
                <Label>Domain</Label>
                <Badge variant="outline">Sandbox</Badge>
              </div>
              <div>
                <Label>Endpoint</Label>
                <div className="font-mono text-xs bg-gray-100 p-1 rounded">
                  https://sbx.kra.go.ke/dtd/return/v1/nil
                </div>
              </div>
              <div>
                <Label>Product</Label>
                <Badge variant="outline">NIL Return Filing</Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <Label>Request Format</Label>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                {`{
  "TAXPAYERDETAILS": {
    "TaxpayerPIN": "A000000000L",
    "ObligationCode": "4",
    "Month": "04", 
    "Year": "2000"
  }
}`}
              </div>
            </div>

            <div className="mt-4">
              <Label>Obligation Codes</Label>
              <div className="space-y-1 text-xs">
                <div>• &quot;4&quot; - Income Tax - Company</div>
                <div>• &quot;7&quot; - Income Tax - PAYE</div>
                <div>• &quot;9&quot; - Value Added Tax (VAT)</div>
                <div>• &quot;6&quot; - Income Tax - Withholding</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default KRATestComponent
