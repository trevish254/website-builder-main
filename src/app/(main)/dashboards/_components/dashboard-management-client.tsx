'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    LayoutGrid,
    List,
    Plus,
    Search,
    Star,
    Lock,
    Users,
    MoreVertical,
    Trash2,
    Share2,
    Edit,
    Copy,
    CheckCircle2,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { toggleFavoriteDashboard, setDefaultDashboard, deleteDashboard } from '@/lib/dashboard-queries'
import { toast } from 'sonner'
import AddDashboardModal from './add-dashboard-modal'

type Dashboard = {
    id: string
    userId: string
    name: string
    description: string | null
    isDefault: boolean
    isPrivate: boolean
    isFavorite: boolean
    lastAccessedAt: string
    createdAt: string
    updatedAt: string
    DashboardCard?: any[]
}

type Props = {
    dashboards: Dashboard[]
    userId: string
    initialFilter: string
    initialView: 'grid' | 'list'
}

export default function DashboardManagementClient({
    dashboards: initialDashboards,
    userId,
    initialFilter,
    initialView,
}: Props) {
    const router = useRouter()
    const [dashboards, setDashboards] = useState(initialDashboards)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState(initialFilter)
    const [view, setView] = useState<'grid' | 'list'>(initialView)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.get('openAdd') === 'true') {
            setIsAddModalOpen(true)
            // Optional: clean up the URL after opening
            const params = new URLSearchParams(searchParams.toString())
            params.delete('openAdd')
            const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
            window.history.replaceState({}, '', newUrl)
        }
    }, [searchParams])

    const filteredDashboards = dashboards.filter((dashboard) =>
        dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleToggleFavorite = async (dashboardId: string) => {
        const result = await toggleFavoriteDashboard(dashboardId)
        if (result) {
            setDashboards((prev) =>
                prev.map((d) =>
                    d.id === dashboardId ? { ...d, isFavorite: result.isFavorite } : d
                )
            )
            toast.success(result.isFavorite ? 'Added to favorites' : 'Removed from favorites')
        }
    }

    const handleSetDefault = async (dashboardId: string) => {
        const result = await setDefaultDashboard(userId, dashboardId)
        if (result) {
            setDashboards((prev) =>
                prev.map((d) => ({
                    ...d,
                    isDefault: d.id === dashboardId,
                }))
            )
            toast.success('Default dashboard updated')
        }
    }

    const handleDelete = async (dashboardId: string, dashboardName: string) => {
        if (!confirm(`Are you sure you want to delete "${dashboardName}"?`)) return

        const result = await deleteDashboard(dashboardId)
        if (result.success) {
            setDashboards((prev) => prev.filter((d) => d.id !== dashboardId))
            toast.success('Dashboard deleted')
        } else {
            toast.error(result.error || 'Failed to delete dashboard')
        }
    }

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter)
        router.push(`/dashboards?filter=${newFilter}&view=${view}`)
    }

    const handleViewChange = (newView: 'grid' | 'list') => {
        setView(newView)
        router.push(`/dashboards?filter=${filter}&view=${newView}`)
    }

    return (
        <div className="h-full p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Dashboards</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and customize your dashboards
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Dashboard
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center justify-between mb-6">
                <Tabs value={filter} onValueChange={handleFilterChange}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="my">My Dashboards</TabsTrigger>
                        <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
                        <TabsTrigger value="private">Private</TabsTrigger>
                        <TabsTrigger value="favorites">
                            <Star className="w-4 h-4 mr-1" />
                            Favorites
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search dashboards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 border rounded-md p-1">
                        <Button
                            variant={view === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => handleViewChange('grid')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => handleViewChange('list')}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dashboards Grid/List */}
            {filteredDashboards.length === 0 ? (
                <Card className="p-12 text-center">
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-2">No dashboards found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Get started by creating your first dashboard'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Dashboard
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDashboards.map((dashboard) => (
                        <Card
                            key={dashboard.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer group"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                                            {dashboard.isDefault && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {dashboard.description || 'No description'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleFavorite(dashboard.id)
                                            }}
                                        >
                                            <Star
                                                className={`w-4 h-4 ${dashboard.isFavorite
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground'
                                                    }`}
                                            />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/dashboards/${dashboard.id}`)}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Open
                                                </DropdownMenuItem>
                                                {!dashboard.isDefault && (
                                                    <DropdownMenuItem onClick={() => handleSetDefault(dashboard.id)}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Set as Default
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    Share
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {!dashboard.isDefault && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(dashboard.id, dashboard.name)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent onClick={() => router.push(`/dashboards/${dashboard.id}`)}>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        {dashboard.isPrivate ? (
                                            <Lock className="w-4 h-4" />
                                        ) : (
                                            <Users className="w-4 h-4" />
                                        )}
                                        <span>{dashboard.isPrivate ? 'Private' : 'Shared'}</span>
                                    </div>
                                    <div>
                                        {dashboard.DashboardCard?.length || 0} cards
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="text-xs text-muted-foreground">
                                Last accessed{' '}
                                {formatDistanceToNow(new Date(dashboard.lastAccessedAt), {
                                    addSuffix: true,
                                })}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredDashboards.map((dashboard) => (
                        <Card
                            key={dashboard.id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/dashboards/${dashboard.id}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{dashboard.name}</h3>
                                                {dashboard.isDefault && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Default
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    {dashboard.isPrivate ? (
                                                        <>
                                                            <Lock className="w-3 h-3 mr-1" />
                                                            Private
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Users className="w-3 h-3 mr-1" />
                                                            Shared
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {dashboard.description || 'No description'} •{' '}
                                                {dashboard.DashboardCard?.length || 0} cards • Last accessed{' '}
                                                {formatDistanceToNow(new Date(dashboard.lastAccessedAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleFavorite(dashboard.id)
                                            }}
                                        >
                                            <Star
                                                className={`w-4 h-4 ${dashboard.isFavorite
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground'
                                                    }`}
                                            />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/dashboards/${dashboard.id}`)}
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Open
                                                </DropdownMenuItem>
                                                {!dashboard.isDefault && (
                                                    <DropdownMenuItem onClick={() => handleSetDefault(dashboard.id)}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Set as Default
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    Share
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {!dashboard.isDefault && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(dashboard.id, dashboard.name)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Dashboard Modal */}
            <AddDashboardModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                userId={userId}
                onSuccess={(newDashboard) => {
                    setDashboards((prev) => [newDashboard, ...prev])
                    setIsAddModalOpen(false)
                    router.push(`/dashboards/${newDashboard.id}`)
                }}
            />
        </div>
    )
}
