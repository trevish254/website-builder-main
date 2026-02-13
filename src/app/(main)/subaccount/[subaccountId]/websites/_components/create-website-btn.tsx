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
import { getWebsiteTemplate } from '@/lib/export-actions'
import { slugify } from '@/lib/utils'

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
            const uniqueId = websiteId.substring(0, 7) // Unique part of UUID
            const subdomain = `${slugify(values.name)}.${uniqueId}`

            // Create Website
            const website = await upsertWebsite({
                id: websiteId,
                name: values.name,
                subAccountId: subaccountId,
                subdomain: subdomain, // This should map to 'subdomain' column or 'domain' if we repurpose it
                published: false,
            })

            // Get template content if available
            let initialContent = null
            if (templateId) {
                if (templateId === 'manufacturing') {
                    // Import manufacturing template content directly
                    const { createManufacturingTemplate } = await import('@/lib/templates/manufacturing-template')
                    const templateData = createManufacturingTemplate()
                    initialContent = templateData.content
                } else if (templateId === 'renewable') {
                    // Import renewable template content directly
                    const { createRenewableEnergyTemplate } = await import('@/lib/templates/renewable-energy-template')
                    const templateData = createRenewableEnergyTemplate()
                    initialContent = templateData.content
                } else if (templateId === 'legal') {
                    // Import legal template content directly
                    const { createLegalTemplate } = await import('@/lib/templates/legal-template')
                    const templateData = createLegalTemplate()
                    initialContent = templateData.content
                } else if (templates[templateId]) {
                    // Hardcoded HTML template
                    initialContent = { components: templates[templateId] }
                } else {
                    // Try fetching from database
                    const dbTemplate = await getWebsiteTemplate(templateId)
                    if (dbTemplate) {
                        initialContent = dbTemplate.content
                    }
                }
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
