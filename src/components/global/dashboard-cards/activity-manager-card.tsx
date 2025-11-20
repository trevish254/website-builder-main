'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MoreVertical, Target, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ActivityManagerCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Activity manager</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Target className="w-4 h-4" />
            </Button>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>Filters</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Q Search in activities..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Team
          </Badge>
          <Badge variant="secondary" className="gap-2">
            Insights
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
          <Badge variant="secondary" className="gap-2">
            Today
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityManagerCard

