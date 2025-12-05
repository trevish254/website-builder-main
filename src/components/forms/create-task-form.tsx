'use client'
import React, { useEffect, useState } from 'react'
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
import { Task, TaskLane } from '@/lib/database.types'
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
import FileUpload from '../global/file-upload'

interface CreateTaskFormProps {
    defaultData?: Task
    laneId: string
    subAccountUsers?: { id: string; name: string; avatarUrl: string }[]
    lanes?: TaskLane[]
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
    defaultData,
    laneId,
    subAccountUsers = [],
    lanes = [],
}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const [taskImage, setTaskImage] = useState<string>(defaultData?.coverImage || '')

    const form = useForm<z.infer<typeof CreateTaskFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateTaskFormSchema),
        defaultValues: {
            title: defaultData?.title || '',
            description: defaultData?.description || '',
            dueDate: defaultData?.dueDate ? new Date(defaultData.dueDate) : undefined,
            assignedUserId: defaultData?.assignedUserId || '',
            assignees: [], // TODO: Load existing assignees
            laneId: laneId,
            priority: defaultData?.priority || 'Medium',
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                title: defaultData.title || '',
                description: defaultData.description || '',
                dueDate: defaultData.dueDate ? new Date(defaultData.dueDate) : undefined,
                assignedUserId: defaultData.assignedUserId || '',
                assignees: [], // TODO: Load existing assignees
                laneId: laneId,
                priority: defaultData.priority || 'Medium',
            })
            setTaskImage(defaultData.coverImage || '')
        }
    }, [defaultData, laneId, form])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof CreateTaskFormSchema>) => {
        if (!values.laneId) return
        try {
            const response = await upsertTask({
                ...values,
                id: defaultData?.id || v4(),
                assignedUserId: values.assignedUserId === '' ? null : values.assignedUserId,
                laneId: values.laneId,
                order: defaultData?.order,
                dueDate: values.dueDate?.toISOString(),
                coverImage: taskImage,
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
                        <FormItem>
                            <FormLabel>Task Cover Image</FormLabel>
                            <div className="flex flex-col gap-2">
                                <FileUpload
                                    apiEndpoint="media"
                                    value={taskImage}
                                    onChange={(url) => setTaskImage(url || '')}
                                />
                            </div>
                        </FormItem>

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
                            name="assignees"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Assign To</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value?.length && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value && field.value.length > 0
                                                        ? `${field.value.length} selected`
                                                        : "Select team members"}
                                                    <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="p-2 border-b">
                                                <Input
                                                    placeholder="Search team members..."
                                                    className="h-8"
                                                    onChange={(e) => {
                                                        // Simple filter implementation if needed, or rely on Command
                                                    }}
                                                />
                                            </div>
                                            <div className="max-h-[200px] overflow-y-auto p-1">
                                                {subAccountUsers.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className={cn(
                                                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                                            field.value?.includes(user.id) ? "bg-accent text-accent-foreground" : ""
                                                        )}
                                                        onClick={() => {
                                                            const current = field.value || []
                                                            const updated = current.includes(user.id)
                                                                ? current.filter((id) => id !== user.id)
                                                                : [...current, user.id]
                                                            field.onChange(updated)
                                                        }}
                                                    >
                                                        <div className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            field.value?.includes(user.id)
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50 [&_svg]:invisible"
                                                        )}>
                                                            <svg
                                                                className={cn("h-4 w-4")}
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <span>{user.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="laneId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lane</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a lane" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {lanes.map((lane) => (
                                                <SelectItem key={lane.id} value={lane.id}>
                                                    {lane.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
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
