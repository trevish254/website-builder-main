'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Loading from '@/components/global/loading'
import { CreditCard, ShieldCheck } from 'lucide-react'

const FormSchema = z.object({
    name: z.string().min(2, { message: 'Full name is required.' }),
    email: z.string().email({ message: 'Valid email is required.' }),
    phone: z.string().min(1, { message: 'Phone number is required.' }),
})

type Props = {
    user: any
    agency: any
    plan: any
}

const AgencyPaymentForm = ({ user, agency, plan }: Props) => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user?.name || agency?.name || '',
            email: agency?.companyEmail || user?.email || '',
            phone: agency?.companyPhone || '',
        },
    })

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/paystack/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    planCode: plan.paystackPlanCode || plan.priceId,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.authorization_url) {
                throw new Error(data.message || 'Failed to initialize payment')
            }

            // Redirect to Paystack checkout
            window.location.href = data.authorization_url
        } catch (error: any) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Payment failed',
                description: error.message || 'Could not initiate payment. Please try again later.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border-none shadow-2xl bg-card/50 backdrop-blur-md rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight">Payment Details</CardTitle>
                </div>
                <CardDescription className="text-base">
                    Verify your billing information to proceed with the secure payment.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your full name"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Billing Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="email@example.com"
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Phone"
                                            className="h-14 rounded-2xl border-border focus:ring-primary/20 bg-muted/20 font-bold"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-2 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <p className="text-sm text-emerald-700 font-medium">
                                Secure SSL Encrypted Payment
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? <Loading /> : `Pay ${plan.price} Now`}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground font-medium">
                            Powered by Paystack
                        </p>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default AgencyPaymentForm
