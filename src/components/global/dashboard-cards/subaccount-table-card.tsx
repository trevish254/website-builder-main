'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreVertical, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockSubaccounts = [
  {
    id: 1,
    name: 'Apex Innovations',
    email: 'contact@apexinnovations.com',
    score: 92,
    payment: 'Paid',
    status: 'Active',
    avatarUrl: '/avatars/01.png',
  },
  {
    id: 2,
    name: 'Horizon Ventures',
    email: 'info@horizonventures.com',
    score: 78,
    payment: 'Pending',
    status: 'Active',
    avatarUrl: '/avatars/02.png',
  },
  {
    id: 3,
    name: 'Quantum Dynamics',
    email: 'support@quantumdynamics.io',
    score: 85,
    payment: 'Paid',
    status: 'Inactive',
    avatarUrl: '/avatars/03.png',
  },
  {
    id: 4,
    name: 'Stellar Solutions',
    email: 'hello@stellarsolutions.net',
    score: 64,
    payment: 'Overdue',
    status: 'Active',
    avatarUrl: '/avatars/04.png',
  },
  {
    id: 5,
    name: 'Nebula Systems',
    email: 'admin@nebulasystems.tech',
    score: 95,
    payment: 'Paid',
    status: 'Active',
    avatarUrl: '/avatars/05.png',
  },
]

type Props = {
  className?: string
}

const SubaccountTableCard = ({ className }: Props) => {
  return (
    <Card className={`flex-1 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Subaccounts List</CardTitle>
          <div className="flex items-center gap-2">
             <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 h-8 w-[150px] lg:w-[200px]"
              />
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Subaccount Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSubaccounts.map((subaccount) => (
              <TableRow key={subaccount.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={subaccount.avatarUrl} alt={subaccount.name} />
                      <AvatarFallback>{subaccount.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{subaccount.name}</span>
                  </div>
                </TableCell>
                <TableCell>{subaccount.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{subaccount.score}%</span>
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          subaccount.score >= 90
                            ? 'bg-green-500'
                            : subaccount.score >= 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${subaccount.score}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      subaccount.payment === 'Paid'
                        ? 'default'
                        : subaccount.payment === 'Pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className={
                        subaccount.payment === 'Paid'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : subaccount.payment === 'Pending'
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                    }
                  >
                    {subaccount.payment}
                  </Badge>
                </TableCell>
                 <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      subaccount.status === 'Active'
                        ? 'text-green-600 border-green-600'
                        : 'text-gray-500 border-gray-500'
                    }
                  >
                    {subaccount.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default SubaccountTableCard
