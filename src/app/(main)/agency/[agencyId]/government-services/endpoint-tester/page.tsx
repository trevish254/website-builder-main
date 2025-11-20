'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const EndpointTester = () => {
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({})
  const [isLoading, setIsLoading] = useState(false)

  const testEndpoint = async (endpoint: string, name: string) => {
    setIsLoading(true)
    try {
      console.log(`Testing ${name}: ${endpoint}`)
      
      // Simple HEAD request to check if endpoint is accessible
      const response = await fetch(endpoint, {
        method: 'HEAD',
        mode: 'no-cors' // This will help us detect network issues
      })
      
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'accessible',
          endpoint,
          timestamp: new Date().toISOString()
        }
      }))
      
    } catch (error) {
      console.error(`Error testing ${name}:`, error)
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          endpoint,
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const testAllEndpoints = async () => {
    const endpoints = [
      { name: 'NIL Return', url: 'https://sbx.kra.go.ke/dtd/return/v1/nil' },
      { name: 'PIN Verify', url: 'https://sbx.kra.go.ke/dtd/pin/verify' },
      { name: 'Obligations', url: 'https://sbx.kra.go.ke/dtd/obligations/fetch' },
      { name: 'TCC Checker', url: 'https://sbx.kra.go.ke/dtd/tcc/check' },
      { name: 'Excise License', url: 'https://sbx.kra.go.ke/dtd/excise-license/check' }
    ]

    for (const endpoint of endpoints) {
      await testEndpoint(endpoint.url, endpoint.name)
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accessible':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accessible':
        return <Badge variant="default" className="bg-green-600">Accessible</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 KRA API Endpoint Tester</CardTitle>
          <CardDescription>
            Test connectivity to KRA API endpoints to diagnose network issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Test All Button */}
          <div className="flex gap-4">
            <Button 
              onClick={testAllEndpoints} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Test All Endpoints
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            
            {Object.keys(testResults).length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click "Test All Endpoints" to start.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(testResults).map(([name, result]) => (
                  <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-gray-500">{result.endpoint}</div>
                        {result.error && (
                          <div className="text-sm text-red-600 mt-1">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      <div className="text-xs text-gray-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Network Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Network Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>Current Domain:</strong> {window.location.hostname}</div>
              <div><strong>Protocol:</strong> {window.location.protocol}</div>
              <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Troubleshooting Tips</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• If all endpoints show errors, check your internet connection</li>
              <li>• If only some endpoints fail, the KRA API might be partially down</li>
              <li>• DNS errors suggest the domain doesn't exist or is blocked</li>
              <li>• 401 errors indicate authentication issues</li>
              <li>• 404 errors suggest the endpoint path is incorrect</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default EndpointTester
