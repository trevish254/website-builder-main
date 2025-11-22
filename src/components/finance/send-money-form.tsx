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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sendMoney } from '@/lib/actions/finance'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Send } from 'lucide-react'

const SendMoneySchema = z.object({
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    description: z.string().optional(),
    type: z.enum(['B2C', 'B2B']),
})

type Props = {
    agencyId?: string
    subAccountId?: string
}

const SendMoneyForm = ({ agencyId, subAccountId }: Props) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof SendMoneySchema>>({
        resolver: zodResolver(SendMoneySchema),
        defaultValues: {
            amount: 0,
            phoneNumber: '',
            description: '',
            type: 'B2C',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof SendMoneySchema>) => {
        try {
            await sendMoney({
                ...values,
                agencyId,
                subAccountId,
            })
            toast.success('Transaction initiated successfully')
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error('Failed to initiate transaction')
            console.error(error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>
                    Disburse funds to a phone number (B2C) or business (B2B).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="B2C">B2C (Mobile Number)</SelectItem>
                                                <SelectItem value="B2B">B2B (Business Paybill/Till)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient Phone / Paybill</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2547..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                        <Input placeholder="Payment for services" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Funds
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SendMoneyForm
