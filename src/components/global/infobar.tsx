'use client'
import { NotificationWithUser } from '@/lib/types'
import UserButton from '@/components/global/user-button'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Bell, Search, Building2, Users, ChevronRight } from 'lucide-react'
import { Role } from '@prisma/client'
import { Card } from '../ui/card'
import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ModeToggle } from './mode-toggle'
import { useSidebar } from '@/providers/sidebar-provider'
import { useRouter } from 'next/navigation'

type Props = {
  notifications: NotificationWithUser | []
  role?: Role
  className?: string
  subAccountId?: string
}

const InfoBar = ({ notifications, subAccountId, className, role }: Props) => {
  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  const [allNotifications, setAllNotifications] = useState(safeNotifications)
  const [showAll, setShowAll] = useState(true)
  const { isCollapsed } = useSidebar()
  const router = useRouter()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = React.useRef<HTMLDivElement>(null)

  // Count notifications
  const notificationCount = allNotifications?.length || 0
  const hasNotifications = notificationCount > 0

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(safeNotifications)
    } else {
      if (safeNotifications?.length !== 0) {
        setAllNotifications(
          safeNotifications?.filter((item) => item.subAccountId === subAccountId) ??
          []
        )
      }
    }
    setShowAll((prev) => !prev)
  }

  // Get searchable data from notifications
  const getSearchableData = () => {
    const items: Array<{ type: string; name: string; link: string; icon: any }> = []

    // Extract unique subaccounts from notifications
    const subaccounts = new Set<string>()
    const users = new Set<string>()

    safeNotifications.forEach((notif: any) => {
      if (notif.subAccountId) {
        subaccounts.add(notif.subAccountId)
      }
      if (notif.User?.name) {
        users.add(JSON.stringify({
          name: notif.User.name,
          email: notif.User.email,
          avatar: notif.User.avatarUrl
        }))
      }
    })

    // Add subaccounts to search
    subaccounts.forEach((id) => {
      items.push({
        type: 'Subaccount',
        name: `Subaccount ${id.slice(0, 8)}`,
        link: `/subaccount/${id}`,
        icon: Building2
      })
    })

    // Add users to search
    users.forEach((userStr) => {
      const user = JSON.parse(userStr)
      items.push({
        type: 'Team Member',
        name: user.name,
        link: '#',
        icon: Users
      })
    })

    return items
  }

  // Levenshtein distance function for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  // Calculate match score
  const calculateMatchScore = (searchTerm: string, target: string): number => {
    const searchLower = searchTerm.toLowerCase()
    const targetLower = target.toLowerCase()

    // Exact match
    if (targetLower === searchLower) return 100

    // Starts with
    if (targetLower.startsWith(searchLower)) return 80

    // Contains
    if (targetLower.includes(searchLower)) return 60

    // Character matching
    let matchedChars = 0
    let searchIndex = 0
    for (let i = 0; i < targetLower.length && searchIndex < searchLower.length; i++) {
      if (targetLower[i] === searchLower[searchIndex]) {
        matchedChars++
        searchIndex++
      }
    }
    const charMatchScore = (matchedChars / searchLower.length) * 40

    // Levenshtein distance
    const distance = levenshteinDistance(searchLower, targetLower)
    const maxLength = Math.max(searchLower.length, targetLower.length)
    const similarityScore = ((maxLength - distance) / maxLength) * 30

    return charMatchScore + similarityScore
  }

  // Filter and score search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return []

    const allData = getSearchableData()
    const scoredResults = allData
      .map(item => ({
        ...item,
        score: calculateMatchScore(searchQuery, item.name)
      }))
      .filter(item => item.score > 20)
      .sort((a, b) => b.score - a.score)

    return scoredResults
  }, [searchQuery, safeNotifications])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim()) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  // Handle result click
  const handleResultClick = (link: string) => {
    router.push(link)
    setShowResults(false)
    setSearchQuery('')
  }

  // Close search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeSearchResults = () => {
    setShowResults(false)
  }

  return (
    <>
      <div
        className={twMerge(
          'fixed z-[20] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ',
          isCollapsed ? 'md:left-[70px]' : 'md:left-[300px]',
          className
        )}
      >
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-3 py-2 font-medium">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </p>
                {searchResults.map((result, index) => {
                  const Icon = result.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result.link)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-md transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.name}</p>
                        <p className="text-xs text-muted-foreground">{result.type}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {showResults && searchQuery.trim() && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg p-4 z-50">
              <p className="text-sm text-muted-foreground text-center">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Icons on the far right */}
        <div className="flex items-center gap-3">
          {/* Messages */}
          <button className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          {/* Tasks */}
          <button className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M9 11l3 3L22 4"></path>
            </svg>
          </button>

          {/* Calendar */}
          <button className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>

          {/* Account */}
          <UserButton />

          {/* Notifications */}
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white relative">
                <Bell size={17} />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  You have {notificationCount} notification{notificationCount !== 1 ? 's' : ''}
                </SheetDescription>
                {(role === 'AGENCY_ADMIN' || role === 'AGENCY_OWNER') && subAccountId && (
                  <Card className="flex items-center justify-between p-4 mt-4">
                    <span className="text-sm font-medium">Show only current subaccount</span>
                    <Switch checked={!showAll} onCheckedChange={handleClick} />
                  </Card>
                )}
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {allNotifications?.map((notification) => {
                  // Safely handle notification data
                  const user = notification?.User
                  const userName = user?.name || 'User'
                  const userAvatar = user?.avatarUrl
                  const notificationText = notification?.notification || ''
                  const createdAt = notification?.createdAt ? new Date(notification.createdAt) : new Date()

                  return (
                    <div
                      key={notification?.id || Math.random()}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={userAvatar}
                          alt="Profile Picture"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm leading-relaxed break-words">
                          {notificationText.split('|').map((part, index) => {
                            if (index === 0 || index === 2) {
                              return (
                                <span key={index} className="font-semibold">
                                  {part}
                                </span>
                              )
                            }
                            return (
                              <span key={index} className="text-muted-foreground">
                                {part}
                              </span>
                            )
                          })}
                        </p>
                        <small className="text-xs text-muted-foreground mt-1">
                          {createdAt.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  )
                })}
              </div>
              {allNotifications?.length === 0 && (
                <div className="flex items-center justify-center text-muted-foreground py-8">
                  You have no notifications
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </>
  )
}

export default InfoBar
