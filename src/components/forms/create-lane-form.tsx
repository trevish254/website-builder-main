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
import { useForm } from 'react-hook-form'
import { TaskLane } from '@/lib/database.types'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { CreateTaskLaneFormSchema } from '@/lib/types'
import { upsertTaskLane } from '@/lib/actions/tasks'
import { toast } from '../ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import CustomColorPicker from '../global/custom-color-picker'
import { v4 } from 'uuid'

interface CreateLaneFormProps {
    defaultData?: TaskLane
    boardId: string
}

const CreateLaneForm: React.FC<CreateLaneFormProps> = ({
    defaultData,
    boardId,
}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateTaskLaneFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateTaskLaneFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            color: defaultData?.color || '#000000',
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                name: defaultData.name || '',
                color: defaultData.color || '#000000',
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof CreateTaskLaneFormSchema>) => {
        if (!boardId) return
        try {
            const response = await upsertTaskLane({
                ...values,
                id: defaultData?.id || v4(),
                boardId: boardId,
                order: defaultData?.order,
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
                description: 'Section saved successfully',
            })

            router.refresh()
            setClose()
        } catch (error) {
            console.error('Error saving lane:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save section details',
            })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Section Details</CardTitle>
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Section Name"
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
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section Color</FormLabel>
                                    <FormControl>
                                        <CustomColorPicker
                                            color={field.value || '#000000'}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
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

export default CreateLaneForm
