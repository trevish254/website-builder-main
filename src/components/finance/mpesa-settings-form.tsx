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
import { saveMpesaSettings } from '@/lib/actions/finance'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const MpesaSettingsSchema = z.object({
    shortCode: z.string().min(1, 'Shortcode is required'),
    consumerKey: z.string().min(1, 'Consumer Key is required'),
    consumerSecret: z.string().min(1, 'Consumer Secret is required'),
    passkey: z.string().optional(),
    environment: z.enum(['SANDBOX', 'PRODUCTION']),
    callbackUrl: z.string().optional(),
})

type Props = {
    agencyId?: string
    subAccountId?: string
    defaultValues?: Partial<z.infer<typeof MpesaSettingsSchema>>
}

const MpesaSettingsForm = ({ agencyId, subAccountId, defaultValues }: Props) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof MpesaSettingsSchema>>({
        resolver: zodResolver(MpesaSettingsSchema),
        defaultValues: {
            shortCode: defaultValues?.shortCode || '',
            consumerKey: defaultValues?.consumerKey || '',
            consumerSecret: defaultValues?.consumerSecret || '',
            passkey: defaultValues?.passkey || '',
            environment: defaultValues?.environment || 'SANDBOX',
            callbackUrl: defaultValues?.callbackUrl || '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof MpesaSettingsSchema>) => {
        try {
            await saveMpesaSettings({
                ...values,
                agencyId,
                subAccountId,
            })
            toast.success('MPESA settings saved successfully')
            router.refresh()
        } catch (error) {
            toast.error('Failed to save MPESA settings')
            console.error(error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>MPESA Configuration</CardTitle>
                <CardDescription>
                    Enter your Daraja API credentials here. These are required for all MPESA transactions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="environment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Environment</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select environment" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SANDBOX">Sandbox (Testing)</SelectItem>
                                                <SelectItem value="PRODUCTION">Production (Live)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="shortCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Shortcode (Paybill/Till)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="174379" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="consumerKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Consumer Key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Consumer Key" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="consumerSecret"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Consumer Secret</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter Consumer Secret" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="passkey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Passkey (Stk Push)</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter Passkey" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Required for STK Push simulation in Sandbox.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="callbackUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Callback URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://your-domain.com/api/mpesa/callback" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Override the default callback URL if needed.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default MpesaSettingsForm
