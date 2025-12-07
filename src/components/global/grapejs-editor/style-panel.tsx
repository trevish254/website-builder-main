'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Paintbrush, Layers, Settings } from 'lucide-react'

type Props = {
    editor: any
}

const StylePanel = ({ editor }: Props) => {
    const styleManagerRef = useRef<HTMLDivElement>(null)
    const layerManagerRef = useRef<HTMLDivElement>(null)
    const traitManagerRef = useRef<HTMLDivElement>(null)
    const [managersRendered, setManagersRendered] = useState(false)
    const [activeTab, setActiveTab] = useState('styles')

    useEffect(() => {
        if (!editor || managersRendered) return

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            // Render StyleManager
            if (styleManagerRef.current && styleManagerRef.current.children.length === 0) {
                try {
                    const styleManager = editor.StyleManager.render()
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

            setManagersRendered(true)
        }, 100)

        return () => {
            clearTimeout(timer)
        }
    }, [editor, managersRendered])

    return (
        <div className="w-[320px] border-l bg-background flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Properties</h2>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto flex-shrink-0">
                    <TabsTrigger
                        value="styles"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2"
                    >
                        <Paintbrush className="w-4 h-4" />
                        Styles
                    </TabsTrigger>
                    <TabsTrigger
                        value="layers"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2"
                    >
                        <Layers className="w-4 h-4" />
                        Layers
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* All panels are always mounted, but only the active one is visible */}
                    <div
                        ref={styleManagerRef}
                        className="gjs-style-manager-container p-4"
                        style={{ display: activeTab === 'styles' ? 'block' : 'none' }}
                    ></div>

                    <div
                        ref={layerManagerRef}
                        className="gjs-layer-manager-container p-4"
                        style={{ display: activeTab === 'layers' ? 'block' : 'none' }}
                    ></div>

                    <div
                        ref={traitManagerRef}
                        className="gjs-trait-manager-container p-4"
                        style={{ display: activeTab === 'settings' ? 'block' : 'none' }}
                    ></div>
                </div>
            </Tabs>
        </div>
    )
}

export default StylePanel
