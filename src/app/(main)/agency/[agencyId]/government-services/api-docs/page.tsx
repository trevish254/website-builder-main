'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const KRADocumentation = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📚 KRA NIL Return API Documentation</CardTitle>
          <CardDescription>
            Official KRA API specification for NIL return filing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Endpoint */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              POST https://sbx.kra.go.ke/dtd/return/v1/nil
            </div>
          </div>

          {/* Request Format */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Request Body</h3>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm">{`{
  "TAXPAYERDETAILS": {
    "TaxpayerPIN": "A000000000L",
    "ObligationCode": "4",
    "Month": "04",
    "Year": "2000"
  }
}`}</pre>
            </div>
          </div>

          {/* Field Descriptions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Field Descriptions</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Field</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">TaxpayerPIN</td>
                    <td className="border border-gray-300 p-2">KRA PIN number for whom the pending return details need to be retrieved</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">ObligationCode</td>
                    <td className="border border-gray-300 p-2">Obligation unique identifier tied to a certain tax obligation</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">Month</td>
                    <td className="border border-gray-300 p-2">Month of the respective monthly return (format: MM)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-mono">Year</td>
                    <td className="border border-gray-300 p-2">Year of the respective monthly return (format: YYYY)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Obligation Codes */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Obligation Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">"4"</Badge>
                  <span>Income Tax - Company</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">"7"</Badge>
                  <span>Income Tax - PAYE</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">"9"</Badge>
                  <span>Value Added Tax (VAT)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">"6"</Badge>
                  <span>Income Tax - Withholding</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success Response */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Success Response
            </h3>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <pre className="text-sm">{`{
  "RESPONSE": {
    "ResponseCode": "82000",
    "Message": "Successfully Filled NIL Return",
    "Status": "OK",
    "AckNumber": "KRAKBU1456050925"
  }
}`}</pre>
            </div>
          </div>

          {/* Error Responses */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Error Responses
            </h3>
            <div className="space-y-4">
              
              {/* XML Syntax Error */}
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">82001</Badge>
                  <span className="font-medium">XML Syntax Error</span>
                </div>
                <pre className="text-sm">{`{
  "RESPONSE": {
    "ResponseCode": "82001",
    "Message": "XML Syntax Error",
    "Status": "NOK"
  }
}`}</pre>
              </div>

              {/* Data Validation Error */}
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">82002</Badge>
                  <span className="font-medium">Data Validation Error</span>
                </div>
                <pre className="text-sm">{`{
  "RESPONSE": {
    "ResponseCode": "82002",
    "Message": "Data Validation Error",
    "Status": "NOK"
  }
}`}</pre>
              </div>

              {/* Authentication Error */}
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">82004</Badge>
                  <span className="font-medium">Authentication Error</span>
                </div>
                <pre className="text-sm">{`{
  "RESPONSE": {
    "ResponseCode": "82004",
    "Message": "Invalid User ID or Password",
    "Status": "NOK"
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* Use Case */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              Use Case
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-blue-800">
                This API is suitable for NIL return filling when taxpayers have no taxable income 
                during a specific period but still need to file a return to maintain compliance.
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default KRADocumentation
