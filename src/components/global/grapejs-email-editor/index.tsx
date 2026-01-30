'use client'

import React, { useEffect, useRef, useState } from 'react'
import grapesjs, { Editor } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import './email-editor.css'
import './grapejs-custom.css'

// Plugins
// @ts-ignore
import gjsForms from 'grapesjs-plugin-forms'
// @ts-ignore
import gjsCountdown from 'grapesjs-component-countdown'
// @ts-ignore
import gjsCustomCode from 'grapesjs-custom-code'
// @ts-ignore
import gjsTouch from 'grapesjs-touch'
// @ts-ignore
import gjsParserPostcss from 'grapesjs-parser-postcss'
// @ts-ignore
import gjsTooltip from 'grapesjs-tooltip'

import {
    Monitor,
    Smartphone,
    Tablet,
    Undo,
    Redo,
    Eye,
    Save,
    ArrowLeft,
    Code,
    Maximize,
    FileUp,
    CheckCircle2,
    RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { upsertEmailCampaign } from '@/lib/email-queries'
import EmailEditorSidebar from './editor-sidebar'
import StylePanel from './style-panel'
import GjsEditorBridge from '../grapejs-editor/gjs-editor-bridge' // Reuse bridge if possible
import { blockCategories, customBlocks } from './blocks-config'
import { renderToStaticMarkup } from 'react-dom/server'
import EmailEditorProvider from '@/providers/editor/email-editor-provider'

type Props = {
    emailId: string
    subaccountId: string
    emailDetails: any
}

const GrapeJsEmailEditor = ({ emailId, subaccountId, emailDetails }: Props) => {
    const router = useRouter()
    const editorRef = useRef<HTMLDivElement>(null)
    const editorInstanceRef = useRef<Editor | null>(null)
    const [editorReady, setEditorReady] = useState(false)
    const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [previewMode, setPreviewMode] = useState(false)
    const [saving, setSaving] = useState(false)
    const [pageName, setPageName] = useState(emailDetails?.name || 'Untitled Email')
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [activeSidebarTab, setActiveSidebarTab] = useState('blocks')

    // Initialize Editor
    useEffect(() => {
        if (!editorRef.current || editorInstanceRef.current) return

        const editor = grapesjs.init({
            container: editorRef.current,
            height: '100%',
            width: 'auto',
            fromElement: true,
            storageManager: false,
            allowScripts: 1,
            canvas: {
                styles: [
                    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                ],
                scripts: [
                    'https://cdn.tailwindcss.com',
                ]
            },
            plugins: [
                gjsForms,
                gjsCountdown,
                gjsCustomCode,
                gjsTouch,
                gjsParserPostcss,
                gjsTooltip,
            ],
            pluginsOpts: {
                [gjsForms as any]: {},
            },
            styleManager: {
                sectors: [
                    {
                        name: 'Layout',
                        open: false,
                        buildProps: ['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'order', 'flex-basis', 'flex-grow', 'flex-shrink', 'align-self'],
                    },
                    {
                        name: 'Dimension',
                        open: false,
                        buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding', 'box-sizing'],
                    },
                    {
                        name: 'Typography',
                        open: false,
                        buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-shadow', 'text-decoration', 'font-style', 'text-transform'],
                    },
                    {
                        name: 'Decorations',
                        open: false,
                        buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background', 'opacity', 'transition'],
                    },
                    {
                        name: 'Extra',
                        open: false,
                        buildProps: ['opacity', 'transition', 'perspective', 'transform', 'cursor', 'overflow', 'z-index'],
                    },
                ],
            },
            deviceManager: {
                devices: [
                    { name: 'desktop', width: '' },
                    { name: 'tablet', width: '768px', widthMedia: '992px' },
                    { name: 'mobile', width: '375px', widthMedia: '480px' },
                ],
            },
            selectorManager: { componentFirst: true },
        })

        editorInstanceRef.current = editor

        editor.on('load', () => {
            setEditorReady(true)

            // Load content if exists
            if (emailDetails?.content) {
                try {
                    const content = JSON.parse(emailDetails.content)
                    editor.loadProjectData(content)
                } catch (e) {
                    console.error('Error loading content', e)
                }
            }
        })

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy()
                editorInstanceRef.current = null
            }
        }
    }, [emailDetails])

    const handleDeviceChange = (device: string) => {
        if (!editorInstanceRef.current) return
        editorInstanceRef.current.setDevice(device)
        setActiveDevice(device as any)
    }

    const handleUndo = () => editorInstanceRef.current?.UndoManager.undo()
    const handleRedo = () => editorInstanceRef.current?.UndoManager.redo()

    const handlePreview = () => {
        if (!editorInstanceRef.current) return
        setPreviewMode(true)
        editorInstanceRef.current.runCommand('core:preview')
    }

    const handleSave = async () => {
        if (!editorInstanceRef.current || saving) return
        setSaving(true)

        try {
            const projectData = editorInstanceRef.current.getProjectData()
            const html = editorInstanceRef.current.getHtml()
            const css = editorInstanceRef.current.getCss()

            await upsertEmailCampaign({
                name: pageName,
                id: emailId,
                content: JSON.stringify(projectData),
                htmlContent: `<html><head><style>${css}</style></head><body>${html}</body></html>`,
                subAccountId: subaccountId,
            })

            toast({
                title: 'Success',
                description: 'Email saved successfully',
            })
        } catch (error) {
            console.error('Save error:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save email',
            })
        } finally {
            setSaving(false)
        }
    }

    const handleViewCode = () => {
        editorInstanceRef.current?.runCommand('core:open-code')
    }

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    useEffect(() => {
        if (!editorReady || !editorInstanceRef.current) return
        const editor = editorInstanceRef.current

        // Register custom blocks
        customBlocks.forEach((block) => {
            try {
                const categoryLabel = blockCategories.find(c => c.id === block.category)?.label || block.category
                const IconComponent = block.icon
                const mediaHtml = renderToStaticMarkup(<IconComponent size={24} strokeWidth={1.5} />)

                editor.BlockManager.add(block.id, {
                    label: block.label,
                    content: block.content,
                    category: { id: block.category, label: categoryLabel },
                    media: mediaHtml,
                    attributes: {
                        class: 'gjs-block',
                        title: block.label
                    }
                })
            } catch (error) {
                console.error(`Failed to register block ${block.id}:`, error)
            }
        })
    }, [editorReady])

    return (
        <EmailEditorProvider
            subaccountId={subaccountId}
            emailId={emailId}
            emailDetails={emailDetails}
        >
            {editorInstanceRef.current && (
                <GjsEditorBridge editor={editorInstanceRef.current} />
            )}
            <div className="h-screen w-full flex flex-col bg-background">
                {!previewMode && (
                    <header className="h-[60px] border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 z-50 shrink-0 shadow-sm">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back</span>
                            </Button>
                            <div className="h-6 w-px bg-border" />
                            <div className="flex flex-col">
                                <Input
                                    value={pageName}
                                    onChange={(e) => setPageName(e.target.value)}
                                    className="h-7 bg-transparent border-none focus-visible:ring-0 p-0 font-semibold text-sm max-w-[200px]"
                                    placeholder="Email Name"
                                />
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                    <span className="truncate max-w-[150px]">{subaccountId}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                        {saving ? 'Saving...' : 'Synced'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={activeDevice === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => handleDeviceChange('desktop')} className="h-8 w-8">
                                                <Monitor className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">Desktop</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={activeDevice === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => handleDeviceChange('tablet')} className="h-8 w-8">
                                                <Tablet className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">Tablet</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant={activeDevice === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => handleDeviceChange('mobile')} className="h-8 w-8">
                                                <Smartphone className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">Mobile</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={handleUndo} className="h-8 w-8"><Undo className="w-4 h-4" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Undo</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={handleRedo} className="h-8 w-8"><Redo className="w-4 h-4" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Redo</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button variant="outline" size="sm" onClick={handleViewCode} className="gap-2 h-8">
                                <Code className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">View Code</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePreview} className="gap-2 h-8">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Preview</span>
                            </Button>
                            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2 h-8">
                                <Save className="w-3.5 h-3.5" />
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </header>
                )}

                <div className="flex-1 flex overflow-hidden relative">
                    {!previewMode && editorReady && (
                        <EmailEditorSidebar
                            editor={editorInstanceRef.current}
                            activeTab={activeSidebarTab}
                            setActiveTab={setActiveSidebarTab}
                            collapsed={sidebarCollapsed}
                            setCollapsed={setSidebarCollapsed}
                            subaccountId={subaccountId}
                            emailId={emailId}
                        />
                    )}
                    <main className="flex-1 relative min-w-0 overflow-auto bg-[#0b0d11]">
                        <div id="gjs" ref={editorRef} className="absolute inset-0 w-full h-full"></div>
                        {previewMode && (
                            <div className="absolute top-4 right-4 z-[9999]">
                                <Button onClick={() => {
                                    setPreviewMode(false)
                                    editorInstanceRef.current?.stopCommand('core:preview')
                                }} className="shadow-lg gap-2" variant="default">
                                    <Eye className="w-4 h-4" /> Exit Preview
                                </Button>
                            </div>
                        )}
                    </main>
                    {!previewMode && editorReady && (
                        <aside className="wrapper-style flex-shrink-0 w-[300px] border-l bg-background z-40 relative">
                            <StylePanel editor={editorInstanceRef.current} subaccountId={subaccountId} />
                        </aside>
                    )}
                </div>
            </div>
        </EmailEditorProvider>
    )
}

export default GrapeJsEmailEditor
