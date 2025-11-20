'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Copy, 
  Download, 
  ArrowLeft,
  CheckCircle,
  DollarSign,
  User,
  Building,
  Calendar,
  Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  params: { agencyId: string }
}

const PRNGenerationPage = ({ params }: Props) => {
  const router = useRouter()
  const [selectedTaxType, setSelectedTaxType] = useState('')
  const [formData, setFormData] = useState({
    clientName: '',
    clientPIN: '',
    amount: '',
    description: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPRN, setGeneratedPRN] = useState<any>(null)

  const taxTypes = [
    {
      id: 'vat',
      name: 'VAT Withholding',
      description: 'Value Added Tax withholding',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'income',
      name: 'Income Tax Withholding',
      description: 'Personal income tax withholding',
      icon: <User className="h-5 w-5" />,
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'rental',
      name: 'Rental Withholding',
      description: 'Rental income tax withholding',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ]

  const handleGeneratePRN = async () => {
    if (!selectedTaxType || !formData.clientName || !formData.amount) {
      return
    }

    setIsGenerating(true)
    
    // Simulate API call
    setTimeout(() => {
      const prnNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
      setGeneratedPRN({
        prn: prnNumber,
        taxType: taxTypes.find(t => t.id === selectedTaxType)?.name,
        clientName: formData.clientName,
        amount: formData.amount,
        generatedAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopyPRN = () => {
    navigator.clipboard.writeText(generatedPRN.prn)
  }

  const handleMarkAsPaid = () => {
    console.log('Marking PRN as paid:', generatedPRN.prn)
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
            <Zap className="h-8 w-8 text-purple-600" />
            Generate Payment PRN
          </h1>
          <p className="text-muted-foreground">
            Create payment reference numbers for withholding taxes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Create Payment Reference
            </CardTitle>
            <CardDescription>
              Generate a PRN for withholding tax payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tax Type Selection */}
            <div className="space-y-3">
              <Label>What type of tax are you paying?</Label>
              <div className="grid grid-cols-1 gap-3">
                {taxTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTaxType === type.id
                        ? `${type.color} border-2`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTaxType(type.id)}
                  >
                    <div className="flex items-center gap-3">
                      {type.icon}
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPIN">Client KRA PIN (Optional)</Label>
                <Input
                  id="clientPIN"
                  value={formData.clientPIN}
                  onChange={(e) => setFormData({...formData, clientPIN: e.target.value})}
                  placeholder="Enter KRA PIN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Payment description"
                />
              </div>
            </div>

            <Button
              onClick={handleGeneratePRN}
              disabled={!selectedTaxType || !formData.clientName || !formData.amount || isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PRN...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Generate PRN
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Sidebar */}
        <div className="space-y-6">
          {/* Generated PRN */}
          {generatedPRN && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  PRN Generated Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {generatedPRN.prn}
                    </div>
                    <div className="text-sm text-gray-600">Payment Reference Number</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Type:</span>
                    <span className="font-medium">{generatedPRN.taxType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium">{generatedPRN.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">KES {generatedPRN.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Generated:</span>
                    <span className="font-medium">
                      {new Date(generatedPRN.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className="font-medium">
                      {new Date(generatedPRN.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleCopyPRN}
                    className="w-full"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy PRN
                  </Button>
                  <Button 
                    onClick={handleMarkAsPaid}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">💡 Next Steps</h4>
                  <p className="text-blue-700 text-sm">
                    Use this PRN on iTax or at your bank to complete the payment. 
                    The PRN is valid for 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>1. Select Tax Type</strong>
                <p className="text-gray-600 mt-1">
                  Choose the type of withholding tax you&apos;re paying.
                </p>
              </div>
              <div className="text-sm">
                <strong>2. Enter Details</strong>
                <p className="text-gray-600 mt-1">
                  Provide client information and payment amount.
                </p>
              </div>
              <div className="text-sm">
                <strong>3. Generate PRN</strong>
                <p className="text-gray-600 mt-1">
                  Get a unique payment reference number for KRA.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent PRNs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent PRNs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { prn: 'ABC123456', client: 'John Kamau', amount: '15,000', status: 'Paid', time: '2 hours ago' },
                  { prn: 'DEF789012', client: 'ABC Company', amount: '25,000', status: 'Pending', time: '1 day ago' },
                  { prn: 'GHI345678', client: 'Mary Wanjiku', amount: '8,500', status: 'Paid', time: '3 days ago' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{item.prn}</div>
                      <div className="text-xs text-gray-500">{item.client} • KES {item.amount}</div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={item.status === 'Paid' ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'}
                      >
                        {item.status}
                      </Badge>
                      <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                    </div>
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

export default PRNGenerationPage
