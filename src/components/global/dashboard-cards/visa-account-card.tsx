'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit } from 'lucide-react'
import Image from 'next/image'

const VisaAccountCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* M-PESA Logo - Replace with actual logo image when provided */}
            <div className="relative w-20 h-10">
              <Image
                src="/mpesa-logo.png"
                alt="M-PESA"
                fill
                className="object-contain"
                onError={(e) => {
                  // Fallback to styled text if image not found
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.parentElement?.querySelector('.mpesa-fallback')
                  if (fallback) {
                    ;(fallback as HTMLElement).style.display = 'flex'
                  }
                }}
              />
              {/* Fallback M-PESA logo styled text */}
              <div className="mpesa-fallback hidden absolute inset-0 bg-black rounded items-center justify-center">
                <span className="text-green-500 font-bold text-sm">M-PESA</span>
              </div>
            </div>
            <CardTitle className="text-lg">Direct Debits</CardTitle>
          </div>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Linked to main account ****2829
        </div>
        
        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phone-number">Phone Number</Label>
          <Input
            id="phone-number"
            type="tel"
            placeholder="07XX XXX XXX"
            className="w-full"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (KES)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            className="w-full"
            step="0.01"
            min="0"
          />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">Receive</Button>
          <Button variant="outline" className="flex-1">
            Send
          </Button>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold">KES 50.00</div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit cards limitation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VisaAccountCard

