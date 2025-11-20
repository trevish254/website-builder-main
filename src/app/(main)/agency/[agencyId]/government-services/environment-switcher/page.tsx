'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AlertCircle, CheckCircle, Zap, Shield } from 'lucide-react'

const EnvironmentSwitcher = () => {
  const [currentEnv, setCurrentEnv] = useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX')
  const [isSwitching, setIsSwitching] = useState(false)

  const handleEnvironmentSwitch = async (newEnv: 'SANDBOX' | 'PRODUCTION') => {
    setIsSwitching(true)
    
    // Simulate environment switch
    setTimeout(() => {
      setCurrentEnv(newEnv)
      setIsSwitching(false)
      
      // Show success message
      console.log(`✅ Switched to ${newEnv} environment`)
    }, 1000)
  }

  const environments = {
    SANDBOX: {
      name: 'Sandbox',
      description: 'Testing environment with mock data',
      color: 'bg-yellow-50 border-yellow-200',
      icon: <Shield className="h-5 w-5 text-yellow-600" />,
      status: 'Testing',
      endpoints: [
        'https://sbx.kra.go.ke/dtd/return/v1/nil',
        'https://sbx.kra.go.ke/dtd/pin/verify'
      ]
    },
    PRODUCTION: {
      name: 'Production',
      description: 'Live KRA API - Real taxpayer data',
      color: 'bg-green-50 border-green-200',
      icon: <Zap className="h-5 w-5 text-green-600" />,
      status: 'Live',
      endpoints: [
        'https://api.kra.go.ke/dtd/return/v1/nil',
        'https://api.kra.go.ke/dtd/pin/verify'
      ],
      appId: '593e6bdf-2300-430e-b855-8ae14358db0e'
    }
  }

  const currentEnvData = environments[currentEnv]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔄 Environment Switcher
            <Badge variant={currentEnv === 'PRODUCTION' ? 'default' : 'secondary'}>
              {currentEnvData.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Switch between Sandbox (testing) and Production (live) environments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Environment Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {currentEnvData.icon}
              <div>
                <div className="font-medium">{currentEnvData.name}</div>
                <div className="text-sm text-gray-500">{currentEnvData.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Sandbox</span>
              <Switch
                checked={currentEnv === 'PRODUCTION'}
                onCheckedChange={(checked) => {
                  const newEnv = checked ? 'PRODUCTION' : 'SANDBOX'
                  handleEnvironmentSwitch(newEnv)
                }}
                disabled={isSwitching}
              />
              <span className="text-sm font-medium">Production</span>
            </div>
          </div>

          {/* Current Environment Details */}
          <div className={`p-4 border rounded-lg ${currentEnvData.color}`}>
            <div className="flex items-center gap-2 mb-3">
              {currentEnvData.icon}
              <h3 className="font-medium">{currentEnvData.name} Environment</h3>
              <Badge variant={currentEnv === 'PRODUCTION' ? 'default' : 'secondary'}>
                {currentEnvData.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Endpoints:</strong>
              </div>
              {currentEnvData.endpoints.map((endpoint, index) => (
                <div key={index} className="text-sm font-mono bg-white/50 p-2 rounded">
                  {endpoint}
                </div>
              ))}
              
              {currentEnvData.appId && (
                <div className="text-sm">
                  <strong>Apigee App ID:</strong>
                  <div className="font-mono bg-white/50 p-2 rounded mt-1">
                    {currentEnvData.appId}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Environment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Sandbox</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Safe testing environment</div>
                <div>• Mock taxpayer data</div>
                <div>• No real transactions</div>
                <div>• Perfect for development</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="font-medium">Production</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Live KRA API</div>
                <div>• Real taxpayer data</div>
                <div>• Actual transactions</div>
                <div>• Ready for business</div>
              </div>
            </div>
          </div>

          {/* Warning for Production */}
          {currentEnv === 'PRODUCTION' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-800">Production Environment Active</span>
              </div>
              <div className="text-sm text-red-700">
                ⚠️ You are now connected to the live KRA API. All transactions will be real and affect actual taxpayer records.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={() => handleEnvironmentSwitch('SANDBOX')}
              disabled={isSwitching || currentEnv === 'SANDBOX'}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Switch to Sandbox
            </Button>
            
            <Button 
              onClick={() => handleEnvironmentSwitch('PRODUCTION')}
              disabled={isSwitching || currentEnv === 'PRODUCTION'}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Switch to Production
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default EnvironmentSwitcher
