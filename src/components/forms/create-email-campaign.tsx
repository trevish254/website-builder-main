'use client'
import React from 'react'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { upsertEmailCampaign } from '@/lib/email-queries'
import { toast } from '@/components/ui/use-toast'

const formSchema = z.object({
    name: z.string().min(1, 'Campaign name is required'),
    subject: z.string().min(1, 'Subject line is required'),
})

type Props = {
    subaccountId: string
}

const CreateEmailCampaignForm = ({ subaccountId }: Props) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await upsertEmailCampaign({
                id: v4(),
                name: values.name,
                subject: values.subject,
                subAccountId: subaccountId,
                status: 'DRAFT',
                content: JSON.stringify([
                    {
                        content: [],
                        id: '__body',
                        name: 'Body',
                        styles: {
                            backgroundColor: 'white',
                            width: '100%',
                        },
                        type: '__body',
                    },
                ]),
            })

            toast({
                title: 'Success',
                description: 'Campaign created successfully',
            })

            router.push(`/subaccount/${subaccountId}/campaigns/builder/email-builder/${response.id}`)
        } catch (error) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not create campaign',
            })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Email Campaign Details</CardTitle>
                <CardDescription>
                    Enter the details for your new email campaign.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Campaign Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Summer Sale 2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Subject</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Exclusive Deals Just for You!" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create & Design'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateEmailCampaignForm
