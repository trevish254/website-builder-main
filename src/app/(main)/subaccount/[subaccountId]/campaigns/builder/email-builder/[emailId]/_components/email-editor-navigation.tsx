'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeftCircle,
    EyeIcon,
    Laptop,
    Redo2,
    Smartphone,
    Tablet,
    Undo2,
    Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import clsx from 'clsx'
import { useEmailEditor } from '@/providers/editor/email-editor-provider'
import { EmailCampaign, upsertEmailCampaign } from '@/lib/email-queries'
import { toast } from '@/components/ui/use-toast'

type Props = {
    emailId: string
    emailDetails: EmailCampaign
    subaccountId: string
}

const EmailEditorNavigation = ({
    emailId,
    emailDetails,
    subaccountId,
}: Props) => {
    const router = useRouter()
    const { state, dispatch } = useEmailEditor()

    const handleOnSave = async () => {
        const content = JSON.stringify(state.editor.elements)
        try {
            await upsertEmailCampaign({
                ...emailDetails,
                content,
                updatedAt: new Date().toISOString(),
            })
            toast({
                title: 'Success',
                description: 'Saved your changes',
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save changes',
            })
        }
    }

    const handleGoBack = () => {
        router.back()
    }

    return (
        <nav
            className={clsx(
                'border-b-[1px] flex items-center justify-between p-2 gap-2 transition-all',
                { '!h-0 !p-0 !overflow-hidden': state.editor.previewMode }
            )}
        >
            <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
                <ArrowLeftCircle
                    className="cursor-pointer"
                    onClick={handleGoBack}
                />
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold truncate w-full">
                        {emailDetails.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {emailDetails.status}
                    </span>
                </div>
            </aside>
            <aside>
                <Tabs
                    defaultValue="Desktop"
                    className="w-fit"
                    value={state.editor.device}
                    onValueChange={(value) => {
                        dispatch({
                            type: 'CHANGE_DEVICE',
                            payload: { device: value as any },
                        })
                    }}
                >
                    <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
                        <TabsTrigger
                            value="Desktop"
                            className="data-[state=active]:bg-muted w-10 h-10 p-0"
                        >
                            <Laptop />
                        </TabsTrigger>
                        <TabsTrigger
                            value="Tablet"
                            className="data-[state=active]:bg-muted w-10 h-10 p-0"
                        >
                            <Tablet />
                        </TabsTrigger>
                        <TabsTrigger
                            value="Mobile"
                            className="data-[state=active]:bg-muted w-10 h-10 p-0"
                        >
                            <Smartphone />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </aside>
            <aside className="flex items-center gap-2">
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => dispatch({ type: 'UNDO' })}
                    disabled={state.history.currentIndex <= 0}
                >
                    <Undo2 />
                </Button>
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => dispatch({ type: 'REDO' })}
                    disabled={
                        state.history.currentIndex >=
                        state.history.history.length - 1
                    }
                >
                    <Redo2 />
                </Button>
                <Button
                    className="flex gap-2"
                    onClick={() => dispatch({ type: 'TOGGLE_PREVIEW_MODE' })}
                >
                    <EyeIcon size={16} />
                    Preview
                </Button>
                <Button
                    className="flex gap-2"
                    onClick={handleOnSave}
                >
                    <Save size={16} />
                    Save
                </Button>
            </aside>
        </nav>
    )
}

export default EmailEditorNavigation
