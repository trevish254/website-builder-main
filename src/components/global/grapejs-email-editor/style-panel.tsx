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
import BasicSettings from './components/basic-settings'

type Props = {
    editor: any
    subaccountId: string
}

const StylePanel = ({ editor, subaccountId }: Props) => {
    const layerManagerRef = useRef<HTMLDivElement>(null)
    const selectorManagerRef = useRef<HTMLDivElement>(null)
    const styleManagerRef = useRef<HTMLDivElement>(null)
    const traitManagerRef = useRef<HTMLDivElement>(null)
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
                    const styleManager = sm.getContainer ? sm.getContainer() : sm.render();
                    styleManagerRef.current.appendChild(styleManager)
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
            const selected = editor.getSelected();
            if (selected) {
                editor.select(selected);
            }
        }
    }, [styleMode, editor])

    return (
        <div className="w-full overflow-x-hidden bg-background flex flex-col h-full" style={{ zoom: 0.8 }}>
            {/* Header */}
            <div className="p-3 border-b">
                <h2 className="font-semibold text-base">Properties</h2>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto flex-shrink-0">
                    <TabsTrigger
                        value="styles"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 flex-1"
                    >
                        <Paintbrush className="w-4 h-4" />
                        Styles
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 flex-1"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
                    {/* Styles Tab */}
                    <div
                        style={{ display: activeTab === 'styles' ? 'flex' : 'none', flexDirection: 'column' }}
                        className="flex-1"
                    >
                        {/* Selector Manager */}
                        <div className="px-4 pb-4 border-b bg-muted/30 flex-shrink-0">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Selectors</h3>
                            <div ref={selectorManagerRef} className="gjs-selector-manager-container"></div>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex-1 flex flex-col pt-2">
                            <div className="px-4 mb-2">
                                <Tabs
                                    value={styleMode}
                                    onValueChange={(v) => setStyleMode(v as 'basic' | 'advanced')}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 h-8 p-1 bg-muted/50 rounded-md">
                                        <TabsTrigger
                                            value="basic"
                                            className="text-[0.7rem] px-2 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            Basic
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="advanced"
                                            className="text-[0.7rem] px-2 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            Advanced
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div style={{ display: styleMode === 'basic' ? 'block' : 'none' }}>
                                    <BasicSettings editor={editor} />
                                </div>
                                <div
                                    style={{ display: styleMode === 'advanced' ? 'block' : 'none' }}
                                    ref={styleManagerRef}
                                    className="gjs-style-manager-container"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={traitManagerRef}
                        className="gjs-trait-manager-container p-3"
                        style={{ display: activeTab === 'settings' ? 'block' : 'none' }}
                    ></div>
                </div>
            </Tabs>
        </div>
    )
}

export default StylePanel
