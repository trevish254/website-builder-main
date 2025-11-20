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
  //CHALLENGE Create this form.
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sub Account Information</CardTitle>
        <CardDescription>Please enter business details</CardDescription>
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
                  <FormLabel>Account Logo</FormLabel>
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
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input
                        required
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
                    <FormLabel>Acount Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
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
                    <FormLabel>Acount Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        required
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      required
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
                        required
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
                        required
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
                        required
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
                      required
                      placeholder="Country"
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
