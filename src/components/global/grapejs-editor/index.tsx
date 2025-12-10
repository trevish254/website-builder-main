'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Monitor, Tablet, Smartphone, Undo, Redo, Eye, Save, Upload, ArrowLeft, ExternalLink, PanelLeft } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { customBlocks, blockCategories } from './blocks-config'
import BlocksPanel from './blocks-panel' // Keeping for reference or fallback, but mostly replacing usage
import StylePanel from './style-panel'
import './grapejs-custom.css'
import { FunnelPage } from '@prisma/client'
import { upsertWebsitePage, WebsitePage } from '@/lib/website-queries'
import { toast } from '@/components/ui/use-toast'
import EditorSidebar from './editor-sidebar'
import PublishDialog from './publish-dialog'

type Props = {
    subaccountId: string
    funnelId: string
    pageDetails: FunnelPage
    websitePages?: WebsitePage[]
    userId?: string
    websiteName?: string
    currentDomain?: string
}

const GrapeJsEditor = ({ subaccountId, funnelId, pageDetails, websitePages, userId, websiteName, currentDomain }: Props) => {
    const router = useRouter()
    const editorRef = useRef<HTMLDivElement>(null)
    const editorInstanceRef = useRef<any>(null)
    const [pageName, setPageName] = useState(pageDetails?.name || 'Untitled Page')
    const [activeDevice, setActiveDevice] = useState('desktop')
    const [editorReady, setEditorReady] = useState(false)
    const [showBlocks, setShowBlocks] = useState(true)

    // Sidebar State
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
    const [activeSidebarTab, setActiveSidebarTab] = useState('blocks')

    // Publish Dialog State
    const [publishDialogOpen, setPublishDialogOpen] = useState(false)

    useEffect(() => {
        if (!editorRef.current) return

        const editor = grapesjs.init({
            container: editorRef.current,
            width: 'auto',
            height: 'calc(100vh - 60px)',
            fromElement: false,
            storageManager: false,
            panels: { defaults: [] },
            canvas: {
                styles: [
                    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
                ],
                scripts: [
                    // Navigation handler for page links
                    `(function() {
                        document.addEventListener('click', function(e) {
                            let target = e.target;
                            while (target && target !== document) {
                                const navigateTo = target.getAttribute('data-navigate-page');
                                if (navigateTo && navigateTo !== '') {
                                    e.preventDefault();
                                    window.location.href = '/' + navigateTo;
                                    return;
                                }
                                target = target.parentElement;
                            }
                        });
                    })();`
                ],
            },
            blockManager: {
                appendTo: '#blocks',
            },
            styleManager: {
                appendTo: '#styles',
            },
            deviceManager: {
                devices: [
                    { name: 'desktop', width: '' },
                    { name: 'tablet', width: '768px', widthMedia: '992px' },
                    { name: 'mobile', width: '320px', widthMedia: '480px' },
                ]
            },
            // Preserve inline styles when loading HTML
            parser: {
                optionsHtml: {
                    allowScripts: true,
                },
            },
            // Keep inline styles in components
            avoidInlineStyle: false,
        })

        // Reactive Content Load


        // Register Custom Blocks
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
                    },
                })
            } catch (error) {
                console.error(`✗ Failed to register block ${block.label}:`, error)
            }
        })

        // Style Manager Configuration
        editor.StyleManager.addSector('general', {
            name: 'General',
            open: false,
            properties: [
                { property: 'display', type: 'select', defaults: 'block', list: [{ value: 'block', name: 'Block' }, { value: 'flex', name: 'Flex' }, { value: 'grid', name: 'Grid' }, { value: 'none', name: 'None' }] },
                { property: 'position', type: 'select', list: [{ value: 'static', name: 'Static' }, { value: 'relative', name: 'Relative' }, { value: 'absolute', name: 'Absolute' }, { value: 'fixed', name: 'Fixed' }] },
            ]
        })
        editor.StyleManager.addSector('dimension', {
            name: 'Dimension',
            open: false,
            properties: [
                { property: 'width', type: 'integer', units: ['px', '%'] },
                { property: 'height', type: 'integer', units: ['px', '%', 'vh'] },
                { property: 'margin', type: 'composite', properties: [{ property: 'margin-top' }, { property: 'margin-right' }, { property: 'margin-bottom' }, { property: 'margin-left' }] },
                { property: 'padding', type: 'composite', properties: [{ property: 'padding-top' }, { property: 'padding-right' }, { property: 'padding-bottom' }, { property: 'padding-left' }] },
            ]
        })
        editor.StyleManager.addSector('typography', {
            name: 'Typography',
            open: false,
            properties: [
                { property: 'font-family', type: 'select', list: [{ value: 'Arial', name: 'Arial' }, { value: 'Inter', name: 'Inter' }] },
                { property: 'font-size', type: 'integer', units: ['px', 'rem'] },
                { property: 'color', type: 'color' },
                { property: 'text-align', type: 'radio', list: [{ value: 'left' }, { value: 'center' }, { value: 'right' }] },
            ]
        })
        editor.StyleManager.addSector('decorations', {
            name: 'Decorations',
            open: false,
            properties: [
                { property: 'background-color', type: 'color' },
                { property: 'border-radius', type: 'integer', units: ['px'] },
                { property: 'border', type: 'composite', properties: [{ property: 'border-width' }, { property: 'border-style' }, { property: 'border-color' }] },
            ]
        })
        editor.StyleManager.addSector('flex', {
            name: 'Flex',
            open: false,
            properties: [{ property: 'flex-direction' }, { property: 'justify-content' }, { property: 'align-items' }, { property: 'gap' }]
        })

        // Add custom trait for page navigation to all components
        editor.on('component:add', (component: any) => {
            const existingTraits = component.get('traits')
            const hasNavigateTrait = existingTraits.some((t: any) => t.name === 'data-navigate-page')

            if (!hasNavigateTrait) {
                component.addTrait({
                    type: 'select',
                    label: 'Navigate to Page',
                    name: 'data-navigate-page',
                    options: [
                        { id: '', name: 'None' },
                        ...(websitePages?.map(page => ({
                            id: page.pathName,
                            name: page.name
                        })) || [])
                    ]
                })
            }
        })

        editorInstanceRef.current = editor
        setEditorReady(true)

        return () => {
            editor.destroy()
        }
    }, [])

    // Reactive Content Load
    useEffect(() => {
        if (!editorReady || !editorInstanceRef.current || !pageDetails) return

        const editor = editorInstanceRef.current

        setPageName(pageDetails.name || 'Untitled Page')

        try {
            const content = typeof pageDetails.content === 'string'
                ? JSON.parse(pageDetails.content)
                : pageDetails.content

            if (content && (content.pages || content.styles || content.assets)) {
                // Full GrapeJS project data
                editor.loadProjectData(content)
            } else if (content && typeof content.components === 'string') {
                // HTML string template wrapped in { components: htmlString }
                editor.runCommand('core:canvas-clear')

                // Extract CSS from <style> tags and inject separately
                const styleRegex = /<style>([\s\S]*?)<\/style>/gi
                let css = ''
                let htmlWithoutStyles = content.components

                // Extract all CSS from style tags
                let match
                while ((match = styleRegex.exec(content.components)) !== null) {
                    css += match[1] + '\n'
                }

                // Remove style tags from HTML
                htmlWithoutStyles = htmlWithoutStyles.replace(styleRegex, '')

                // Set components and styles separately
                editor.setComponents(htmlWithoutStyles.trim())
                if (css) {
                    editor.setStyle(css)
                }
            } else if (content && content.components) {
                // GrapeJS components array
                editor.loadProjectData(content)
            } else {
                // Fallback for empty/new pages
                editor.runCommand('core:canvas-clear') // Clear previous content
                editor.setComponents(`
                <div data-gjs-type="text" style="padding: 40px; text-align: center; color: #999; border: 2px dashed #ddd; border-radius: 8px; margin: 20px auto; max-width: 800px;">
                    <h2 style="margin: 0 0 10px 0; color: #666;">Start Building Your Page</h2>
                    <p style="margin: 0;">Drag and drop blocks from the left panel to add content here</p>
                </div>
            `)
                editor.setStyle({})
            }
        } catch {
            console.warn('Failed to parse content, using raw')
        }
    }, [pageDetails, editorReady])

    // Update navigation trait options when pages change
    useEffect(() => {
        if (!editorReady || !editorInstanceRef.current || !websitePages) return

        const editor = editorInstanceRef.current

        // Update trait options for all existing components
        const updateNavigationTraits = () => {
            const wrapper = editor.getWrapper()
            if (!wrapper) return

            const allComponents = wrapper.find('*')
            allComponents.forEach((component: any) => {
                const trait = component.getTrait('data-navigate-page')
                if (trait) {
                    trait.set('options', [
                        { id: '', name: 'None' },
                        ...websitePages.map(page => ({
                            id: page.pathName,
                            name: page.name
                        }))
                    ])
                }
            })
        }

        updateNavigationTraits()
    }, [websitePages, editorReady])

    const handleDeviceChange = (device: string) => {
        if (!editorInstanceRef.current) return
        editorInstanceRef.current.setDevice(device)
        setActiveDevice(device)
    }

    const handleUndo = () => { editorInstanceRef.current?.UndoManager.undo() }
    const handleRedo = () => { editorInstanceRef.current?.UndoManager.redo() }
    const handlePreview = () => { editorInstanceRef.current?.runCommand('preview') }

    const handleSave = async () => {
        if (!editorInstanceRef.current) return

        try {
            const projectData = editorInstanceRef.current.getProjectData()
            const html = editorInstanceRef.current.getHtml()
            const css = editorInstanceRef.current.getCss()

            let previewImage = pageDetails.previewImage
            try {
                const require = (window as any).require;
                const html2canvas = (await import('html2canvas')).default

                const iframe = editorRef.current.querySelector('iframe')
                if (iframe && iframe.contentWindow && iframe.contentDocument) {
                    iframe.contentWindow.scrollTo(0, 0)

                    const canvas = await html2canvas(iframe.contentDocument.body, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 0.5,
                        logging: false,
                        height: 1200,
                        windowHeight: 1200,
                        y: 0
                    })

                    const MAX_WIDTH = 400
                    let width = canvas.width
                    let height = canvas.height

                    if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width)
                        width = MAX_WIDTH
                    }

                    const resizedCanvas = document.createElement('canvas')
                    resizedCanvas.width = width
                    resizedCanvas.height = height
                    const ctx = resizedCanvas.getContext('2d')
                    if (ctx) {
                        ctx.drawImage(canvas, 0, 0, width, height)
                        previewImage = resizedCanvas.toDataURL('image/jpeg', 0.6)
                    } else {
                        previewImage = canvas.toDataURL('image/jpeg', 0.6)
                    }
                }
            } catch (err) {
                console.error('Failed to generate thumbnail:', err)
            }

            // Inject navigation script into HTML for preview/published pages
            const navigationScript = `
<script>
(function() {
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target !== document) {
            const navigateTo = target.getAttribute('data-navigate-page');
            if (navigateTo && navigateTo !== '') {
                e.preventDefault();
                
                // Check if we're in preview mode
                const currentPath = window.location.pathname;
                const isPreview = currentPath.includes('/site-preview/');
                
                if (isPreview) {
                    // Extract websiteId from current URL
                    const match = currentPath.match(/\\/site-preview\\/([^\\/]+)/);
                    if (match) {
                        const websiteId = match[1];
                        window.location.href = '/site-preview/' + websiteId + '/' + navigateTo;
                    }
                } else {
                    // Published site - use root path
                    window.location.href = '/' + navigateTo;
                }
                return;
            }
            target = target.parentElement;
        }
    });
})();
</script>`

            const htmlWithScript = html + navigationScript

            await upsertWebsitePage({
                id: pageDetails.id,
                name: pageName,
                pathName: pageDetails.pathName,
                websiteId: funnelId,
                content: projectData,
                htmlContent: htmlWithScript,
                cssContent: css,
                order: pageDetails.order,
                previewImage: previewImage,
            })

            toast({
                title: 'Success',
                description: 'Saved website page',
            })
        } catch (error) {
            console.error('Save error:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save website page',
            })
        }
    }

    const handlePublish = async () => {
        console.log('Publish button clicked - saving first...')
        // Save before opening publish dialog
        await handleSave()
        console.log('Save complete - opening publish dialog')
        setPublishDialogOpen(true)
    }

    const handleFullPreview = async () => {
        await handleSave()
        window.open(`/site-preview/${funnelId}`, '_blank')
    }

    return (
        <div className="h-screen w-full flex flex-col bg-background">
            <div className="h-[60px] border-b bg-background flex items-center justify-between px-4 gap-4 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back</span>
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    {/* Note: Sidebar toggle is now internal, but keeping state here in case we want external control */}
                    <Input value={pageName} onChange={(e) => setPageName(e.target.value)} className="max-w-xs" placeholder="Page name" />
                </div>
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                    <Button variant={activeDevice === 'desktop' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleDeviceChange('desktop')} className="gap-2">
                        <Monitor className="w-4 h-4" /> <span className="hidden sm:inline">Desktop</span>
                    </Button>
                    <Button variant={activeDevice === 'tablet' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleDeviceChange('tablet')} className="gap-2">
                        <Tablet className="w-4 h-4" /> <span className="hidden sm:inline">Tablet</span>
                    </Button>
                    <Button variant={activeDevice === 'mobile' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleDeviceChange('mobile')} className="gap-2">
                        <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">Mobile</span>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleUndo}><Undo className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={handleRedo}><Redo className="w-4 h-4" /></Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button variant="ghost" size="sm" onClick={handlePreview}><Eye className="w-4 h-4 mr-2" />Preview</Button>
                    <Button variant="ghost" size="sm" onClick={handleFullPreview}><ExternalLink className="w-4 h-4 mr-2" />Full Site</Button>
                    <Button variant="outline" size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button>
                    <Button size="sm" onClick={handlePublish}><Upload className="w-4 h-4 mr-2" />Publish</Button>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                {editorReady && editorInstanceRef.current && (
                    <EditorSidebar
                        editor={editorInstanceRef.current}
                        activeTab={activeSidebarTab}
                        setActiveTab={setActiveSidebarTab}
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                        pages={websitePages || []}
                        subaccountId={subaccountId}
                        funnelId={funnelId}
                        activePageId={pageDetails.id}
                    />
                )}
                <div className="flex-1 relative">
                    <div id="gjs" ref={editorRef} className="h-full w-full"></div>
                </div>
                {editorReady && editorInstanceRef.current && <StylePanel editor={editorInstanceRef.current} />}
            </div>

            {/* Publish Dialog */}
            {editorReady && editorInstanceRef.current && (
                <PublishDialog
                    open={publishDialogOpen}
                    onOpenChange={setPublishDialogOpen}
                    editorInstance={editorInstanceRef.current}
                    websiteId={funnelId}
                    websiteName={websiteName || 'Untitled Website'}
                    userId={userId || ''}
                    currentDomain={currentDomain}
                />
            )}
        </div>
    )
}

export default GrapeJsEditor
