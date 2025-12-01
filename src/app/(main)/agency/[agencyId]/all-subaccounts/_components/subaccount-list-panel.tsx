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
  Calendar
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

  const getReportType = (subaccount: SubAccount) => {
    // This could be enhanced to show actual report types from the database
    const reportTypes = ['Form 1040-NR', 'Form 1065', 'Multiple', 'Individual']
    return reportTypes[Math.floor(Math.random() * reportTypes.length)]
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {subaccounts.length} Subaccounts
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/agency/${agencyId}/all-subaccounts/metrics`)}
            >
              📊 View Metrics
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push(`/agency/${agencyId}/all-subaccounts/create`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Subaccount
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subaccounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Subaccount List Header */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Subaccount</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <span>Report</span>
            <Filter className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Subaccount List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSubaccounts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No subaccounts found matching your search.' : 'No subaccounts available.'}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredSubaccounts.map((subaccount) => (
              <div
                key={subaccount.id}
                onClick={() => handleSubaccountSelect(subaccount.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedSubaccountId === subaccount.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : ''
                  }`}
              >
                {/* Avatar/Logo */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={subaccount.subAccountLogo}
                    alt={subaccount.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Subaccount Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {subaccount.name}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getReportType(subaccount)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {subaccounts.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {subaccounts.filter(s => s.goal > 0).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {subaccounts.filter(s => s.goal === 0).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Inactive</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubAccountListPanel
