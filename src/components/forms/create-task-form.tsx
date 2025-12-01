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
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { Task } from '@/lib/database.types'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { CreateTaskFormSchema } from '@/lib/types'
import { upsertTask } from '@/lib/actions/tasks'
import { toast } from '../ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { v4 } from 'uuid'

interface CreateTaskFormProps {
    defaultData?: Task
    laneId: string
    subAccountUsers?: { id: string; name: string; avatarUrl: string }[]
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
    defaultData,
    laneId,
    subAccountUsers = [],
}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateTaskFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateTaskFormSchema),
        defaultValues: {
            title: defaultData?.title || '',
            description: defaultData?.description || '',
            dueDate: defaultData?.dueDate ? new Date(defaultData.dueDate) : undefined,
            assignedUserId: defaultData?.assignedUserId || '',
            laneId: laneId,
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                title: defaultData.title || '',
                description: defaultData.description || '',
                dueDate: defaultData.dueDate ? new Date(defaultData.dueDate) : undefined,
                assignedUserId: defaultData.assignedUserId || '',
                laneId: laneId,
            })
        }
    }, [defaultData, laneId, form])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof CreateTaskFormSchema>) => {
        if (!laneId) return
        try {
            const response = await upsertTask({
                ...values,
                id: defaultData?.id || v4(),
                laneId: values.laneId,
                order: defaultData?.order,
                dueDate: values.dueDate?.toISOString(),
            })

            if (response.error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: response.error,
                })
                return
            }

            toast({
                title: 'Success',
                description: 'Task saved successfully',
            })

            router.refresh()
            setClose()
        } catch (error) {
            console.error('Error saving task:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save task details',
            })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Task Title"
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
                                            placeholder="Task Description"
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
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date('1900-01-01')
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="assignedUserId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assign To</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a team member" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subAccountUsers.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    <div className="flex items-center gap-2">
                                                        {/* Avatar could go here */}
                                                        {user.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className="w-20 mt-4"
                            disabled={isLoading}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? <Loading /> : 'Save'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateTaskForm
