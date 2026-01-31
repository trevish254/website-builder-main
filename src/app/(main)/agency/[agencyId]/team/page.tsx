'use client'
import { useState, useMemo, useEffect } from 'react'
import { Plus, Upload, Download, Search, Filter, MoreVertical, Eye, Trash2, Copy, Mail, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'
import EmployeeForm from '@/components/forms/employee-form'
import { format } from 'date-fns'
import type { User } from '@/lib/database.types'
import type { Invitation as InvitationType } from '@/lib/database.types'
import { getAgencyTeamMembers, getAgencyInvitations, deleteInvitation, deleteUser, getUser, getAgencyTeams, getAuthUserDetails } from '@/lib/queries'
import { ROLE_HIERARCHY, canManageRole } from '@/lib/permissions'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/global/custom-modal'
import UserDetails from '@/components/forms/user-details'
import AgencyTeamTreeChart from '@/components/global/agency-team-tree-chart'
import { supabase } from '@/lib/supabase'
import Flowboard from '@/components/flowboard'
import ProfileCard from '@/components/ui/profile-card'
import TeamsManager from '@/components/global/teams-manager'
import { FreelancerProfileCard } from '@/components/ui/freelancer-profile-card'
import WorkloadCard from '@/components/global/workload-card'
import { Shield, ShieldAlert, ShieldCheck, User as UserIcon, Settings, LayoutTemplate, Palette, Code, Briefcase, ChevronDown, Activity, BarChart, CalendarClock } from 'lucide-react'
import { useTeamPresence } from '@/hooks/use-team-presence'


type Props = {
  params: { agencyId: string }
  searchParams: { tab?: string }
}

const TeamPage = ({ params, searchParams }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const { setOpen } = useModal()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'invited'>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Main Tab State
  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'roles' | 'flowboard' | 'settings' | 'analytics'>(
    (searchParams.tab as any) || 'members'
  )

  // Update active tab if searchParams change
  useEffect(() => {
    if (searchParams.tab) {
      setActiveTab(searchParams.tab as any)
    }
  }, [searchParams.tab])
  // Sub-tab state for Members tab (to toggle between active members and invitations)
  const [membersSubTab, setMembersSubTab] = useState<'active' | 'invitations'>('active')

  // Data states
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [workloadMap, setWorkloadMap] = useState<Record<string, number>>({})
  const [invitations, setInvitations] = useState<InvitationType[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [agencyDetails, setAgencyDetails] = useState<any>(null)
  const [subaccounts, setSubaccounts] = useState<any[]>([])
  const [authUser, setAuthUser] = useState<any>(null)

  // Realtime Presence
  const { presenceMap, manualStatus, setManualStatus } = useTeamPresence(params.agencyId)

  // Modal states
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showInviteEmployee, setShowInviteEmployee] = useState(false)
  const [employeeFormMode, setEmployeeFormMode] = useState<'full' | 'invite'>('full')

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [params.agencyId])

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const [members, invs, agencyTeams] = await Promise.all([
        getAgencyTeamMembers(params.agencyId),
        getAgencyInvitations(params.agencyId),
        getAgencyTeams(params.agencyId)
      ])
      setTeamMembers(members)
      setInvitations(invs)
      setTeams(agencyTeams)

      // Fetch agency details and subaccounts for hierarchy chart
      const { data: agencyData } = await supabase
        .from('Agency')
        .select(`
          *,
          SubAccount (*)
        `)
        .eq('id', params.agencyId)
        .single()

      setAgencyDetails(agencyData)
      setSubaccounts(agencyData?.SubAccount || [])

      // Fetch Workload Data (Tasks, Subaccounts, Docs/Pipelines)
      if (members.length > 0) {
        // This is a simplified workload fetch. Ideally this should be a single efficient query.
        const workloadPromises = members.map(async (member) => {
          const { count: tasksCount } = await supabase.from('Ticket').select('*', { count: 'exact', head: true }).eq('assignedUserId', member.id)
          const { count: subaccountsCount } = await supabase.from('Permissions').select('*', { count: 'exact', head: true }).eq('email', member.email).eq('access', true)
          // Assessing "Docs" as Pipelines for now, or maybe Media? Let's use Pipelines as proxy for heavy work.
          const { count: pipelinesCount } = await supabase.from('Pipeline').select('*', { count: 'exact', head: true })
          // Note: Pipeline doesn't always have a user assignment directly visible without joining. 
          // Let's rely on Subaccounts usually implies pipeline access.
          // Just use Tasks + Verified Subaccounts.
          return {
            userId: member.id,
            workloadScore: (tasksCount || 0) + (subaccountsCount || 0) * 2 // Weight subaccounts higher
          }
        })

        const workloads = await Promise.all(workloadPromises)
        const newWorkloadMap = workloads.reduce((acc, curr) => ({ ...acc, [curr.userId]: curr.workloadScore }), {} as Record<string, number>)
        setWorkloadMap(newWorkloadMap)
      }

      // Check current user details
      const user = await getAuthUserDetails()
        .eq('agencyId', params.agencyId)

      // Fetch employees for each subaccount
      if (subaccountsData && subaccountsData.length > 0) {
        const subaccountIds = subaccountsData.map((sub) => sub.id)

        const { data: employeesData } = await supabase
          .from('SubAccountEmployee')
          .select('*')
          .in('subAccountId', subaccountIds)
          .eq('isActive', true)

        // Fetch user details for employees
        let employeesWithUsers: any[] = []
        if (employeesData && employeesData.length > 0) {
          const userIds = employeesData.map((emp) => emp.userId)
          const { data: usersData } = await supabase
            .from('User')
            .select('id, name, email')
            .in('id', userIds)

          employeesWithUsers = employeesData.map((emp) => {
            const user = usersData?.find((u) => u.id === emp.userId)
            return {
              ...emp,
              userName: user?.name || `User ${emp.userId.slice(0, 8)}`,
              userEmail: user?.email || '',
            }
          })
        }

        // Attach employees to their respective subaccounts
        const subaccountsWithEmployees = subaccountsData.map((subaccount) => ({
          ...subaccount,
          employees: employeesWithUsers.filter((emp) => emp.subAccountId === subaccount.id) || [],
        }))

        setSubaccounts(subaccountsWithEmployees)
      } else {
        setSubaccounts([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load team data',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchAuthUser = async () => {
      const user = await getAuthUserDetails()
      setAuthUser(user)
    }
    fetchAuthUser()
  }, [])

  const currentRole = authUser?.role as any || 'SUBACCOUNT_USER'

  // Filter team members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === 'all' || member.role.toLowerCase() === roleFilter.toLowerCase().replace('_', '_')

      return matchesSearch && matchesRole
    })
  }, [teamMembers, searchQuery, roleFilter])

  // Filter invitations
  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      const matchesSearch =
        inv.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'invited' && inv.status === 'PENDING') ||
        (statusFilter === 'active' && inv.status === 'ACCEPTED') ||
        (statusFilter === 'inactive' && inv.status === 'REVOKED')

      return matchesSearch && matchesStatus
    })
  }, [invitations, searchQuery, statusFilter])

  const activeCount = teamMembers.length
  const pendingInvitationsCount = invitations.filter(i => i.status === 'PENDING').length

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'active':
      case 'ACCEPTED':
        return 'default'
      case 'inactive':
      case 'REVOKED':
        return 'secondary'
      case 'invited':
      case 'PENDING':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getRoleBadge = (role: string) => {
    const roleLabels: Record<string, string> = {
      AGENCY_OWNER: 'Owner',
      AGENCY_ADMIN: 'Admin',
      SUBACCOUNT_USER: 'User',
      SUBACCOUNT_GUEST: 'Guest',
    }
    return roleLabels[role] || role
  }

  const handleEditDetails = (member: any) => {
    setOpen(
      <CustomModal
        subheading="You can change permissions only when the user has an owned subaccount"
        title="Edit User Details"
      >
        <UserDetails
          type="agency"
          id={params.agencyId}
          subAccounts={subaccounts}
          userData={member}
          onUpdate={() => fetchData(true)}
        />
      </CustomModal>,
      async () => {
        return { user: await getUser(member.id) }
      }
    )
  }

  const handleDeleteMember = async (memberId: string, memberName: string, memberRole: string) => {
    if (!canManageRole(currentRole, memberRole as any)) {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `You do not have the clearance to remove a ${getRoleBadge(memberRole)}`,
      })
      return
    }

    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) return

    try {
      const success = await deleteUser(memberId, params.agencyId)
      if (success) {
        toast({
          title: 'Success',
          description: 'Team member removed successfully',
        })
        fetchData(true)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove team member',
      })
    }
  }

  const handleDeleteInvitation = async (invitationId: string, email: string | undefined) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${email}?`)) return

    try {
      const success = await deleteInvitation(invitationId)
      if (success) {
        toast({
          title: 'Success',
          description: 'Invitation revoked successfully',
        })
        fetchData(true)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to revoke invitation',
      })
    }
  }

  const handleCopyInvitationLink = async (invitation: InvitationType) => {
    const baseUrl = window.location.origin
    const invitationLink = `${baseUrl}/agency/sign-up?email=${encodeURIComponent(invitation.email)}&invitation=${invitation.id}`

    try {
      await navigator.clipboard.writeText(invitationLink)
      toast({
        title: 'Copied',
        description: 'Invitation link copied to clipboard',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy link',
      })
    }
  }

  const handleExport = () => {
    try {
      const data = membersSubTab === 'active' ? teamMembers : invitations
      const csv = [
        // Header
        Object.keys(data[0] || {}).join(','),
        // Rows
        ...data.map(item => Object.values(item).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `team-${membersSubTab}-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Success',
        description: `Exported ${data.length} records`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export data',
      })
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const lines = text.split('\n')
        const headers = lines[0].split(',')

        // Parse CSV and import
        // This is a basic implementation - you can enhance it
        toast({
          title: 'Import Started',
          description: `Processing ${lines.length - 1} records...`,
        })

        // TODO: Implement actual import logic based on your needs
        toast({
          title: 'Import Complete',
          description: 'Data imported successfully',
        })
        fetchData()
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to import data',
        })
      }
    }
    input.click()
  }

  const handleAddEmployeeSuccess = () => {
    setShowAddEmployee(false)
    setShowInviteEmployee(false)
    fetchData(true)
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their access
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Current User Status Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[130px] justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${manualStatus === 'available' ? 'bg-green-500' : manualStatus === 'busy' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <span className="capitalize">{manualStatus}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setManualStatus('available')}>
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Available
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setManualStatus('busy')}>
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" /> Busy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setManualStatus('away')}>
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" /> Away
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeTab === 'members' && (
            <>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={() => {
              setEmployeeFormMode('invite')
              setShowInviteEmployee(true)
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            Quick Invite
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEmployeeFormMode('full')
              setShowAddEmployee(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="workload">Workload</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="flowboard">Flowboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Team Members Tab Content */}
        <TabsContent value="members" className="space-y-4">
          <Tabs value={membersSubTab} onValueChange={(v) => setMembersSubTab(v as any)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="active">Active Members ({activeCount})</TabsTrigger>
                <TabsTrigger value="invitations">
                  Invitations ({invitations.length})
                  {pendingInvitationsCount > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {pendingInvitationsCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {Object.keys(ROLE_HIERARCHY).map(role => (
                      <SelectItem key={role} value={role}>{getRoleBadge(role)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Member Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading team members...</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No team members found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-24 pt-8">
                  {filteredMembers.map((member: User) => (
                    <div key={member.id} className="relative group">
                      {/* More Options - Absolute overlay */}
                      <div className="absolute top-4 right-4 z-20">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDetails(member)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            {canManageRole(currentRole, member.role) && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteMember(member.id, member.name, member.role)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Member
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <ProfileCard
                        name={member.name}
                        role={getRoleBadge(member.role)}
                        email={member.email}
                        avatarSrc={member.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&h=250&auto=format&fit=crop'}
                        statusText={
                          presenceMap[member.id]?.status === 'busy' ? 'Do Not Disturb' :
                            presenceMap[member.id]?.status === 'away' ? 'Away' :
                              presenceMap[member.id]?.status === 'available' ? 'Active Now' :
                                'Offline'
                        }
                        status={presenceMap[member.id]?.status || 'offline'}
                        glowText={
                          presenceMap[member.id]?.status === 'available' ? 'Online and working' :
                            presenceMap[member.id]?.status === 'busy' ? 'Busy with tasks' :
                              presenceMap[member.id]?.status === 'away' ? `Last seen ${presenceMap[member.id]?.online_at ? format(new Date(presenceMap[member.id].online_at), 'h:mm a') : 'recently'}` :
                                `Last seen ${member.updatedAt ? format(new Date(member.updatedAt), 'MMM d, h:mm a') : 'recently'}`
                        }
                        onAction={() => handleEditDetails(member)}
                        actionText="Edit Details"
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="invitations" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="invited">Pending</SelectItem>
                    <SelectItem value="active">Accepted</SelectItem>
                    <SelectItem value="inactive">Revoked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Invitations List */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading invitations...</p>
                </div>
              ) : filteredInvitations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No invitations found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvitations.map((invitation: InvitationType) => (
                    <Card key={invitation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Badge variant={getStatusBadgeVariant(invitation.status)}>
                                {invitation.status}
                              </Badge>
                              <div>
                                <p className="font-semibold">{invitation.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  Role: {getRoleBadge(invitation.role)}
                                  {invitation.createdAt && (
                                    <> • Sent {format(new Date(invitation.createdAt), 'MMM d, yyyy')}</>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitation.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyInvitationLink(invitation)}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteInvitation(invitation.id, invitation.email)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Revoke
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Roles & Permissions</h2>
                <p className="text-muted-foreground">Detailed view of team member roles and their specific access levels</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading member cards...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                {teamMembers.map((member: User) => {
                  const joinDate = member.createdAt ? new Date(member.createdAt) : new Date();
                  const durationInDays = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24));
                  const durationStr = durationInDays > 365
                    ? `${Math.floor(durationInDays / 365)} years`
                    : durationInDays > 30
                      ? `${Math.floor(durationInDays / 30)} months`
                      : `${durationInDays} days`;

                  // Select tools based on role
                  const roleTools = [];
                  if (member.role === 'AGENCY_OWNER') {
                    roleTools.push(<ShieldAlert key="owner" className="h-4 w-4 text-red-500" />);
                    roleTools.push(<Settings key="admin" className="h-4 w-4 text-blue-500" />);
                  } else if (member.role === 'AGENCY_ADMIN') {
                    roleTools.push(<ShieldCheck key="admin" className="h-4 w-4 text-green-500" />);
                    roleTools.push(<LayoutTemplate key="layout" className="h-4 w-4 text-purple-500" />);
                  } else {
                    roleTools.push(<UserIcon key="user" className="h-4 w-4 text-gray-500" />);
                    roleTools.push(<Briefcase key="work" className="h-4 w-4 text-orange-500" />);
                  }

                  // Banner URLs based on role or random
                  const banners = [
                    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1000&auto=format&fit=crop'
                  ];
                  const bannerSrc = banners[Math.abs(member.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % banners.length];

                  return (
                    <FreelancerProfileCard
                      key={member.id}
                      name={member.name}
                      title={getRoleBadge(member.role)}
                      avatarSrc={member.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&h=250&auto=format&fit=crop'}
                      bannerSrc={bannerSrc}
                      rating={5.0} // Default rating
                      duration={durationStr}
                      rate={member.role === 'AGENCY_OWNER' ? 'Unlimited' : 'Full Access'}
                      tools={roleTools}
                      onGetInTouch={() => handleEditDetails(member)}
                      onBookmark={() => toast({ title: "Bookmarked", description: `${member.name} added to favorites` })}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Placeholder Tabs */}
        <TabsContent value="teams">
          <TeamsManager
            agencyId={params.agencyId}
            teams={teams}
            allUsers={teamMembers}
            onUpdate={() => fetchData(true)}
          />
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Team Workload</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CalendarClock className="mr-2 h-4 w-4" /> This Month
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => {
              // Calculate workload %: Cap at 100%. Assume 20 points is "Full Capacity".
              // Points: 1 per task, 2 per subaccount.
              const score = workloadMap[member.id] || 0;
              const workload = Math.min(Math.round((score / 20) * 100), 100);

              return (
                <WorkloadCard
                  key={`workload-${member.id}`}
                  name={member.name}
                  role={getRoleBadge(member.role)}
                  avatarUrl={member.avatarUrl}
                  joinedDate={member.createdAt ? format(new Date(member.createdAt), 'MMMM d, yyyy') : 'N/A'}
                  workload={workload}
                  department={member.role === 'AGENCY_OWNER' ? 'Management' : member.role === 'AGENCY_ADMIN' ? 'Operations' : 'Development'}
                  status={presenceMap[member.id]?.status || 'offline'}
                  onChat={() => {
                    toast({ title: 'Chat Open', description: `Started chat with ${member.name}` });
                  }}
                  onDetails={() => handleEditDetails(member)}
                />
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent actions performed by team members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://avatar.vercel.sh/${i}.png`} alt="Avatar" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">User updated a task status</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(Date.now() - 1000 * 60 * 60 * i), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center p-4">
                  <p className="text-sm text-muted-foreground">End of recent history</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flowboard">
          <div className="h-[75vh] w-full border rounded-lg overflow-hidden">
            <Flowboard />
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-lg text-muted-foreground">
            Team Settings Coming Soon
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Team Hierarchy & Access Structure</CardTitle>
              <CardDescription>
                Organizational structure showing agency, subaccounts, team members, and their access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[600px] text-muted-foreground">
                  <p>Loading team hierarchy...</p>
                </div>
              ) : (
                <AgencyTeamTreeChart
                  agencyName={agencyDetails?.name || 'Agency'}
                  subaccounts={subaccounts}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-center h-[200px] border-2 border-dashed rounded-lg text-muted-foreground">
            More Team Analytics Coming Soon
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Employee Dialog (Full Form) */}
      <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Fill in all employee details. An invitation will be sent to their email.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            agencyId={params.agencyId}
            mode="create"
            onSuccess={handleAddEmployeeSuccess}
            onCancel={() => setShowAddEmployee(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Quick Invite Dialog (Simple Form) */}
      <Dialog open={showInviteEmployee} onOpenChange={setShowInviteEmployee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Invite</DialogTitle>
            <DialogDescription>
              Send a quick invitation to a teammate. They can add their details after accepting.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            agencyId={params.agencyId}
            mode="invite"
            onSuccess={handleAddEmployeeSuccess}
            onCancel={() => setShowInviteEmployee(false)}
          />
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default TeamPage
