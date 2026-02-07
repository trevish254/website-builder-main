'use client'

import React, { useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    CheckCircle2,
    Mail,
    Globe,
    User,
    Archive,
    ShoppingBag,
    ExternalLink,
    X
} from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { upsertContact, saveActivityLogsNotification } from '@/lib/queries'
import { toast } from '@/components/ui/use-toast'
import Loading from '@/components/global/loading'
import { format } from 'date-fns'

const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    country: z.string().optional(),
    username: z.string().optional(),
})

interface CustomerDetailFormProps {
    subaccountId: string
    customer?: any
}

const CustomerDetailForm = ({ subaccountId, customer }: CustomerDetailFormProps) => {
    const { setClose } = useModal()
    const router = useRouter()

    // Split name for the form
    const nameParts = customer?.name?.split(' ') || ['', '']
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName,
            lastName,
            email: customer?.email || '',
            country: 'United States',
            username: customer?.email?.split('@')[0] || '',
        },
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const fullName = `${values.firstName} ${values.lastName}`
            const response = await upsertContact({
                id: customer?.id?.startsWith('temp-') ? undefined : customer?.id,
                name: fullName,
                email: values.email,
                subAccountId: subaccountId,
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated customer profile | ${fullName}`,
                subaccountId: subaccountId,
            })

            toast({
                title: 'Success',
                description: 'Customer profile updated successfully',
            })

            setClose()
            router.refresh()
        } catch (error) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not update customer profile',
            })
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header / Profile Summary */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 border-2 border-primary/10">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                                {form.watch('firstName')?.[0]?.toUpperCase()}{form.watch('lastName')?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                            <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {form.watch('firstName')} {form.watch('lastName')}
                            </h2>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 font-bold px-2 py-0">
                                {customer?.orderCount > 0 ? 'Subscribed' : 'Lead'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer?.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-bold text-slate-600">
                        <Archive size={14} /> Archive
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 font-bold text-slate-600">
                        View orders
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] items-center gap-1 uppercase tracking-wider text-muted-foreground font-bold">First seen</span>
                    <span className="text-sm font-bold">{format(new Date(customer?.createdAt || new Date()), 'd MMM, yyyy')}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">First purchase</span>
                    <span className="text-sm font-bold">{customer?.lastOrderDate ? format(new Date(customer.lastOrderDate), 'd MMM, yyyy') : 'No orders'}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Revenue</span>
                    <span className="text-sm font-bold">${customer?.totalSpent?.toLocaleString() || '0.00'}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">MRR</span>
                    <span className="text-sm font-bold">$0.00</span>
                </div>
            </div>

            {/* Form Fields */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-500 uppercase">Email address</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input {...field} className="pl-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                                    </div>
                                </FormControl>
                                <div className="flex items-center gap-2 mt-1.5 ml-1">
                                    <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500 text-white" />
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">Verified 2 Jan, 2025</span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-500 uppercase">Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-slate-400" />
                                                <SelectValue placeholder="Select a country" />
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="United States">United States</SelectItem>
                                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                        <SelectItem value="Canada">Canada</SelectItem>
                                        <SelectItem value="Germany">Germany</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-500 uppercase">Username</FormLabel>
                                <FormControl>
                                    <div className="flex items-stretch rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <div className="bg-slate-50 dark:bg-slate-900 px-3 flex items-center text-xs text-slate-500 border-r border-slate-200 dark:border-slate-800 font-medium whitespace-nowrap">
                                            untitledui.com/
                                        </div>
                                        <div className="relative flex-1">
                                            <Input
                                                {...field}
                                                className="border-none rounded-none focus-visible:ring-0 bg-white dark:bg-slate-950"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setClose()}
                            className="font-bold px-6 border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="font-bold px-6 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loading /> : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CustomerDetailForm
