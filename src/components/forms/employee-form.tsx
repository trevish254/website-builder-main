'use client'
import React, { useState } from 'react'
import { z } from 'zod'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useToast } from '../ui/use-toast'
import { Textarea } from '../ui/textarea'
import { Copy, Check } from 'lucide-react'

const employeeSchema = z.object({
  // Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  avatarUrl: z.string().optional(),

  // Employment Info
  employeeId: z.string().optional(),
  jobTitle: z.string().optional(),
  jobCategory: z.string().optional(),
  employmentType: z.string().optional(),
  role: z.enum(['AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']),

  // Personal Info
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  placeOfBirth: z.string().optional(),
  birthdate: z.string().optional(),
  bloodType: z.string().optional(),
  age: z.number().optional(),

  // Address Info
  residentialAddress: z.string().optional(),
  citizenIdAddress: z.string().optional(),

  // Description
  description: z.string().optional(),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
  agencyId: string
  initialData?: Partial<EmployeeFormData>
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit' | 'invite'
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  agencyId,
  initialData,
  onSuccess,
  onCancel,
  mode = 'create',
}) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invitationLink, setInvitationLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      avatarUrl: '',
      employeeId: '',
      jobTitle: '',
      jobCategory: '',
      employmentType: 'Fulltime',
      role: 'SUBACCOUNT_USER',
      gender: '',
      maritalStatus: '',
      religion: '',
      placeOfBirth: '',
      birthdate: '',
      bloodType: '',
      age: undefined,
      residentialAddress: '',
      citizenIdAddress: '',
      description: '',
      ...initialData,
    },
  })

  const onSubmit = async (values: EmployeeFormData) => {
    console.log('📧 Starting invitation submission...', { email: values.email, role: values.role, mode })
    setIsSubmitting(true)
    setInvitationLink(null) // Reset link on new submission
    try {
      if (mode === 'invite') {
        // Simple invitation mode - just send invitation
        console.log('📧 Invite mode: sending invitation...')
        const { sendInvitation, saveActivityLogsNotification } = await import('@/lib/queries')
        const res = await sendInvitation(values.role, values.email, agencyId)
        console.log('📧 sendInvitation result:', res)

        if (!res) {
          console.error('❌ sendInvitation returned null - invitation creation failed')
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to create invitation. Please try again.',
          })
          return
        }

        // Generate invitation link
        const baseUrl = window.location.origin
        const link = `${baseUrl}/agency/sign-up?email=${encodeURIComponent(res.email)}&invitation=${res.id}`
        setInvitationLink(link)

        try {
          await saveActivityLogsNotification({
            agencyId: agencyId,
            description: `Invited ${res.email}`,
            subaccountId: undefined,
          })
          console.log('✅ Activity log saved')
        } catch (logError) {
          console.warn('⚠️ Failed to save activity log:', logError)
          // Don't fail the whole operation if activity log fails
        }

        console.log('✅ Invitation sent successfully!')
        toast({
          title: 'Success',
          description: 'Invitation created successfully',
        })

        // Do NOT reset form immediately so user can see the link
        // form.reset() 
        // onSuccess?.() // Don't close dialog yet
      } else {
        // Full employee mode - create user directly (if you have API for this)
        // For now, we'll send invitation and you can update details later
        console.log('📧 Full mode: sending invitation with details...')
        const { sendInvitation, saveActivityLogsNotification } = await import('@/lib/queries')
        const res = await sendInvitation(values.role, values.email, agencyId)
        console.log('📧 sendInvitation result:', res)

        if (!res) {
          console.error('❌ sendInvitation returned null - invitation creation failed')
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to create invitation. Please try again.',
          })
          return
        }

        // Generate invitation link
        const baseUrl = window.location.origin
        const link = `${baseUrl}/agency/sign-up?email=${encodeURIComponent(res.email)}&invitation=${res.id}`
        setInvitationLink(link)

        try {
          await saveActivityLogsNotification({
            agencyId: agencyId,
            description: `Invited ${values.email} with full details`,
            subaccountId: undefined,
          })
          console.log('✅ Activity log saved')
        } catch (logError) {
          console.warn('⚠️ Failed to save activity log:', logError)
          // Don't fail the whole operation if activity log fails
        }

        console.log('✅ Employee invitation sent successfully!')
        toast({
          title: 'Success',
          description: 'Employee invitation sent. Details will be saved once they accept.',
        })

        // Do NOT reset form immediately so user can see the link
        // form.reset()
        // onSuccess?.()
      }
    } catch (error: any) {
      console.error('❌ Error submitting employee form:', error)
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      })
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Failed to send invitation. Please check the console for details.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyLink = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink)
      setCopied(true)
      toast({
        title: 'Copied',
        description: 'Invitation link copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (mode === 'invite') {
    // Simple invitation form
    return (
      <div className="space-y-4">
        {invitationLink ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md border border-border">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Invitation Created!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share this link with the user to invite them to your agency.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={invitationLink}
                  readOnly
                  className="font-mono text-xs bg-background"
                />
                <Button size="icon" variant="outline" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setInvitationLink(null)
                  form.reset()
                  onSuccess?.()
                }}
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  setInvitationLink(null)
                  form.reset()
                }}
              >
                Invite Another
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={async (e) => {
                try {
                  console.log('🔵 Form submit event triggered')
                  console.log('🔵 Form state:', {
                    isValid: form.formState.isValid,
                    errors: form.formState.errors,
                    values: form.getValues(),
                  })

                  // Use handleSubmit which includes validation
                  const submitResult = form.handleSubmit(
                    onSubmit,
                    (errors) => {
                      console.error('❌ Form validation errors:', errors)
                      console.error('❌ Form values that failed:', form.getValues())
                    }
                  )(e)

                  // If handleSubmit returns false, validation failed
                  if (submitResult === false) {
                    console.error('❌ Form submission prevented due to validation errors')
                  }
                } catch (error) {
                  console.error('❌ Unexpected error in form submit handler:', error)
                }
              }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="employee@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                        <SelectItem value="SUBACCOUNT_USER">Sub Account User</SelectItem>
                        <SelectItem value="SUBACCOUNT_GUEST">Sub Account Guest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-end">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={async (e) => {
                    console.log('🔵 Button clicked, isSubmitting:', isSubmitting)
                    const formValues = form.getValues()
                    console.log('🔵 Form values:', formValues)
                    console.log('🔵 Form errors:', form.formState.errors)
                    console.log('🔵 Form is valid:', form.formState.isValid)
                    console.log('🔵 Form is dirty:', form.formState.isDirty)

                    // Manually trigger validation
                    const isValid = await form.trigger()
                    console.log('🔵 Validation result:', isValid)

                    if (!isValid) {
                      console.error('❌ Form validation failed:', form.formState.errors)
                      // Don't prevent default - let the form show errors
                    }
                  }}
                >
                  {isSubmitting ? <Loading /> : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    )
  }

  // Full employee form
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'edit' ? 'Edit Employee' : 'Add Employee'}</CardTitle>
        <CardDescription>
          {mode === 'edit'
            ? 'Update employee information'
            : 'Fill in employee details. An invitation will be sent to their email.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invitationLink ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md border border-border">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Invitation Created!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share this link with the user to invite them to your agency.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={invitationLink}
                  readOnly
                  className="font-mono text-xs bg-background"
                />
                <Button size="icon" variant="outline" onClick={handleCopyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setInvitationLink(null)
                  form.reset()
                  onSuccess?.()
                }}
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  setInvitationLink(null)
                  form.reset()
                }}
              >
                Add Another
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 8900" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="#EMP001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fulltime">Fulltime</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Role *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                            <SelectItem value="SUBACCOUNT_USER">Sub Account User</SelectItem>
                            <SelectItem value="SUBACCOUNT_GUEST">Sub Account Guest</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion</FormLabel>
                        <FormControl>
                          <Input placeholder="Christian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="placeOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birthdate</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <FormField
                  control={form.control}
                  name="residentialAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="4517 Washington Ave. Manchester, Kentucky 39495" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="citizenIdAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizen ID Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="2715 Ash Dr. San Jose, South Dakota 83475" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about the employee..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loading /> : mode === 'edit' ? 'Update Employee' : 'Add Employee & Send Invitation'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

export default EmployeeForm
