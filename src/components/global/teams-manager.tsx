'use client'
import React, { useState } from 'react'
import { format } from 'date-fns'
import {
    Plus,
    Users,
    MessageSquare,
    UserPlus,
    Trash,
    Shield,
    MoreVertical,
    Check,
    ListTodo,
    Flag,
    Clock
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useModal } from '@/providers/modal-provider'
import CustomModal from './custom-modal'
import TeamDetails from '../forms/team-details'
import { addTeamMember, removeTeamMember, deleteAgencyTeam, createTeamChat, toggleTeamLeader } from '@/lib/queries'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TeamsManagerProps {
    agencyId: string
    teams: any[]
    allUsers: any[]
    onUpdate?: () => void
}

const TeamsManager: React.FC<TeamsManagerProps> = ({
    agencyId,
    teams,
    allUsers,
    onUpdate,
}) => {
    const { setOpen } = useModal()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleCreateTeam = () => {
        setOpen(
            <CustomModal
                title="Create a Team"
                subheading="Groups help you organize your team members and assign tasks collectively."
            >
                <TeamDetails
                    agencyId={agencyId}
                    onUpdate={onUpdate}
                />
            </CustomModal>
        )
    }

    const handleEditTeam = (team: any) => {
        setOpen(
            <CustomModal
                title="Edit Team Details"
                subheading="Update your team information."
            >
                <TeamDetails
                    agencyId={agencyId}
                    defaultData={team}
                    onUpdate={onUpdate}
                />
            </CustomModal>
        )
    }

    const handleAddMember = async (teamId: string, userId: string) => {
        setLoading(true)
        const response = await addTeamMember(teamId, userId)
        if (response) {
            toast({
                title: 'Success',
                description: 'Member added to team',
            })
            if (onUpdate) onUpdate()
            router.refresh()
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not add member',
            })
        }
        setLoading(false)
    }

    const handleRemoveMember = async (teamId: string, userId: string) => {
        setLoading(true)
        const response = await removeTeamMember(teamId, userId)
        if (response) {
            toast({
                title: 'Success',
                description: 'Member removed from team',
            })
            if (onUpdate) onUpdate()
            router.refresh()
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not remove member',
            })
        }
        setLoading(false)
    }

    const handleToggleLeader = async (teamId: string, userId: string, isLeader: boolean) => {
        setLoading(true)
        const response = await toggleTeamLeader(teamId, userId, isLeader)
        if (response) {
            toast({
                title: 'Success',
                description: isLeader ? 'Member designated as leader' : 'Leader status removed',
            })
            if (onUpdate) onUpdate()
            router.refresh()
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update leader status',
            })
        }
        setLoading(false)
    }

    const handleDeleteTeam = async (teamId: string) => {
        if (!confirm('Are you sure you want to delete this team?')) return
        setLoading(true)
        const response = await deleteAgencyTeam(teamId)
        if (response) {
            toast({
                title: 'Success',
                description: 'Team deleted',
            })
            if (onUpdate) onUpdate()
            router.refresh()
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not delete team',
            })
        }
        setLoading(false)
    }

    const handleCreateChat = async (team: any) => {
        setLoading(true)
        const userIds = team.AgencyTeamMember.map((m: any) => m.userId)
        if (userIds.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Team has no members to create a chat',
            })
            setLoading(false)
            return
        }
        const response = await createTeamChat(team.id, team.name, userIds, agencyId)
        if (response) {
            toast({
                title: 'Success',
                description: 'Team chat group created',
            })
            router.push(`/agency/${agencyId}/messages?conversationId=${response.id}`)
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not create team chat',
            })
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Teams</h2>
                    <p className="text-muted-foreground text-sm">
                        Manage your internal agency teams and departments.
                    </p>
                </div>
                <Button onClick={handleCreateTeam}>
                    <Plus className="mr-2 h-4 w-4" /> Create Team
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-neutral-50 dark:bg-neutral-900/20">
                        <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="font-bold text-lg">No teams created yet</h3>
                        <p className="text-muted-foreground mb-6">Start by creating your first team.</p>
                        <Button variant="outline" onClick={handleCreateTeam}>
                            Create your first team
                        </Button>
                    </div>
                )}

                {teams.map((team) => (
                    <Card key={team.id} className="overflow-hidden border-none shadow-premium relative group">
                        <div
                            className="absolute top-0 left-0 w-full h-1"
                            style={{ backgroundColor: team.color || '#3b82f6' }}
                        />
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{team.name}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {team.description || 'No description provided.'}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCreateChat(team)}>
                                        Create Group Chat
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDeleteTeam(team.id)}
                                    >
                                        Delete Team
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {team.AgencyTeamMember?.slice(0, 5).map((member: any) => (
                                        <Avatar key={member.id} className="border-2 border-background w-8 h-8">
                                            <AvatarImage src={member.User.avatarUrl} />
                                            <AvatarFallback>{member.User.name[0]}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {team.AgencyTeamMember?.length > 5 && (
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-background">
                                            +{team.AgencyTeamMember.length - 5}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {team.AgencyTeamMember?.length || 0} Members
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 rounded-xl gap-1.5 border-dashed">
                                            <UserPlus className="h-3.5 w-3.5" />
                                            Add Member
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[200px]" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search member..." />
                                            <CommandEmpty>No member found.</CommandEmpty>
                                            <CommandGroup>
                                                {allUsers
                                                    .filter(u => !team.AgencyTeamMember.some((m: any) => m.userId === u.id))
                                                    .map((user) => (
                                                        <CommandItem
                                                            key={user.id}
                                                            onSelect={() => handleAddMember(team.id, user.id)}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <Avatar className="w-6 h-6">
                                                                <AvatarImage src={user.avatarUrl} />
                                                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="truncate">{user.name}</span>
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-xl gap-1.5"
                                    onClick={() => handleCreateChat(team)}
                                >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Team Chat
                                </Button>
                            </div>

                            <div className="pt-2 border-t text-[11px] uppercase tracking-wider font-bold text-muted-foreground/60 flex items-center justify-between">
                                <span>Assigned Tasks</span>
                                {team.Task?.length > 0 && (
                                    <span className="text-primary font-mono">{team.Task.length}</span>
                                )}
                            </div>

                            <div className="space-y-3">
                                {team.Task?.length > 0 ? (
                                    <>
                                        {team.Task?.slice(0, 3).map((task: any) => (
                                            <div key={task.id} className="flex flex-col gap-1.5 group/task p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors border border-transparent hover:border-border/50">
                                                <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                    <span className="text-sm truncate font-semibold">{task.title}</span>
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            "h-4 px-1.5 text-[9px] border-none font-black flex items-center gap-1 shrink-0",
                                                            task.priority === 'High' ? "bg-red-500/10 text-red-500" :
                                                                task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                                                                    task.priority === 'Urgent' ? "bg-rose-600/10 text-rose-600" :
                                                                        "bg-blue-500/10 text-blue-500"
                                                        )}
                                                    >
                                                        <Flag className="h-2 w-2" />
                                                        {task.priority?.toUpperCase() || 'NORMAL'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-md">
                                                        <ListTodo className="h-2.5 w-2.5" />
                                                        <span>{task.TaskLane?.name || 'In Progress'}</span>
                                                    </div>
                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <Clock className="h-2.5 w-2.5" />
                                                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {team.Task?.length > 3 && (
                                            <Button variant="link" className="px-0 h-auto text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                                <span>View all {team.Task.length} tasks</span>
                                                <Plus className="h-2.5 w-2.5" />
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-4 bg-muted/20 rounded-2xl border border-dashed">
                                        <ListTodo className="h-5 w-5 text-muted-foreground/20 mb-1" />
                                        <p className="text-[10px] text-muted-foreground italic">No tasks assigned</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default TeamsManager
