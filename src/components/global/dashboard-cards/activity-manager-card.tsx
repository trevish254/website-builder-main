'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MoreVertical, Target, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const mockActivities = [
  {
    id: 1,
    user: {
      name: 'Wanjiku Kimani',
      avatarUrl: '/avatars/01.png',
    },
    action: 'commented on',
    target: 'Homepage Redesign - V2',
    time: '2 min ago',
  },
  {
    id: 2,
    user: {
      name: 'Otieno Ochieng',
      avatarUrl: '/avatars/02.png',
    },
    action: 'uploaded a file to',
    target: 'Marketing Assets / Q3 Campaign',
    time: '15 min ago',
  },
  {
    id: 3,
    user: {
      name: 'Achieng Odhiambo',
      avatarUrl: '/avatars/03.png',
    },
    action: 'completed task',
    target: 'Update User Flow Diagram',
    time: '1 hour ago',
  },
  {
    id: 4,
    user: {
      name: 'Kamau Njoroge',
      avatarUrl: '/avatars/04.png',
    },
    action: 'created a new project',
    target: 'Mobile App Launch',
    time: '3 hours ago',
  },
  {
    id: 5,
    user: {
      name: 'Njeri Mwangi',
      avatarUrl: '/avatars/05.png',
    },
    action: 'assigned a task to',
    target: 'Backend API Integration',
    time: '4 hours ago',
  },
  {
    id: 6,
    user: {
      name: 'Juma Owino',
      avatarUrl: '/avatars/06.png',
    },
    action: 'updated status of',
    target: 'Client Onboarding Flow',
    time: '5 hours ago',
  },
  {
    id: 7,
    user: {
      name: 'Wangari Maathai',
      avatarUrl: '/avatars/07.png',
    },
    action: 'added a comment to',
    target: 'Environmental Impact Report',
    time: '6 hours ago',
  },
  {
    id: 8,
    user: {
      name: 'Kipchoge Keino',
      avatarUrl: '/avatars/08.png',
    },
    action: 'reviewed code in',
    target: 'Performance Optimization',
    time: '7 hours ago',
  },
  {
    id: 9,
    user: {
      name: 'Lupita Nyong\'o',
      avatarUrl: '/avatars/09.png',
    },
    action: 'created a new design for',
    target: 'Landing Page Hero Section',
    time: '8 hours ago',
  },
  {
    id: 10,
    user: {
      name: 'Ngugi wa Thiong\'o',
      avatarUrl: '/avatars/10.png',
    },
    action: 'published a new article',
    target: 'Content Strategy Blog',
    time: '9 hours ago',
  },
  {
    id: 11,
    user: {
      name: 'Adhiambo Omondi',
      avatarUrl: '/avatars/11.png',
    },
    action: 'merged pull request',
    target: 'Feature/Authentication',
    time: '10 hours ago',
  },
  {
    id: 12,
    user: {
      name: 'Maina Kageni',
      avatarUrl: '/avatars/12.png',
    },
    action: 'scheduled a meeting for',
    target: 'Weekly Sync',
    time: '11 hours ago',
  },
]

type Props = {
  className?: string
}

const ActivityManagerCard = ({ className }: Props) => {
  return (
    <Card className={`flex-1 ${className}`}>
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
        <div className="space-y-4 mt-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.target}
                </p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityManagerCard

