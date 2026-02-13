'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Paintbrush, Layers, Settings } from 'lucide-react'
import { useEditor } from '@/providers/editor/editor-provider'
import SettingsTab from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor-sidebar/tabs/settings-tab'

type Props = {
    editor: any
    subaccountId: string
}

const StylePanel = ({ editor, subaccountId }: Props) => {
    const { state, dispatch } = useEditor()
    const layerManagerRef = useRef<HTMLDivElement>(null)
    const selectorManagerRef = useRef<HTMLDivElement>(null)
    const styleManagerRef = useRef<HTMLDivElement>(null)
    const traitManagerRef = useRef<HTMLDivElement>(null)
    const [managersRendered, setManagersRendered] = useState(false)
    const [activeTab, setActiveTab] = useState('styles')
    const [styleMode, setStyleMode] = useState<'basic' | 'advanced'>('basic')

    useEffect(() => {
        if (!editor) return

        const renderManagers = () => {
            // Render SelectorManager
            if (selectorManagerRef.current && selectorManagerRef.current.children.length === 0) {
                try {
                    const selectorManager = editor.SelectorManager.render()
                    selectorManagerRef.current.appendChild(selectorManager)
                } catch (error) {
                    console.error('Error rendering SelectorManager:', error)
                }
            }

            // Render StyleManager
            if (styleManagerRef.current && styleManagerRef.current.children.length === 0) {
                try {
                    const sm = editor.StyleManager;
                    const styleManagerContainer = sm.render();
                    styleManagerRef.current.appendChild(styleManagerContainer)
                } catch (error) {
                    console.error('Error rendering StyleManager:', error)
                }
            }

            // Render LayerManager
            if (layerManagerRef.current && layerManagerRef.current.children.length === 0) {
                try {
                    const layerManager = editor.LayerManager.render()
                    layerManagerRef.current.appendChild(layerManager)
                } catch (error) {
                    console.error('Error rendering LayerManager:', error)
                }
            }

            // Render TraitManager
            if (traitManagerRef.current && traitManagerRef.current.children.length === 0) {
                try {
                    const traitManager = editor.TraitManager.render()
                    traitManagerRef.current.appendChild(traitManager)
                } catch (error) {
                    console.error('Error rendering TraitManager:', error)
                }
            }
        }

        const timer = setTimeout(renderManagers, 100)

        // Force a refresh when selection changes to ensure SM is alive
        editor.on('component:selected', renderManagers)

        return () => {
            clearTimeout(timer)
            editor.off('component:selected', renderManagers)
        }
    }, [editor])

    // Specific effect to handle mode switching refresh
    useEffect(() => {
        if (styleMode === 'advanced' && editor) {
            // Force GrapesJS to update the style manager target to current selection
            const selected = editor.getSelected();
            if (selected) {
                editor.select(selected);
            }
        }
    }, [styleMode, editor])

    return (
        <div className="w-full overflow-hidden bg-background flex flex-col h-full" style={{ zoom: 0.88 }}>
            {/* Header */}
            <div className="px-3 py-2 border-b">
                <h2 className="font-semibold text-sm">Properties</h2>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-9 flex-shrink-0">
                    <TabsTrigger
                        value="styles"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 flex-1 text-xs h-9"
                    >
                        <Paintbrush className="w-3.5 h-3.5" />
                        Styles
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 flex-1 text-xs h-9"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden flex flex-col pt-4 min-h-0">
                    {/* Styles Tab */}
                    <div
                        style={{ display: activeTab === 'styles' ? 'flex' : 'none', flexDirection: 'column' }}
                        className="flex-1 min-h-0 overflow-hidden"
                    >
                        {/* Fixed Header Section (Selectors + Mode Toggles) */}
                        <div className="flex-shrink-0 bg-background z-10 border-b">
                            {/* Selector Manager */}
                            <div className="px-3 py-1.5 bg-muted/30">
                                <h3 className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/70 mb-0.5">Selectors</h3>
                                <div ref={selectorManagerRef} className="gjs-selector-manager-container min-h-[24px]"></div>
                            </div>

                            {/* Mode Toggles */}
                            <div className="px-3 py-1.5 border-t">
                                <Tabs
                                    value={styleMode}
                                    onValueChange={(v) => setStyleMode(v as 'basic' | 'advanced')}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 h-6 p-0.5 bg-muted/50 rounded-md">
                                        <TabsTrigger
                                            value="basic"
                                            className="text-[0.6rem] px-2 h-[1.35rem] leading-none data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            Basic
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="advanced"
                                            className="text-[0.6rem] px-2 h-[1.35rem] leading-none data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            Advanced
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>

                        {/* Scrollable Content Section */}
                        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative bg-background">
                            <div className="px-1 pb-4">
                                <div style={{ display: styleMode === 'basic' ? 'block' : 'none' }}>
                                    <SettingsTab subaccountId={subaccountId} editor={editor} />
                                </div>
                                <div style={{ display: styleMode === 'advanced' ? 'block' : 'none' }}>
                                    <div ref={styleManagerRef} className="gjs-style-manager-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings/Traits Tab - Now Scrollable */}
                    <div
                        ref={traitManagerRef}
                        className="gjs-trait-manager-container p-3 flex-1 overflow-y-auto min-h-0 custom-scrollbar pb-20"
                        style={{ display: activeTab === 'settings' ? 'block' : 'none' }}
                    ></div>
                </div>
            </Tabs>
        </div>
    )
}

export default StylePanel
