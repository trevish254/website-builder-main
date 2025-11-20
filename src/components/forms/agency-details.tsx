'use client'
import { Agency } from '@prisma/client'
import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { NumberInput } from '@tremor/react'
import { v4 } from 'uuid'
import { useUser } from '@clerk/nextjs'

import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
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
} from '../ui/form'
import { useToast } from '../ui/use-toast'

import * as z from 'zod'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from '@/lib/queries'
import { Button } from '../ui/button'
import Loading from '../global/loading'

type Props = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Agency name must be atleast 2 chars.' }),
  companyEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  companyPhone: z.string().min(1, { message: 'Phone number is required.' }),
  whiteLabel: z.boolean(),
  address: z.string().min(1, { message: 'Address is required.' }),
  city: z.string().min(1, { message: 'City is required.' }),
  zipCode: z.string().min(1, { message: 'Zip code is required.' }),
  state: z.string().min(1, { message: 'State is required.' }),
  country: z.string().min(1, { message: 'Country is required.' }),
  agencyLogo: z.string().optional(),
})

const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useUser()
  const [deletingAgency, setDeletingAgency] = useState(false)
  // Get email from user or data, with fallback
  const defaultEmail = data?.companyEmail || user?.emailAddresses[0]?.emailAddress || ''
  
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || '',
      companyEmail: defaultEmail,
      companyPhone: data?.companyPhone || '',
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || '',
      city: data?.city || '',
      zipCode: data?.zipCode || '',
      state: data?.state || '',
      country: data?.country || '',
      agencyLogo: data?.agencyLogo || '',
    },
  })
  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data])

  // Ensure email is always set from user if not in data
  useEffect(() => {
    const currentEmail = form.getValues('companyEmail')
    const userEmail = user?.emailAddresses[0]?.emailAddress
    
    if (userEmail && (!currentEmail || currentEmail.trim() === '')) {
      console.log('📧 Setting company email from user:', userEmail)
      form.setValue('companyEmail', userEmail, { shouldValidate: true })
    }
  }, [user, form])

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      // Get actual form values as fallback (in case values param is empty)
      const formValues = form.getValues()
      console.log('📥 Form submitted with values param:', values)
      console.log('📥 Form getValues():', formValues)
      
      // Use form.getValues() if values param seems empty
      const actualValues = (values.name && values.name.trim() !== '') 
        ? values 
        : formValues

      console.log('📊 Using actual values:', actualValues)
      console.log('📊 Form state:', {
        isValid: form.formState.isValid,
        errors: form.formState.errors,
      })

      // Ensure email is set from user if not provided
      const finalEmail = actualValues.companyEmail || user?.emailAddresses[0]?.emailAddress || ''
      if (!finalEmail) {
        toast({
          variant: 'destructive',
          title: 'Email Required',
          description: 'Please provide an agency email address.',
        })
        return
      }

      // Validate that required fields are not empty
      if (!actualValues.name || actualValues.name.trim() === '') {
        console.error('❌ Name is empty!', { 
          valuesParam: values.name, 
          formValues: formValues.name,
          actualValues: actualValues.name 
        })
        toast({
          variant: 'destructive',
          title: 'Agency Name Required',
          description: 'Please enter an agency name in the form field.',
        })
        form.setFocus('name')
        return
      }

      // Update values with final email
      const finalValues = {
        ...actualValues,
        companyEmail: finalEmail,
      }

      console.log('🚀 Starting agency creation/update process...')
      console.log('📝 Agency data:', finalValues)
      console.log('📋 Field values:', {
        name: finalValues.name,
        email: finalValues.companyEmail,
        phone: finalValues.companyPhone,
        address: finalValues.address,
        city: finalValues.city,
        state: finalValues.state,
        zipCode: finalValues.zipCode,
        country: finalValues.country,
      })

      // Show loading state
      toast({
        title: data?.id ? 'Updating Agency...' : 'Creating Agency...',
        description: 'Please wait while we save your changes.',
      })
      
      // If updating existing agency, just update the details
      if (data?.id) {
        console.log('📝 Updating existing agency:', data.id)
        
        const updateData = {
          name: finalValues.name,
          companyEmail: finalValues.companyEmail,
          companyPhone: finalValues.companyPhone,
          address: finalValues.address,
          city: finalValues.city,
          state: finalValues.state,
          zipCode: finalValues.zipCode,
          country: finalValues.country,
          agencyLogo: finalValues.agencyLogo || data.agencyLogo || '/placeholder-logo.png',
          whiteLabel: finalValues.whiteLabel,
          updatedAt: new Date(),
        }
        
        console.log('🔄 Update data:', updateData)
        
        const updated = await updateAgencyDetails(data.id, updateData)
        
        if (updated) {
          console.log('✅ Agency updated successfully:', updated)
          toast({
            title: 'Agency Updated',
            description: 'Your agency details have been saved successfully!',
          })
          // Refresh the page to show updated logo
          router.refresh()
          return
        } else {
          console.log('⚠️ Agency update returned null')
          toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update your agency. Please try again.',
          })
        }
        return
      }
      
      // For new agency creation
      // M-Pesa profile information (no Stripe needed)
      const mpesaProfile = {
        phoneNumber: finalValues.companyPhone,
        businessName: finalValues.name,
        location: `${finalValues.city}, ${finalValues.state}, ${finalValues.country}`,
        address: finalValues.address,
        zipCode: finalValues.zipCode,
        email: finalValues.companyEmail,
      }
      
      console.log('📱 M-Pesa Profile Info:', mpesaProfile)
      
      // Generate a simple customer ID based on phone number
      // Safety check: ensure companyPhone exists before calling replace
      const phoneNumber = finalValues.companyPhone || ''
      const custId = `mpesa_${phoneNumber.replace(/\D/g, '')}_${Date.now()}`

      const agencyId = v4()
      const agencyData = {
        id: agencyId,
        customerId: custId,
        address: finalValues.address || '',
        agencyLogo: finalValues.agencyLogo || '/placeholder-logo.png',
        city: finalValues.city || '',
        companyPhone: finalValues.companyPhone || '',
        country: finalValues.country || '',
        name: finalValues.name || '',
        state: finalValues.state || '',
        whiteLabel: finalValues.whiteLabel || false,
        zipCode: finalValues.zipCode || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyEmail: finalValues.companyEmail, // This should always be set now
        connectAccountId: '',
        goal: 5,
      }

      console.log('🏢 Attempting to save agency to database...')
      console.log('📊 Agency data to save:', agencyData)
      console.log('📧 Company Email check:', {
        hasCompanyEmail: !!agencyData.companyEmail,
        companyEmailValue: agencyData.companyEmail,
        companyEmailType: typeof agencyData.companyEmail,
        companyEmailLength: agencyData.companyEmail?.length,
      })
      
      // Double-check that companyEmail is present
      if (!agencyData.companyEmail || agencyData.companyEmail.trim() === '') {
        console.error('❌ Company email is missing or empty in agencyData!')
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Company email is required. Please check the email field.',
        })
        return
      }
      
      const response = await upsertAgency(agencyData)

      if (response) {
        console.log('✅ Agency saved successfully:', response)
        toast({
          title: 'Created Agency',
          description: 'Agency created successfully and saved to database!',
        })
        // Redirect to the agency dashboard
        router.refresh() // Refresh to get updated user data
        return router.push(`/agency/${agencyId}`)
      } else {
        console.log('⚠️ Agency creation returned null')
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: 'Could not create your agency. Please check your database connection and try again.',
        })
      }
    } catch (error: any) {
      console.error('❌ Agency creation error:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: `Could not save your agency: ${errorMessage}. Please check your database setup.`,
      })
    }
  }
  const handleDeleteAgency = async () => {
    if (!data?.id) return
    setDeletingAgency(true)
    //WIP: discontinue the subscription
    try {
      const response = await deleteAgency(data.id)
      toast({
        title: 'Deleted Agency',
        description: 'Deleted your agency and all subaccounts',
      })
      router.refresh()
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'could not delete your agency ',
      })
    }
    setDeletingAgency(false)
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings
            later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo (Optional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    {!field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange('/placeholder-logo.png')}
                        className="mt-2"
                      >
                        Skip Logo (Use Default)
                      </Button>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your agency name"
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
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={user?.emailAddresses[0]?.emailAddress || "agency@example.com"}
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
                      <FormLabel>Agency Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone"
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
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                      <div>
                        <FormLabel>Whitelabel Agency</FormLabel>
                        <FormDescription>
                          Turning on whilelabel mode will show your agency logo
                          to all sub accounts by default. You can overwrite this
                          functionality through sub account settings.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 st..."
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
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
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
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State"
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
                      <FormLabel>Zipcpde</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Zipcode"
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
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return
                      await updateAgencyDetails(data.id, { goal: val })
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Updated the agency goal to | ${val} Sub Account`,
                        subaccountId: undefined,
                      })
                      router.refresh()
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : 'Save Agency Information'}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="text-muted-foreground">
                Deleting your agency cannpt be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? 'Deleting...' : 'Delete Agency'}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails
