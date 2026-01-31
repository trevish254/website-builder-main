'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import {
    Form,
    FormControl,
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
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { TeamFormSchema } from '@/lib/types'
import { upsertAgencyTeam } from '@/lib/queries'
import { toast } from '../ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 } from 'uuid'

interface TeamDetailsProps {
    agencyId: string
    defaultData?: any
    onUpdate?: () => void
}

const TeamDetails: React.FC<TeamDetailsProps> = ({
    agencyId,
    defaultData,
    onUpdate,
}) => {
    const { setClose } = useModal()
    const router = useRouter()

    const form = useForm<z.infer<typeof TeamFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(TeamFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            description: defaultData?.description || '',
            icon: defaultData?.icon || 'users',
            color: defaultData?.color || '#3b82f6',
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                name: defaultData.name || '',
                description: defaultData.description || '',
                icon: defaultData.icon || 'users',
                color: defaultData.color || '#3b82f6',
            })
        }
    }, [defaultData, form])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof TeamFormSchema>) => {
        console.log('📝 Submitting team form:', { values, agencyId })
        try {
            const teamData: any = {
                ...values,
                agencyId,
            }

            // Only include id if we are editing
            if (defaultData?.id) {
                teamData.id = defaultData.id
            }

            const { data, error: serverError } = await upsertAgencyTeam(teamData)

            if (data) {
                toast({
                    title: 'Success',
                    description: 'Team saved successfully',
                })
                if (onUpdate) onUpdate()
                router.refresh()
                setClose()
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: serverError || 'Could not save team details',
                })
            }
        } catch (error) {
            console.error('Error saving team:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save team details',
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Design Team, Sales A"
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
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="What does this team do?"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Icon</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select icon" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="users text-blue-500">Users</SelectItem>
                                            <SelectItem value="shield text-amber-500">Shield</SelectItem>
                                            <SelectItem value="message-square text-green-500">Chat</SelectItem>
                                            <SelectItem value="zap text-purple-500">Fast</SelectItem>
                                            <SelectItem value="target text-red-500">Goal</SelectItem>
                                            <SelectItem value="rocket text-orange-500">Launch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Team Color</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 h-10 p-1 rounded-lg overflow-hidden border-none"
                                                {...field}
                                            />
                                            <Input
                                                placeholder="#000000"
                                                {...field}
                                                className="uppercase"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        className="w-full"
                        disabled={isLoading}
                        type="submit"
                    >
                        {form.formState.isSubmitting ? <Loading /> : 'Save Team Details'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default TeamDetails
