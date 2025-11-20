'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun } from 'lucide-react'

const BusinessPlansActionCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-lg">Business plans</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Enable 2-step verification to secure your wallet.
        </p>
        <Button className="w-full">Enable</Button>
      </CardContent>
    </Card>
  )
}

export default BusinessPlansActionCard

