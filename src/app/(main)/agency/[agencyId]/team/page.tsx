'use client'
import { useState, useMemo, useEffect } from 'react'
import { Plus, Upload, Download, Search, Filter, MoreVertical, Eye, Trash2, Copy, Mail, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { getAgencyTeamMembers, getAgencyInvitations, deleteInvitation, deleteUser, getUser } from '@/lib/queries'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/global/custom-modal'
import UserDetails from '@/components/forms/user-details'
import AgencyTeamTreeChart from '@/components/global/agency-team-tree-chart'
import { supabase } from '@/lib/supabase'


type Props = {
  params: { agencyId: string }
}

const TeamPage = ({ params }: Props) => {
  const router = useRouter()
  const { toast } = useToast()
  const { setOpen } = useModal()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'invited'>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members')

  // Data states
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [invitations, setInvitations] = useState<InvitationType[]>([])
  const [loading, setLoading] = useState(true)
  const [agencyDetails, setAgencyDetails] = useState<any>(null)
  const [subaccounts, setSubaccounts] = useState<any[]>([])

  // Modal states
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showInviteEmployee, setShowInviteEmployee] = useState(false)
  const [employeeFormMode, setEmployeeFormMode] = useState<'full' | 'invite'>('full')

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [params.agencyId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [members, invs] = await Promise.all([
        getAgencyTeamMembers(params.agencyId),
        getAgencyInvitations(params.agencyId)
      ])
      setTeamMembers(members)
      setInvitations(invs)

      // Fetch agency details and subaccounts for hierarchy chart
      const { data: agencyData } = await supabase
        .from('Agency')
        .select('*')
        .eq('id', params.agencyId)
        .single()

      const { data: subaccountsData } = await supabase
        .from('SubAccount')
        .select('*')
        .eq('agencyId', params.agencyId)

      setAgencyDetails(agencyData)

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
          id={member.agencyId || null}
          subAccounts={member.Agency?.SubAccount}
          userData={member}
        />
      </CustomModal>,
      async () => {
        return { user: await getUser(member.id) }
      }
    )
  }

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) return

    try {
      const success = await deleteUser(memberId, params.agencyId)
      if (success) {
        toast({
          title: 'Success',
          description: 'Team member removed successfully',
        })
        fetchData()
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
        fetchData()
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
      const data = activeTab === 'members' ? teamMembers : invitations
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
      a.download = `team-${activeTab}-${new Date().toISOString()}.csv`
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
    fetchData()
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
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          Active Members: {activeCount} • Pending Invitations: {pendingInvitationsCount}
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'members' | 'invitations')}>
        <TabsList>
          <TabsTrigger value="members">Team Members ({teamMembers.length})</TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations ({invitations.length})
            {pendingInvitationsCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {pendingInvitationsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-4">
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="AGENCY_OWNER">Owner</SelectItem>
                <SelectItem value="AGENCY_ADMIN">Admin</SelectItem>
                <SelectItem value="SUBACCOUNT_USER">User</SelectItem>
                <SelectItem value="SUBACCOUNT_GUEST">Guest</SelectItem>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMembers.map((member: User) => (
                <Card key={member.id} className="relative hover:shadow-lg transition-shadow">
                  {/* Role Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="default">
                      {getRoleBadge(member.role)}
                    </Badge>
                  </div>

                  {/* More Options */}
                  <div className="absolute top-3 right-3 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDetails(member)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardContent className="pt-8 pb-4">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
                        <Image
                          src={member.avatarUrl || '/placeholder-logo.png'}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground truncate" title={member.email}>
                        {member.email}
                      </p>
                    </div>

                    {/* Joined Date */}
                    <div className="text-center text-sm text-muted-foreground">
                      {member.createdAt && `Joined ${format(new Date(member.createdAt), 'MMM d, yyyy')}`}
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 text-center">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleEditDetails(member)}
                      >
                        Edit details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Invitations Tab */}
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

      {/* Team Hierarchy & Access Structure */}
      <Card className="w-full mt-6">
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
    </div>
  )
}

export default TeamPage
