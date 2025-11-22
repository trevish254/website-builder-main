'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requestStkPush } from '@/lib/actions/finance'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Smartphone } from 'lucide-react'

const ReceiveMoneySchema = z.object({
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    description: z.string().optional(),
})

type Props = {
    agencyId?: string
    subAccountId?: string
}

const ReceiveMoneyForm = ({ agencyId, subAccountId }: Props) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof ReceiveMoneySchema>>({
        resolver: zodResolver(ReceiveMoneySchema),
        defaultValues: {
            amount: 0,
            phoneNumber: '',
            description: '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof ReceiveMoneySchema>) => {
        try {
            await requestStkPush({
                ...values,
                agencyId,
                subAccountId,
            })
            toast.success('STK Push sent to phone')
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error('Failed to send STK Push')
            console.error(error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Receive Money (STK Push)</CardTitle>
                <CardDescription>
                    Trigger an MPESA STK Push prompt to a customer's phone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2547..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Payment for goods" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Smartphone className="mr-2 h-4 w-4" />}
                            Request Payment
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ReceiveMoneyForm
