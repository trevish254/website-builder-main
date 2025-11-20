'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const AuthTester = () => {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testAuth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/kra/nil-return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taxpayerName: 'Test User',
          pin: 'A000000000L',
          taxType: 'individual',
          period: 'October',
          year: '2025'
        })
      })

      const data = await response.json()
      setTestResult({ status: response.status, data })
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔐 Authentication Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAuth} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test NIL Return API'}
          </Button>
          
          {testResult && (
            <div className="p-4 border rounded">
              <pre className="text-sm">{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthTester
