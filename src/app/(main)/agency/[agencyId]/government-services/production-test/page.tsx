'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle, Loader2, Zap, Shield } from 'lucide-react'

const ProductionTestConsole = () => {
  const [testData, setTestData] = useState({
    pin: 'A000000000L',
    taxpayerName: 'Test Taxpayer',
    taxType: 'individual',
    period: 'October',
    year: '2025'
  })
  
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testScenario, setTestScenario] = useState<'success' | 'error'>('success')

  const testScenarios = {
    success: {
      name: 'Successful NIL Filing',
      description: 'Test with valid data that should succeed',
      color: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    error: {
      name: 'Unsuccessful NIL Filing',
      description: 'Test error handling with invalid data',
      color: 'bg-red-50 border-red-200',
      icon: <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const runTest = async () => {
    setIsLoading(true)
    setTestResults(null)
    
    try {
      // Prepare test data based on scenario
      const testPayload = {
        ...testData,
        // For error testing, use invalid data
        ...(testScenario === 'error' && {
          pin: 'INVALID_PIN_123',
          taxpayerName: 'Invalid Taxpayer'
        })
      }

      console.log(`🧪 Testing ${testScenario} scenario:`, testPayload)

      const response = await fetch('/api/kra/nil-return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      })

      const data = await response.json()
      
      setTestResults({
        scenario: testScenario,
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
        success: data.success || false
      })

    } catch (error) {
      setTestResults({
        scenario: testScenario,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        success: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    return success ? 
      <CheckCircle className="h-5 w-5 text-green-600" /> : 
      <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusBadge = (success: boolean) => {
    return success ? 
      <Badge variant="default" className="bg-green-600">Success</Badge> : 
      <Badge variant="destructive">Error</Badge>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Production Test Console
            <Badge variant="default" className="bg-green-600">Live API</Badge>
          </CardTitle>
          <CardDescription>
            Test your production KRA API integration with real scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Test Scenario Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Test Scenario</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(testScenarios).map(([key, scenario]) => (
                <div
                  key={key}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    testScenario === key ? scenario.color : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setTestScenario(key as 'success' | 'error')}
                >
                  <div className="flex items-center gap-3">
                    {scenario.icon}
                    <div>
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-sm text-gray-500">{scenario.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Data Input */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Test Data</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pin">PIN Number</Label>
                <Input
                  id="pin"
                  value={testData.pin}
                  onChange={(e) => setTestData(prev => ({ ...prev, pin: e.target.value }))}
                  placeholder="A000000000L"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxpayerName">Taxpayer Name</Label>
                <Input
                  id="taxpayerName"
                  value={testData.taxpayerName}
                  onChange={(e) => setTestData(prev => ({ ...prev, taxpayerName: e.target.value }))}
                  placeholder="Taxpayer Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxType">Tax Type</Label>
                <Select value={testData.taxType} onValueChange={(value) => setTestData(prev => ({ ...prev, taxType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={testData.period} onValueChange={(value) => setTestData(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={testData.year}
                  onChange={(e) => setTestData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2025"
                />
              </div>
            </div>
          </div>

          {/* Run Test Button */}
          <Button 
            onClick={runTest} 
            disabled={isLoading}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing {testScenario} scenario...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run {testScenario} Test
              </>
            )}
          </Button>

          {/* Test Results */}
          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Test Results</h3>
                {getStatusIcon(testResults.success)}
                {getStatusBadge(testResults.success)}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Scenario:</strong> {testScenarios[testResults.scenario].name}
                  </div>
                  <div className="text-sm">
                    <strong>Timestamp:</strong> {new Date(testResults.timestamp).toLocaleString()}
                  </div>
                  {testResults.status && (
                    <div className="text-sm">
                      <strong>HTTP Status:</strong> {testResults.status}
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Response Data:</div>
                  <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                    {JSON.stringify(testResults.data || testResults.error, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Production Environment Info */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Production Environment</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>App ID:</strong> 593e6bdf-2300-430e-b855-8ae14358db0e</div>
              <div><strong>Endpoint:</strong> https://api.kra.go.ke/dtd/return/v1/nil</div>
              <div><strong>Status:</strong> Live and Ready</div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default ProductionTestConsole
