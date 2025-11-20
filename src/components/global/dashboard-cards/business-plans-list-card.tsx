'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Building2, FileText, Users } from 'lucide-react'

const BusinessPlansListCard = () => {
  const plans = [
    { name: 'Bank loans', icon: Building2 },
    { name: 'Accounting', icon: FileText },
    { name: 'HR Management', icon: Users },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Business plans</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <plan.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{plan.name}</div>
            </div>
            {index === 0 && (
              <select className="text-sm border rounded-md px-2 py-1">
                <option>View</option>
                <option>Edit</option>
              </select>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default BusinessPlansListCard

