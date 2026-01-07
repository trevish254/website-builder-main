'use client'

import { useState } from 'react'
import { SubAccount } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  Building2,
  Users,
  FileText,
  Calendar,
  MoreVertical,
  BarChart2,
  LayoutGrid,
  ListFilter
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import GradientButton from '@/components/ui/button-1'

type Props = {
  subaccounts: SubAccount[]
  agencyId: string
  selectedSubaccountId?: string
}

const SubAccountListPanel = ({ subaccounts, agencyId, selectedSubaccountId }: Props) => {
  console.log('🎯 SubAccountListPanel rendered!')
  console.log('📋 Subaccounts:', subaccounts.length)
  console.log('📋 Selected Subaccount ID:', selectedSubaccountId)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const router = useRouter()

  const filteredSubaccounts = subaccounts.filter(subaccount => {
    const matchesSearch = subaccount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subaccount.address.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === 'all') return matchesSearch
    if (filterType === 'active') return matchesSearch && subaccount.goal > 0
    if (filterType === 'inactive') return matchesSearch && subaccount.goal === 0

    return matchesSearch
  })

  const handleSubaccountSelect = (subaccountId: string) => {
    console.log('🔘 Subaccount clicked:', subaccountId)
    console.log('🔘 Navigating to:', `/agency/${agencyId}/all-subaccounts?subaccountId=${subaccountId}`)
    router.push(`/agency/${agencyId}/all-subaccounts?subaccountId=${subaccountId}`)
  }

  const getSubAccountType = (subaccount: SubAccount) => {
    const types = ['Agency Individual', 'Team', 'Organization']
    // Stable random based on ID so it doesn't flip on every render
    const charCodeSum = subaccount.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return types[charCodeSum % types.length]
  }

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              Subaccounts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and monitor your {subaccounts.length} subaccounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShimmerButton
              borderRadius="12px"
              className="h-11 px-8 text-sm font-semibold"
              onClick={() => router.push(`/agency/${agencyId}/all-subaccounts/create`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Subaccount
            </ShimmerButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <GradientButton
                    width="100%"
                    height="40px"
                    onClick={() => router.push(`/agency/${agencyId}/all-subaccounts/metrics`)}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span className="text-[10px]">View Metrics</span>
                    </div>
                  </GradientButton>
                </div>
                <DropdownMenuItem className="mt-1">
                  <ListFilter className="mr-2 h-4 w-4" />
                  <span>Export List</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gray-100/50 dark:bg-gray-800/50 border-none focus-visible:ring-1 focus-visible:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-md px-3 h-10">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 cursor-pointer focus:ring-0"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* List Section Header */}
      <div className="px-6 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          <LayoutGrid className="h-3 w-3" />
          <span>Subaccount Details</span>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Type
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {filteredSubaccounts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {searchQuery ? 'No matches found' : 'No subaccounts yet'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSubaccounts.map((subaccount) => (
              <div
                key={subaccount.id}
                onClick={() => handleSubaccountSelect(subaccount.id)}
                className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:shadow-md ${selectedSubaccountId === subaccount.id
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-900 shadow-sm'
                  : 'hover:bg-white dark:hover:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-700'
                  }`}
              >
                {/* Avatar/Logo */}
                <div className="relative w-12 h-12 flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm rounded-full overflow-hidden">
                  <Image
                    src={subaccount.subAccountLogo}
                    alt={subaccount.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Subaccount Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`text-[14px] font-semibold truncate ${selectedSubaccountId === subaccount.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                      {subaccount.name}
                    </h3>
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${selectedSubaccountId === subaccount.id ? 'text-blue-500 translate-x-1' : 'text-gray-300 group-hover:translate-x-1'
                      }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {subaccount.address.split(',')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Badge variant="secondary" className="text-[10px] py-0 h-5 px-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-none font-medium">
                    {getSubAccountType(subaccount)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center group cursor-default">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
              {subaccounts.length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
              Total
            </div>
          </div>
          <div className="flex flex-col items-center group cursor-default border-x border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
              {subaccounts.filter(s => s.goal > 0).length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
              Active
            </div>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">
              {subaccounts.filter(s => s.goal === 0).length}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-1">
              Inactive
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubAccountListPanel
