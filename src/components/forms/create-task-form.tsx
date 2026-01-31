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
import { CalendarIcon, Users, CheckCircle2, Clock, Flag, Layers, FileIcon, MessageSquare, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { v4 } from 'uuid'
import FileUpload from '../global/file-upload'

interface CreateTaskFormProps {
    defaultData?: Task
    laneId: string
    subAccountUsers?: { id: string; name: string; avatarUrl: string }[]
    lanes?: TaskLane[]
    teams?: any[]
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
    defaultData,
    laneId,
    subAccountUsers = [],
    lanes = [],
    teams = [],
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
            teamId: (defaultData as any)?.teamId || '',
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
                teamId: (defaultData as any)?.teamId || '',
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
                order: defaultData?.order || 0,
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
        <div className="flex flex-col bg-transparent">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
                        {/* Left Side: Content (8/12) */}
                        <div className="md:col-span-8 p-6 py-4 space-y-4 border-r border-neutral-100/50 dark:border-neutral-900/50">
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <Input
                                                placeholder="Task Title"
                                                className="text-2xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 bg-transparent h-auto py-1"
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
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2 text-neutral-400">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Description</span>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief description..."
                                                className="min-h-[120px] text-sm border-none px-0 focus-visible:ring-0 resize-none bg-transparent placeholder:text-neutral-400 leading-relaxed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3 pt-4 border-t border-neutral-100/50 dark:border-neutral-900/50">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <FileIcon className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Cover Image</span>
                                </div>
                                <div className="bg-neutral-100/30 dark:bg-neutral-900/30 rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-800/50">
                                    <FileUpload
                                        apiEndpoint="media"
                                        value={taskImage}
                                        onChange={(url) => setTaskImage(url || '')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Sidebar (4/12) */}
                        <div className="md:col-span-4 p-6 py-4 flex flex-col justify-between">
                            <div className="space-y-5">
                                <div className="space-y-5">
                                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Metadata</h3>

                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <div className="flex items-center gap-2 text-neutral-500 group">
                                                    <Flag className="w-4 h-4" />
                                                    <FormLabel className="text-xs font-semibold">Priority</FormLabel>
                                                </div>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-10 shadow-sm">
                                                            <SelectValue placeholder="Set priority" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Low">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                Low
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="Medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                                                Medium
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="High">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                                                High
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <div className="flex items-center gap-2 text-neutral-500">
                                                    <Clock className="w-4 h-4" />
                                                    <FormLabel className="text-xs font-semibold">Due Date</FormLabel>
                                                </div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full justify-start text-left font-medium bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-10 shadow-sm',
                                                                    !field.value && 'text-muted-foreground'
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4 opacity-50 text-blue-500" />
                                                                {field.value ? (
                                                                    format(field.value, 'PPP')
                                                                ) : (
                                                                    <span>No deadline set</span>
                                                                )}
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
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="assignees"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <div className="flex items-center gap-2 text-neutral-500">
                                                    <Users className="w-4 h-4" />
                                                    <FormLabel className="text-xs font-semibold">Assignees</FormLabel>
                                                </div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start text-left font-medium bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-10 shadow-sm",
                                                                    !field.value?.length && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <div className="flex -space-x-2 mr-3 pointer-events-none">
                                                                    {field.value && field.value.length > 0 ? (
                                                                        field.value.slice(0, 3).map((id) => {
                                                                            const user = subAccountUsers.find(u => u.id === id)
                                                                            return user ? (
                                                                                <img
                                                                                    key={id}
                                                                                    src={user.avatarUrl}
                                                                                    className="w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900"
                                                                                    alt=""
                                                                                />
                                                                            ) : null
                                                                        })
                                                                    ) : (
                                                                        <Users className="w-4 h-4 opacity-30" />
                                                                    )}
                                                                </div>
                                                                {field.value && field.value.length > 0
                                                                    ? `${field.value.length} members`
                                                                    : "Add members"}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[300px] p-0" align="start">
                                                        <div className="p-3 border-b">
                                                            <Input
                                                                placeholder="Search team..."
                                                                className="h-9 focus-visible:ring-1"
                                                            />
                                                        </div>
                                                        <div className="max-h-[250px] overflow-y-auto p-1">
                                                            {subAccountUsers.map((user) => (
                                                                <div
                                                                    key={user.id}
                                                                    className={cn(
                                                                        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all",
                                                                        field.value?.includes(user.id) ? "bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400" : ""
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
                                                                        "mr-3 flex h-4 w-4 items-center justify-center rounded-md border transition-all",
                                                                        field.value?.includes(user.id)
                                                                            ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20"
                                                                            : "border-neutral-200 dark:border-neutral-700"
                                                                    )}>
                                                                        {field.value?.includes(user.id) && <CheckCircle2 className="h-3 w-3" />}
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <img src={user.avatarUrl} className="w-6 h-6 rounded-full" alt="" />
                                                                        <span className="font-medium">{user.name}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="laneId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <div className="flex items-center gap-2 text-neutral-500">
                                                    <Layers className="w-4 h-4" />
                                                    <FormLabel className="text-xs font-semibold">Section</FormLabel>
                                                </div>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-10 shadow-sm">
                                                            <SelectValue placeholder="Select section" />
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
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="teamId"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <div className="flex items-center gap-2 text-neutral-500">
                                                    <Users className="w-4 h-4" />
                                                    <FormLabel className="text-xs font-semibold">Team Assignment</FormLabel>
                                                </div>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 h-10 shadow-sm">
                                                            <SelectValue placeholder="Select team" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">No Team</SelectItem>
                                                        {teams.map((team) => (
                                                            <SelectItem key={team.id} value={team.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="w-2 h-2 rounded-full"
                                                                        style={{ backgroundColor: team.color || '#3b82f6' }}
                                                                    />
                                                                    {team.name}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="pt-6 space-y-3">
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                                    disabled={isLoading}
                                    type="submit"
                                >
                                    {form.formState.isSubmitting ? <Loading /> : 'Create Task'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-medium"
                                    type="button"
                                    onClick={() => setClose()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CreateTaskForm
