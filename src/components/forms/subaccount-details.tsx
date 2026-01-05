'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { v4 } from 'uuid'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import FileUpload from '../global/file-upload'
import { Agency, SubAccount } from '@prisma/client'
import { useToast } from '../ui/use-toast'
import { saveActivityLogsNotification, upsertSubAccount } from '@/lib/queries'
import { useEffect } from 'react'
import Loading from '../global/loading'
import { useModal } from '@/providers/modal-provider'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Account name must be at least 2 characters.' }),
  companyEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  companyPhone: z.string().min(1, { message: 'Phone number is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  subAccountLogo: z.string().optional(),
  zipCode: z.string().min(1, { message: 'Zip code is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
  country: z.string().min(1, { message: 'Country is required.' }),
  subAccountType: z.enum(['AGENCY', 'TEAM', 'INDIVIDUAL', 'ORGANIZATION']).default('AGENCY'),
  companyName: z.string().optional(),
})

//CHALLENGE Give access for Subaccount Guest they should see a different view maybe a form that allows them to create tickets

//CHALLENGE layout.tsx oonly runs once as a result if you remove permissions for someone and they keep navigating the layout.tsx wont fire again. solution- save the data inside metadata for current user.

interface SubAccountDetailsProps {
  //To add the sub account to the agency
  agencyDetails: Agency
  details?: Partial<SubAccount>
  userId: string
  userName: string
}

const SubAccountDetails: React.FC<SubAccountDetailsProps> = ({
  details,
  agencyDetails,
  userId,
  userName,
}) => {
  const { toast } = useToast()
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: details?.name || '',
      companyEmail: details?.companyEmail || '',
      companyPhone: details?.companyPhone || '',
      address: details?.address || '',
      city: details?.city || '',
      zipCode: details?.zipCode || '',
      state: details?.state || '',
      country: details?.country || '',
      subAccountLogo: details?.subAccountLogo || '',
      subAccountType: (details as any)?.subAccountType || 'AGENCY',
      companyName: (details as any)?.companyName || '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Get actual form values as fallback (in case values param is empty)
      const formValues = form.getValues()
      console.log('📥 Form submitted with values param:', values)
      console.log('📥 Form getValues():', formValues)

      // Use form.getValues() if values param seems empty
      const actualValues = (values.name && values.name.trim() !== '' && values.companyEmail && values.companyEmail.trim() !== '')
        ? values
        : formValues

      console.log('📊 Using actual values:', actualValues)
      console.log('📊 Form state:', {
        isValid: form.formState.isValid,
        errors: form.formState.errors,
      })

      // Validate required fields
      if (!actualValues.companyEmail || actualValues.companyEmail.trim() === '') {
        console.error('❌ Email is empty!', {
          valuesParam: values.companyEmail,
          formValues: formValues.companyEmail,
          actualValues: actualValues.companyEmail
        })
        toast({
          variant: 'destructive',
          title: 'Email Required',
          description: 'Please provide a company email address in the form field.',
        })
        form.setFocus('companyEmail')
        return
      }

      if (!actualValues.name || actualValues.name.trim() === '') {
        console.error('❌ Name is empty!', {
          valuesParam: values.name,
          formValues: formValues.name,
          actualValues: actualValues.name
        })
        toast({
          variant: 'destructive',
          title: 'Name Required',
          description: 'Please provide an account name in the form field.',
        })
        form.setFocus('name')
        return
      }

      // Show loading state
      toast({
        title: details?.id ? 'Updating Subaccount...' : 'Creating Subaccount...',
        description: 'Please wait while we save your changes.',
      })

      const subAccountData = {
        id: details?.id ? details.id : v4(),
        address: actualValues.address || '',
        subAccountLogo: actualValues.subAccountLogo || '/placeholder-logo.png',
        city: actualValues.city || '',
        companyPhone: actualValues.companyPhone || '',
        country: actualValues.country || '',
        name: actualValues.name || '',
        state: actualValues.state || '',
        zipCode: actualValues.zipCode || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyEmail: actualValues.companyEmail, // This should always be set now
        agencyId: agencyDetails.id,
        connectAccountId: '',
        goal: 5000,
        subAccountType: actualValues.subAccountType,
        companyName: actualValues.companyName,
      }

      console.log('🏢 Attempting to save subaccount to database...')
      console.log('📊 Subaccount data to save:', subAccountData)
      console.log('📧 Company Email check:', {
        hasCompanyEmail: !!subAccountData.companyEmail,
        companyEmailValue: subAccountData.companyEmail,
      })

      const response = await upsertSubAccount(subAccountData)

      if (!response) {
        console.error('❌ Subaccount creation returned null')
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: 'Could not create your subaccount. Please check your database connection and try again.',
        })
        return
      }

      console.log('✅ Subaccount saved successfully:', response)

      const responseData = response as any
      await saveActivityLogsNotification({
        agencyId: responseData.agencyId,
        description: `${userName} | ${details?.id ? 'updated' : 'created'} sub account | ${responseData.name}`,
        subaccountId: responseData.id,
      })

      toast({
        title: 'Subaccount details saved',
        description: 'Successfully saved your subaccount details. Redirecting...',
      })

      // Close modal if open
      setClose()

      // Redirect to the subaccount page
      if (responseData.id) {
        console.log('🔄 Redirecting to subaccount page:', `/subaccount/${responseData.id}`)
        router.push(`/subaccount/${responseData.id}`)
      } else {
        // Fallback: refresh and stay on current page if no ID
        router.refresh()
      }
    } catch (error: any) {
      console.error('❌ Subaccount creation error:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: `Could not save sub account details: ${errorMessage}. Please check your database setup.`,
      })
    }
  }

  useEffect(() => {
    if (details) {
      form.reset(details)
    }
  }, [details])

  const isLoading = form.formState.isSubmitting
  const subAccountType = form.watch('subAccountType')
  //CHALLENGE Create this form.
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-4xl font-black text-foreground tracking-tight">Sub Account Information</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">Please enter business details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subAccountLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Account Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subAccountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Subaccount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold">
                        <SelectValue placeholder="Select a subaccount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY">Agency</SelectItem>
                      <SelectItem value="TEAM">Team</SelectItem>
                      <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                      <SelectItem value="ORGANIZATION">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {['AGENCY', 'ORGANIZATION'].includes(subAccountType) && (
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                      {subAccountType === 'TEAM' ? 'Team Name' : 'Account Name'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Your agency name"
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Acount Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Acount Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        required
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Address</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="123 st..."
                      className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">City</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="City"
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">State</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="State"
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Zipcpde</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Zipcode"
                        className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Country</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Country"
                      className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-[22px] bg-primary text-primary-foreground font-black text-base uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group"
            >
              {isLoading ? <Loading /> : 'Save Account Information'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SubAccountDetails
