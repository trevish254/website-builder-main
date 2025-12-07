'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/global/custom-modal'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { upsertWebsite, upsertWebsitePage } from '@/lib/website-queries'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { v4 } from 'uuid'
import { templates } from '@/components/global/grapejs-editor/templates'

type Props = {
    subaccountId: string
    templateId?: string
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    children?: React.ReactNode
}

const CreateWebsiteSchema = z.object({
    name: z.string().min(1, { message: 'Website name is required' }),
})

const CreateWebsiteBtn = ({ subaccountId, templateId, className, variant, size, children }: Props) => {
    const { setOpen } = useModal()

    const handleOpenModal = () => {
        setOpen(
            <CustomModal
                title="Create a Website"
                subheading="Give your website a name to get started."
            >
                <CreateWebsiteForm subaccountId={subaccountId} templateId={templateId} />
            </CustomModal>
        )
    }

    return (
        <Button
            className={`flex items-center gap-2 ${className || ''}`}
            onClick={handleOpenModal}
            variant={variant || "default"}
            size={size || "default"}
        >
            {children ? children : (
                <>
                    <Plus size={16} /> New Website
                </>
            )}
        </Button>
    )
}

const CreateWebsiteForm = ({ subaccountId, templateId }: { subaccountId: string, templateId?: string }) => {
    const { setClose } = useModal()
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof CreateWebsiteSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateWebsiteSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof CreateWebsiteSchema>) => {
        setIsLoading(true)
        try {
            const websiteId = v4()
            // Create Website
            const website = await upsertWebsite({
                id: websiteId,
                name: values.name,
                subAccountId: subaccountId,
                published: false,
            })

            // Get template content if available
            let initialContent = null
            if (templateId && templates[templateId]) {
                // Wrap HTML string in component structure if needed, or pass as is 
                // The editor loading logic now handles { components: ... } or just raw content checking.
                // Let's use the structure { components: htmlString } to be safe and consistent
                // with what we expect in the editor loader fallback.
                initialContent = { components: templates[templateId] }
            }

            // Create Default Home Page
            await upsertWebsitePage({
                name: 'Home',
                pathName: '/',
                websiteId: website.id,
                order: 0,
                content: initialContent,
            })

            toast({
                title: 'Success',
                description: 'Website created successfully',
            })

            setClose()
            router.refresh()
            router.push(`/subaccount/${subaccountId}/websites/editor/${website.id}`)
        } catch (error) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could not create website',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website Name</FormLabel>
                            <FormControl>
                                <Input placeholder="My Awesome Website" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 w-full mt-4">
                    <Button variant="outline" type="button" onClick={() => setClose()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Website'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateWebsiteBtn
