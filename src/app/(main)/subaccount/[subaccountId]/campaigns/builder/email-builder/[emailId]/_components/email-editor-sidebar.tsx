'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEmailEditor } from '@/providers/editor/email-editor-provider'
import clsx from 'clsx'
import React from 'react'
import { Layout, Plus, Settings } from 'lucide-react'
import EmailComponentsTab from './tabs/components-tab'
import EmailSettingsTab from './tabs/settings-tab'

type Props = {
    subaccountId: string
}

const EmailEditorSidebar = ({ subaccountId }: Props) => {
    const { state, dispatch } = useEmailEditor()

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        const startX = e.clientX
        const startWidth = state.editor.sidebarWidth || 320

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = startWidth - (moveEvent.clientX - startX)
            const clampedWidth = Math.max(280, Math.min(600, newWidth))
            dispatch({
                type: 'SET_SIDEBAR_WIDTH',
                payload: { width: clampedWidth },
            })
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <div className={clsx("h-full", { "hidden": state.editor.previewMode })}>
            <Tabs defaultValue="Components" className="h-full flex flex-row-reverse border-l">
                <TabsList className="flex flex-col h-full w-[60px] bg-background border-l gap-4 py-8">
                    <TabsTrigger value="Components" className="w-10 h-10 p-0">
                        <Plus />
                    </TabsTrigger>
                    <TabsTrigger value="Settings" className="w-10 h-10 p-0">
                        <Settings />
                    </TabsTrigger>
                </TabsList>

                <div
                    className="relative h-full bg-background overflow-hidden"
                    style={{ width: state.editor.sidebarWidth }}
                >
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/30 z-[100]"
                        onMouseDown={handleMouseDown}
                    />
                    <div className="h-full overflow-y-auto">
                        <TabsContent value="Components" className="m-0 p-0">
                            <div className="text-left p-6">
                                <h2 className="text-xl font-bold">Components</h2>
                                <p className="text-sm text-muted-foreground">
                                    Drag and drop components to build your email.
                                </p>
                            </div>
                            <EmailComponentsTab />
                        </TabsContent>
                        <TabsContent value="Settings" className="m-0 p-0">
                            <div className="text-left p-6">
                                <h2 className="text-xl font-bold">Styles</h2>
                                <p className="text-sm text-muted-foreground">
                                    Customize the selected component styles.
                                </p>
                            </div>
                            <EmailSettingsTab subaccountId={subaccountId} />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default EmailEditorSidebar
