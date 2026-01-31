'use client'
import {
  AuthUserWithAgencySigebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from '@/lib/types'
import { useModal } from '@/providers/modal-provider'
import { SubAccount, User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { Shield, ShieldAlert, ShieldCheck, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from '@/lib/queries'
import {
  ROLE_HIERARCHY,
  PERMISSION_DOMAINS,
  canManageRole,
  isAboveCeiling,
  hasDomainAccess,
} from '@/lib/permissions'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { v4 } from 'uuid'

type Props = {
  id: string | null
  type: 'agency' | 'subaccount'
  userData?: Partial<User>
  subAccounts?: SubAccount[]
  onUpdate?: () => void
}

const UserDetails = ({ id, type, subAccounts, userData, onUpdate }: Props) => {
  const [subAccountPermissions, setSubAccountsPermissions] =
    useState<UserWithPermissionsAndSubAccounts | null>(null)

  const { data, setClose } = useModal()
  const [roleState, setRoleState] = useState('')
  const [loadingPermissions, setLoadingPermissions] = useState(false)
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  //Get authUSerDtails

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails()
        if (response) setAuthUserData(response)
      }
      fetchDetails()
    }
  }, [data])

  const currentUser = authUserData || data.user
  const currentUserRole = currentUser?.role as any || 'SUBACCOUNT_USER'
  const isEditingSelf = userData?.id === currentUser?.id || data?.user?.id === currentUser?.id
  const isOwner = currentUserRole === 'AGENCY_OWNER'
  const isAdmin = currentUserRole === 'AGENCY_ADMIN'

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum([
      'AGENCY_OWNER',
      'AGENCY_ADMIN',
      'SUBACCOUNT_USER',
      'SUBACCOUNT_GUEST',
    ]),
  })

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: 'onChange',
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  })

  useEffect(() => {
    if (!data.user) return
    const getPermissions = async () => {
      if (!data.user) return
      const permission = await getUserPermissions(data.user.email)
      setSubAccountsPermissions(permission)
    }
    getPermissions()
  }, [data, form])

  useEffect(() => {
    if (data.user) {
      form.reset(data.user)
    }
    if (userData) {
      form.reset(userData)
    }
  }, [userData, data])

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!data.user?.email) return
    setLoadingPermissions(true)
    const response = await changeUserPermissions(
      permissionsId,
      data.user.email,
      subAccountId,
      val
    )
    if (type === 'agency') {
      const permission = subAccountPermissions?.Permissions.find(
        (p) => p.subAccountId === subAccountId
      )
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Gave ${userData?.name} access to | ${permission?.SubAccount?.name || 'Unknown Subaccount'}`,
        subaccountId: permission?.SubAccount?.id,
      })
    }

    if (response) {
      if (onUpdate) onUpdate()
      toast({
        title: 'Success',
        description: 'The request was successfull',
      })
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((perm) => {
          if (perm.subAccountId === subAccountId) {
            return { ...perm, access: !perm.access }
          }
          return perm
        })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not update permissions',
      })
    }
    router.refresh()
    setLoadingPermissions(false)
  }

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return

    // Protection: Prevent self-downgrade
    if (isEditingSelf && values.role !== currentUserRole) {
      toast({
        variant: 'destructive',
        title: 'Action Denied',
        description: 'You cannot change your own role. Please contact another owner to transfer ownership.',
      })
      return
    }

    // Protection: Prevent non-owners from assigning roles above their ceiling
    if (!isOwner && ROLE_HIERARCHY[values.role] >= ROLE_HIERARCHY[currentUserRole]) {
      // Allow same role only if specifically allowed, but generally ceiling rule is strict
      if (values.role !== currentUserRole) {
        toast({
          variant: 'destructive',
          title: 'Ceiling Violation',
          description: 'You cannot assign a role equal to or higher than your own.',
        })
        return
      }
    }

    if (userData || data?.user) {
      const updatedUser = await updateUser({ ...values, id: userData?.id || data?.user?.id })
      authUserData?.Agency?.SubAccount.filter((subacc) =>
        authUserData.Permissions.find(
          (p) => p.subAccountId === subacc.id && p.access
        )
      ).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subaccountId: subaccount.id,
        })
      })

      if (updatedUser) {
        if (onUpdate) onUpdate()
        toast({
          title: 'Success',
          description: 'Update User Information',
        })
        setClose()
        router.refresh()
      } else {
        toast({
          variant: 'destructive',
          title: 'Oppse!',
          description: 'Could not update user information',
        })
      }
    } else {
      console.log('Error could not submit')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Full Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === 'AGENCY_OWNER' ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel> User Role</FormLabel>
                  <Select
                    disabled={field.value === 'AGENCY_OWNER'}
                    onValueChange={(value) => {
                      if (
                        value === 'SUBACCOUNT_USER' ||
                        value === 'SUBACCOUNT_GUEST'
                      ) {
                        setRoleState(
                          'You need to have subaccounts to assign Subaccount access to team members.'
                        )
                      } else {
                        setRoleState('')
                      }
                      field.onChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Ceiling Rule: Only show roles below current user, or OWNER can see all but only for others */}
                      {Object.keys(ROLE_HIERARCHY).map((role) => {
                        const r = role as any
                        const targetLevel = ROLE_HIERARCHY[r]
                        const currentLevel = ROLE_HIERARCHY[currentUserRole]

                        // Don't show roles above current user's ceiling
                        if (currentLevel < targetLevel && currentUserRole !== 'AGENCY_OWNER') return null

                        // Only Owner can assign ADMIN or OWNER
                        if (r === 'AGENCY_OWNER' && currentUserRole !== 'AGENCY_OWNER') return null
                        if (r === 'AGENCY_ADMIN' && currentUserRole !== 'AGENCY_OWNER') return null

                        const labels: any = {
                          AGENCY_OWNER: 'Agency Owner (Root)',
                          AGENCY_ADMIN: 'Agency Admin (Operational)',
                          SUBACCOUNT_USER: 'Sub Account User (Execution)',
                          SUBACCOUNT_GUEST: 'Sub Account Guest (External)',
                        }

                        return (
                          <SelectItem key={r} value={r}>
                            {labels[r]}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : 'Save User Details'}
            </Button>
            {/* Permission Domains Section */}
            {(isOwner || isAdmin) && (
              <div className="space-y-6">
                <Separator className="my-6" />
                <div className="space-y-1">
                  <FormLabel className="text-lg font-bold">Permission Domains</FormLabel>
                  <FormDescription>
                    These domains define the granular access level for this user based on their role.
                  </FormDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PERMISSION_DOMAINS.map((domain) => {
                    const targetRole = form.getValues('role') as any
                    const hasAccess = hasDomainAccess(targetRole, domain.id)
                    const isLocked = isAboveCeiling(currentUserRole, targetRole) || domain.minRole === 'AGENCY_OWNER'

                    return (
                      <div
                        key={domain.id}
                        className={cn(
                          "flex flex-col gap-2 rounded-xl border p-4 transition-all",
                          hasAccess ? "bg-primary/5 border-primary/20" : "bg-muted/50 opacity-60"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "p-2 rounded-lg",
                              hasAccess ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {/* Icon placeholder or dynamic lucide icon would go here */}
                              <Shield className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{domain.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{domain.description}</p>
                            </div>
                          </div>
                          <Badge variant={hasAccess ? "default" : "secondary"} className="text-[10px] uppercase font-bold">
                            {hasAccess ? "Unlocked" : "Locked"}
                          </Badge>
                        </div>

                        {hasAccess && (
                          <div className="mt-2 text-[11px] text-muted-foreground italic">
                            Core permissions in this domain are active.
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4">
                  <FormLabel>Sub-Account Access</FormLabel>
                  <FormDescription className="mb-4">
                    Specifically grant or revoke access to individual sub-accounts.
                  </FormDescription>
                  <div className="flex flex-col gap-3">
                    {subAccounts?.map((subAccount) => {
                      const subAccountPermissionsDetails =
                        subAccountPermissions?.Permissions.find(
                          (p) => p.subAccountId === subAccount.id
                        )
                      const targetRole = form.getValues('role') as any
                      const canModifyAccess = isOwner || (isAdmin && targetRole !== 'AGENCY_ADMIN')

                      return (
                        <div
                          key={subAccount.id}
                          className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {subAccount.name[0]}
                            </div>
                            <p className="font-medium">{subAccount.name}</p>
                          </div>
                          <Switch
                            disabled={loadingPermissions || !canModifyAccess}
                            checked={subAccountPermissionsDetails?.access}
                            onCheckedChange={(permission) => {
                              onChangePermission(
                                subAccount.id,
                                permission,
                                subAccountPermissionsDetails?.id
                              )
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UserDetails
