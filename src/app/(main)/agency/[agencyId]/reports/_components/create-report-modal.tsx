'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Building2, Calendar, FileText, Eye, Sparkles } from 'lucide-react'

const formSchema = z.object({
    name: z.string().min(2, { message: 'Report name must be at least 2 characters.' }),
    description: z.string().optional(),
    type: z.string({ required_error: 'Please select a report type.' }),
    subaccountId: z.string({ required_error: 'Please select a client/subaccount.' }),
    template: z.string().optional(),
    clientVisible: z.boolean().default(false),
})

interface CreateReportModalProps {
    isOpen: boolean
    onClose: () => void
    agencyId: string
    subaccounts?: Array<{ id: string; name: string; companyLogo?: string }>
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
    isOpen,
    onClose,
    agencyId,
    subaccounts = []
}) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            clientVisible: false,
        },
    })

    const isLoading = form.formState.isSubmitting
    const selectedType = form.watch('type')
    const selectedSubaccount = form.watch('subaccountId')

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // In a real app, this would be an API call to create the report
            console.log('Creating report:', values)

            toast({
                title: 'Report Created',
                description: `"${values.name}" has been successfully created.`,
            })

            onClose()
            // Simulate navigation to the new report
            router.push(`/agency/${agencyId}/reports/new-report-id`)

        } catch (error) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something went wrong. Please try again.',
            })
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Daily': return '📅'
            case 'Weekly': return '📊'
            case 'Monthly': return '📈'
            case 'Custom': return '⚙️'
            default: return '📄'
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" data-lenis-prevent>
                <DialogHeader className="space-y-3 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl">Create New Report</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Configure the details for your new performance report.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        {/* Client/Subaccount Selection - PROMINENT */}
                        <FormField
                            control={form.control}
                            name="subaccountId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Select Client
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 border-2 hover:border-blue-400 transition-colors">
                                                <SelectValue placeholder="Choose a client for this report" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subaccounts.length > 0 ? (
                                                subaccounts.map((subaccount) => (
                                                    <SelectItem
                                                        key={subaccount.id}
                                                        value={subaccount.id}
                                                        className="py-3"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                                                                <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                            </div>
                                                            <span className="font-medium">{subaccount.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="demo" className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center">
                                                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <span className="font-medium">Demo Client</span>
                                                    </div>
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="flex items-center gap-1.5 text-xs">
                                        <FileText className="w-3 h-3" />
                                        Report data will be pulled from the selected client's account
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Report Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Report Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Monthly SEO Performance"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type and Template Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                                            <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                            Report Type
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Daily" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>📅</span>
                                                        <span>Daily</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Weekly" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>📊</span>
                                                        <span>Weekly</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Monthly" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>📈</span>
                                                        <span>Monthly</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Custom" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>⚙️</span>
                                                        <span>Custom Range</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="template"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Template</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="No template" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400">—</span>
                                                        <span>Blank Report</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="standard_seo" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>🔍</span>
                                                        <span>Standard SEO</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="ppc_performance" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>💰</span>
                                                        <span>PPC Performance</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="social_media" className="py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span>📱</span>
                                                        <span>Social Media</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add a brief description or notes for this report..."
                                            className="resize-none h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Client Visible Toggle */}
                        <FormField
                            control={form.control}
                            name="clientVisible"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 p-4 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-900/50 dark:to-transparent">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            Client Visible
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            Allow clients to view this report in their portal.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Preview Info */}
                        {(selectedType || selectedSubaccount) && (
                            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                            Report Preview
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedType && (
                                                <Badge className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                                    {getTypeIcon(selectedType)} {selectedType}
                                                </Badge>
                                            )}
                                            {selectedSubaccount && (
                                                <Badge className="bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                                    <Building2 className="w-3 h-3 mr-1" />
                                                    Client Selected
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="gap-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="min-w-24">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="min-w-32 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Create Report
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
