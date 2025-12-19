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
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { saveActivityLogsNotification, sendInvitation } from '@/lib/queries'
import { useToast } from '../ui/use-toast'
import emailjs from '@emailjs/browser'
import { Mail, Send } from 'lucide-react'

interface SendInvitationProps {
  agencyId: string
}

const SendInvitation: React.FC<SendInvitationProps> = ({ agencyId }) => {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const userDataSchema = z.object({
    email: z.string().email(),
    role: z.enum(['AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']),
    name: z.string().min(1, "Name is required"),
    message: z.string().optional(),
  })

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      role: 'SUBACCOUNT_USER',
      name: '',
      message: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    setIsSending(true)
    try {
      // 1. Create invitation in DB
      const res = await sendInvitation(values.role, values.email, agencyId)

      await saveActivityLogsNotification({
        agencyId: agencyId,
        description: `Invited ${res.email}`,
        subaccountId: undefined,
      })

      // 2. Generate Invite Link
      const baseUrl = window.location.origin
      const invitationLink = `${baseUrl}/agency/sign-up?email=${encodeURIComponent(res.email)}&invitation=${res.id}`

      // 3. Send Email via EmailJS
      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

      if (!serviceID || !templateID || !publicKey) {
        throw new Error('EmailJS configuration is missing')
      }

      const templateParams = {
        to_email: values.email,
        from_name: values.name,
        role: values.role,
        message: values.message || "You have been invited to join the team.",
        link: invitationLink,
      }

      await emailjs.send(serviceID, templateID, templateParams, publicKey)

      toast({
        title: 'Success',
        description: 'Invitation sent successfully via EmailJS',
      })

      form.reset()

    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not send invitation',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary" />
          Send Invitation
        </CardTitle>
        <CardDescription>
          Invite a new team member. They will receive an email with a unique link to join.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                disabled={isSending}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isSending}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="colleague@example.com"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isSending}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isSending}
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Personal Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hey, I'd like to invite you to join our agency..."
                      {...field}
                      className="bg-background resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSending}
              type="submit"
              className="w-full md:w-auto md:self-end bg-primary hover:bg-primary/90 transition-all"
            >
              {isSending ? (
                <>
                  <Loading /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Send Invitation
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SendInvitation
