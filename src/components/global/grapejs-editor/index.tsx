'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { useRouter } from 'next/navigation'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Monitor, Tablet, Smartphone, Undo, Redo, Eye, Save, Upload, ArrowLeft, ExternalLink, PanelLeft, Code, FileUp, Maximize } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { customBlocks, blockCategories } from './blocks-config'

// GrapesJS Plugins (Explicit Imports)
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
import BlocksPanel from './blocks-panel'
import StylePanel from './style-panel'
import BackgroundLayers from './background-layers'
import './grapejs-custom.css'
import { FunnelPage } from '@prisma/client'
import { upsertWebsitePage, WebsitePage, Website } from '@/lib/website-queries'
import { toast } from '@/components/ui/use-toast'
import EditorSidebar from './editor-sidebar'
import PublishDialog from './publish-dialog'
import EditorProvider from '@/providers/editor/editor-provider'
import GjsEditorBridge from './gjs-editor-bridge'
import CodeViewerDialog from './code-viewer-dialog'

type Props = {
    subaccountId: string
    funnelId: string
    pageDetails: FunnelPage
    websitePages?: WebsitePage[]
    userId?: string
    websiteName?: string
    currentDomain?: string
    website?: Website
}

export interface BrandKit {
    colors: {
        primary: string
        secondary: string
        accent: string
        background: string
        text: string
    }
    typography: {
        headingFont: string
        bodyFont: string
        baseFontSize: string
    }
    uiStyle: {
        borderRadius: string
        buttonRadius: string
        shadowStrength: string
    }
    assets: {
        logoLight: string
        logoDark: string
        favicon: string
    }
}

const defaultBrandKit: BrandKit = {
    colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#000000',
    },
    typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        baseFontSize: '16px',
    },
    uiStyle: {
        borderRadius: '8px',
        buttonRadius: '4px',
        shadowStrength: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    assets: {
        logoLight: '',
        logoDark: '',
        favicon: '',
    }
}

const GrapeJsEditor = ({ subaccountId, funnelId, pageDetails, websitePages, userId, websiteName, currentDomain, website }: Props) => {
    const router = useRouter()
    const editorRef = useRef<HTMLDivElement>(null)
    const editorInstanceRef = useRef<any>(null)
    const [pageName, setPageName] = useState(pageDetails?.name || 'Untitled Page')
    const [activeDevice, setActiveDevice] = useState('desktop')
    const [editorReady, setEditorReady] = useState(false)
    const [showBlocks, setShowBlocks] = useState(true)
    const [previewMode, setPreviewMode] = useState(false) // Preview mode state

    // Sidebar State
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
    const [activeSidebarTab, setActiveSidebarTab] = useState('blocks')

    // Publish Dialog State
    const [publishDialogOpen, setPublishDialogOpen] = useState(false)

    // Code Viewer State
    const [codeViewerOpen, setCodeViewerOpen] = useState(false)
    const [viewerHtml, setViewerHtml] = useState('')
    const [viewerCss, setViewerCss] = useState('')

    // Brand Kit State
    const [brandKit, setBrandKit] = useState<BrandKit>(() => {
        if (website?.settings?.brandKit) {
            return website.settings.brandKit
        }
        return defaultBrandKit
    })

    // Debug: Log when publishDialogOpen changes
    useEffect(() => {
        console.log('publishDialogOpen changed to:', publishDialogOpen)
    }, [publishDialogOpen])

    // Helper function to update box-shadow from individual properties
    const updateBoxShadow = (editor: any, changedProp?: string, changedVal?: any) => {
        try {
            // Critical safety check to prevent runtime errors during initialization/cleanup
            if (!editor || typeof editor.getSelected !== 'function') return

            // Verify editor is fully initialized
            if (!editorReady || !editorInstanceRef.current) return

            const selected = editor.getSelected()
            if (!selected || typeof selected.getStyle !== 'function' || typeof selected.addStyle !== 'function') return

            // If a specific property was changed, we store it so getStyle() picks it up
            if (changedProp) {
                selected.addStyle({ [changedProp]: changedVal })
            }

            const style = selected.getStyle()
            const h = style['shadow-h'] || '0px'
            const v = style['shadow-v'] || '0px'
            const blur = style['shadow-blur'] || '0px'
            const spread = style['shadow-spread'] || '0px'
            const color = style['shadow-color'] || '#000000'
            const type = style['shadow-type'] || 'outset'
            const opacity = style['shadow-opacity'] !== undefined ? style['shadow-opacity'] : '0.5'

            let finalColor = color
            if (color.startsWith('#')) {
                // Convert HEX to RGBA with opacity
                let hex = color.slice(1)
                if (hex.length === 3) hex = hex.split('').map(s => s + s).join('')
                const r = parseInt(hex.slice(0, 2), 16) || 0
                const g = parseInt(hex.slice(2, 4), 16) || 0
                const b = parseInt(hex.slice(4, 6), 16) || 0
                finalColor = `rgba(${r}, ${g}, ${b}, ${opacity})`
            } else if (color.startsWith('rgb')) {
                // Adjust opacity in rgb/rgba strings
                finalColor = color.replace(/rgba?\(([^,]+),([^,]+),([^,)]+)(?:,[^,)]+)?\)/, `rgba($1,$2,$3,${opacity})`)
            }

            const inset = type === 'inset' ? 'inset ' : ''
            const boxShadowValue = `${inset}${h} ${v} ${blur} ${spread} ${finalColor}`.trim()

            console.log('Updating box-shadow:', boxShadowValue)
            selected.addStyle({ 'box-shadow': boxShadowValue })
        } catch (error) {
            console.error('Error in updateBoxShadow:', error)
        }
    }

    // Smart Canvas: Auto-scaling logic (Moved to component scope)
    const updateCanvasZoom = useCallback(() => {
        if (!editorInstanceRef.current || !editorRef.current) return

        const editor = editorInstanceRef.current
        setTimeout(() => {
            const container = editorRef.current
            if (!container || !editor) return

            const rect = container.getBoundingClientRect()
            const containerWidth = rect.width

            // Use standard GrapesJS Devices getter
            const deviceModule = editor.Devices
            const currentDevice = deviceModule ? deviceModule.get(editor.getDevice()) : null
            const deviceWidth = currentDevice ? (parseInt(currentDevice.get('width')) || containerWidth) : containerWidth
            const padding = 80
            const availableWidth = containerWidth - padding

            // Safe Zoom Calculation
            let zoom = 1
            if (deviceWidth > availableWidth) {
                zoom = availableWidth / deviceWidth
            }

            // Clamp zoom to reasonable limits (10% to 120%)
            zoom = Math.max(0.1, Math.min(zoom, 1.2))

            editor.Canvas.setZoom(zoom * 100)

            // Dynamic Height Calculation:
            const frameWrapper = container.querySelector('.gjs-frame-wrapper') as HTMLElement
            if (frameWrapper) {
                const visualHeightTarget = rect.height - 80
                const requiredHeight = visualHeightTarget / zoom
                frameWrapper.style.setProperty('height', `${requiredHeight}px`, 'important')
                frameWrapper.style.setProperty('min-height', `${requiredHeight}px`, 'important')
            }
        }, 100)
    }, [])

    useEffect(() => {
        if (!editorRef.current) return

        const escapeName = (name: string) => `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, "-")


        const editor = grapesjs.init({
            container: editorRef.current,
            // ... (rest of init)
            width: 'auto',
            height: 'calc(100vh - 60px)',
            fromElement: false,
            storageManager: false,
            selectorManager: {
                escapeName,
                // Add states for different interaction types (hover, active, etc)
                states: [
                    { name: 'hover', label: 'Hover' },
                    { name: 'active', label: 'Click' },
                    { name: 'nth-of-type(2n)', label: 'Even' },
                ]
            },
            panels: { defaults: [] },
            colorPicker: {
                palette: [
                    '#ffffff', '#000000', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a',
                    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
                ]
            },
            plugins: [
                gjsForms,
                gjsForms,
                gjsCountdown,
                gjsCustomCode,
                gjsTouch,
                gjsParserPostcss,
                gjsTooltip,
            ],
            canvas: {
                styles: [
                    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap'
                ],
                scripts: [
                    'https://cdn.tailwindcss.com',
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
                // Blocks are rendered manually in EditorSidebar
            },
            styleManager: {
                clearProperties: true,
                defaults: {
                    scrubbing: true
                },
                sectors: [
                    {
                        name: 'General',
                        open: true,
                        properties: [
                            {
                                property: 'display',
                                type: 'select',
                                list: [
                                    { value: 'block', name: 'block' },
                                    { value: 'inline', name: 'inline' },
                                    { value: 'inline-block', name: 'inline-block' },
                                    { value: 'flex', name: 'flex' },
                                    { value: 'none', name: 'none' },
                                ],
                            },
                            {
                                property: 'float',
                                type: 'radio',
                                list: [
                                    { value: 'none', name: 'none' },
                                    { value: 'left', name: 'left' },
                                    { value: 'right', name: 'right' },
                                ],
                            },
                            {
                                property: 'position',
                                type: 'radio',
                                list: [
                                    { value: 'static', name: 'static' },
                                    { value: 'relative', name: 'relative' },
                                    { value: 'absolute', name: 'absolute' },
                                    { value: 'fixed', name: 'fixed' },
                                ],
                            },
                            {
                                property: 'coordinates',
                                name: 'Coordinates',
                                type: 'composite',
                                properties: [
                                    {
                                        property: 'top',
                                        type: 'number',
                                        units: ['px', '%', 'vh'],
                                        defaults: 'auto',
                                        step: 1,
                                    },
                                    {
                                        property: 'right',
                                        type: 'number',
                                        units: ['px', '%', 'vw'],
                                        defaults: 'auto',
                                        step: 1,
                                    },
                                    {
                                        property: 'bottom',
                                        type: 'number',
                                        units: ['px', '%', 'vh'],
                                        defaults: 'auto',
                                        step: 1,
                                    },
                                    {
                                        property: 'left',
                                        type: 'number',
                                        units: ['px', '%', 'vw'],
                                        defaults: 'auto',
                                        step: 1,
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        name: 'Typography',
                        open: true,
                        properties: [
                            {
                                property: 'text-align',
                                name: 'Text Align',
                                type: 'radio',
                                list: [
                                    { value: 'left', name: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>' },
                                    { value: 'center', name: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>' },
                                    { value: 'right', name: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>' },
                                    { value: 'justify', name: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>' },
                                ]
                            },
                            {
                                property: 'font-family',
                                name: 'Font Family',
                                type: 'select',
                                list: [
                                    { value: '', name: 'Default' },
                                    { value: 'Inter, sans-serif', name: 'Inter' },
                                    { value: 'Roboto, sans-serif', name: 'Roboto' },
                                    { value: 'Montserrat, sans-serif', name: 'Montserrat' },
                                    { value: 'Poppins, sans-serif', name: 'Poppins' },
                                    { value: 'Open Sans, sans-serif', name: 'Open Sans' },
                                    { value: 'Playfair Display, serif', name: 'Playfair Display' },
                                    { value: 'Lora, serif', name: 'Lora' },
                                    { value: 'monospace', name: 'Monospace' },
                                ]
                            },
                            { property: 'color', name: 'Color', type: 'color', defaults: '#000000' },
                            {
                                property: 'font-weight',
                                name: 'Weight',
                                type: 'select',
                                list: [
                                    { value: '100', name: 'Thin' },
                                    { value: '300', name: 'Light' },
                                    { value: '400', name: 'Regular' },
                                    { value: '500', name: 'Medium' },
                                    { value: '600', name: 'Semi-Bold' },
                                    { value: '700', name: 'Bold' },
                                    { value: '900', name: 'Black' },
                                ]
                            },
                            {
                                property: 'font-size',
                                name: 'Size',
                                type: 'number',
                                units: ['px', 'rem', 'em', '%'],
                                defaults: '16px',
                                step: 1,
                            },
                            {
                                property: 'line-height',
                                name: 'Line Height',
                                type: 'number',
                                units: ['px', 'rem', 'em', '%'],
                                defaults: '1.5',
                                step: 0.1,
                            },
                            {
                                property: 'letter-spacing',
                                name: 'Spacing',
                                type: 'number',
                                units: ['px', 'rem', 'em'],
                                defaults: '0px',
                                step: 1,
                            },
                        ]
                    },
                    {
                        name: 'Dimensions',
                        open: true,
                        properties: [
                            {
                                property: 'width',
                                name: 'Width',
                                type: 'number',
                                units: ['px', '%', 'vw', 'auto'],
                                defaults: 'auto',
                                step: 1
                            },
                            {
                                property: 'height',
                                name: 'Height',
                                type: 'number',
                                units: ['px', '%', 'vh', 'auto'],
                                defaults: 'auto',
                                step: 1
                            },
                            {
                                property: 'margin',
                                name: 'Margin',
                                type: 'composite',
                                properties: [
                                    {
                                        property: 'margin-top',
                                        name: 'Top',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'margin-right',
                                        name: 'Right',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'margin-bottom',
                                        name: 'Bottom',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'margin-left',
                                        name: 'Left',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                ]
                            },
                            {
                                property: 'padding',
                                name: 'Padding',
                                type: 'composite',
                                properties: [
                                    {
                                        property: 'padding-top',
                                        name: 'Top',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'padding-right',
                                        name: 'Right',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'padding-bottom',
                                        name: 'Bottom',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'padding-left',
                                        name: 'Left',
                                        type: 'number',
                                        units: ['px', '%', 'em', 'rem'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        name: 'Decorations',
                        open: true,
                        properties: [
                            { property: 'opacity', name: 'Opacity', type: 'slider', min: 0, max: 1, step: 0.1, defaults: '1' },
                            { property: 'border-radius', name: 'Border Radius', type: 'slider', min: 0, max: 100, step: 1, defaults: '0', units: ['px', '%', 'rem'] },
                            {
                                property: 'border-radius-corners',
                                name: 'Individual Corners',
                                type: 'composite',
                                properties: [
                                    {
                                        property: 'border-top-left-radius',
                                        name: 'Top-L',
                                        type: 'number',
                                        units: ['px', '%'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'border-top-right-radius',
                                        name: 'Top-R',
                                        type: 'number',
                                        units: ['px', '%'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'border-bottom-left-radius',
                                        name: 'Bot-L',
                                        type: 'number',
                                        units: ['px', '%'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                    {
                                        property: 'border-bottom-right-radius',
                                        name: 'Bot-R',
                                        type: 'number',
                                        units: ['px', '%'],
                                        defaults: '0px',
                                        step: 1
                                    },
                                ]
                            },
                            {
                                property: 'smart-bg-verified',
                                name: 'Start Background',
                                type: 'smart-bg-type',
                                full: true,
                            },
                            { property: 'border', name: 'Border' },
                        ]
                    },
                    {
                        name: 'Flexbox',
                        open: false,
                        properties: [
                            {
                                property: 'justify-content',
                                name: 'Justify Content',
                                type: 'radio',
                                list: [
                                    { value: 'flex-start', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="2" height="20"></rect><rect x="9" y="5" width="4" height="6"></rect><rect x="9" y="13" width="7" height="6"></rect></svg>' },
                                    { value: 'center', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="5" width="6" height="6"></rect><rect x="6" y="13" width="12" height="6"></rect></svg>' },
                                    { value: 'flex-end', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="2" width="2" height="20"></rect><rect x="11" y="5" width="4" height="6"></rect><rect x="8" y="13" width="7" height="6"></rect></svg>' },
                                    { value: 'space-between', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="4" height="14"></rect><rect x="18" y="5" width="4" height="14"></rect></svg>' },
                                    { value: 'space-around', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="4" height="14"></rect><rect x="15" y="5" width="4" height="14"></rect></svg>' },
                                ]
                            },
                            {
                                property: 'align-items',
                                name: 'Align Items',
                                type: 'radio',
                                list: [
                                    { value: 'flex-start', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="2"></rect><rect x="5" y="9" width="6" height="4"></rect><rect x="13" y="9" width="6" height="7"></rect></svg>' },
                                    { value: 'center', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="6" height="6"></rect><rect x="13" y="6" width="6" height="12"></rect></svg>' },
                                    { value: 'flex-end', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="18" width="20" height="2"></rect><rect x="5" y="11" width="6" height="4"></rect><rect x="13" y="8" width="6" height="7"></rect></svg>' },
                                ]
                            },
                            {
                                property: 'flex-direction',
                                name: 'Direction',
                                type: 'radio',
                                list: [
                                    { value: 'row', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
                                    { value: 'column', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="5 12 12 19 19 12"></polyline></svg>' },
                                    { value: 'row-reverse', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>' },
                                    { value: 'column-reverse', name: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="19 12 12 5 5 12"></polyline></svg>' },
                                ]
                            },
                        ]
                    }
                ]
            },
            deviceManager: {
                devices: [
                    { name: 'desktop', width: '1200px' }, // Smart Canvas: Fixed width for desktop
                    { name: 'tablet', width: '768px', widthMedia: '992px' },
                    { name: 'mobile', width: '375px', widthMedia: '480px' },
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
            plugins: [
                gjsForms,
                gjsCountdown,
                gjsCustomCode,
                gjsTouch,
                gjsParserPostcss,
                gjsTooltip,
            ],
            pluginsOpts: {
                [gjsForms]: {},
                [gjsCountdown]: {},
                [gjsCustomCode]: {},
            }
        })

        // Reactive Content Load


        // All sectors are now defined in the init call to ensure correct parsing and UI

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

        // AUTO-SELECT CLASS ON COMPONENT SELECTION
        // This is critical for "revealing" styles from templates.
        // If a component has classes, we select the first one so the Style Manager
        // shows the class-based styles instead of the empty ID styles.
        editor.on('component:selected', (component: any) => {
            if (!component) return;

            const selectors = component.getSelectors();
            const selectorManager = editor.SelectorManager;

            if (selectors.length > 0) {
                const firstSelector = selectors.at(0);
                if (firstSelector) {
                    // Slight delay to ensure editor state is ready for selection override
                    setTimeout(() => {
                        try {
                            if (typeof selectorManager.select === 'function') {
                                selectorManager.select(firstSelector);
                            } else {
                                selectorManager.addSelected(firstSelector);
                            }
                            editor.StyleManager.render();
                        } catch (e) {
                            console.warn('Selector selection failed:', e);
                        }
                    }, 50);
                }
            }
        });

        editorInstanceRef.current = editor

        // Setup Resize Observer using the component-level function
        const resizeObserver = new ResizeObserver(() => {
            updateCanvasZoom()
        })

        if (editorRef.current) {
            resizeObserver.observe(editorRef.current)
        }

        editor.on('device:select', updateCanvasZoom)


        // Preview Mode Listeners
        editor.on('run:preview', () => {
            setPreviewMode(true)
            setShowBlocks(false) // Optionally hide blocks state if needed to sync
        })

        editor.on('stop:preview', () => {
            setPreviewMode(false)
            setShowBlocks(true)
        })

        // Efficient initialization check
        setTimeout(() => {
            const wrapper = editor.getWrapper ? editor.getWrapper() : null
            if (editor && wrapper) {
                setEditorReady(true)
                // Trigger initial zoom
                updateCanvasZoom()
            } else {
                console.warn('Editor wrapper not ready, retrying...')
                // Retry once
                setTimeout(() => {
                    if (editor && editor.getWrapper()) setEditorReady(true)
                }, 500)
            }
        }, 150)

        return () => {
            resizeObserver.disconnect()
            setEditorReady(false)
            editorInstanceRef.current = null
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

        // RE-APPLY SMART CANVAS LOGIC AFTER CONTENT LOAD
        // This fixes the "snap back" issue where loading content resets frame height
        setTimeout(() => {
            updateCanvasZoom()
        }, 200)

    }, [pageDetails, editorReady])

    // Inject Brand Kit Styles into Canvas
    useEffect(() => {
        if (!editorReady || !editorInstanceRef.current || !brandKit) return

        const editor = editorInstanceRef.current
        const canvas = editor.Canvas
        const body = canvas.getBody()
        if (!body) return

        // Create or Update Brand Style Tag
        let brandStyle = body.querySelector('#brand-kit-styles')
        if (!brandStyle) {
            brandStyle = document.createElement('style')
            brandStyle.id = 'brand-kit-styles'
            body.appendChild(brandStyle)
        }

        const cssVariables = `
            :root {
                --brand-primary: ${brandKit.colors.primary};
                --brand-secondary: ${brandKit.colors.secondary};
                --brand-accent: ${brandKit.colors.accent};
                --brand-bg: ${brandKit.colors.background};
                --brand-text: ${brandKit.colors.text};
                --brand-heading-font: ${brandKit.typography.headingFont};
                --brand-body-font: ${brandKit.typography.bodyFont};
                --brand-base-size: ${brandKit.typography.baseFontSize};
                --brand-radius: ${brandKit.uiStyle.borderRadius};
                --brand-btn-radius: ${brandKit.uiStyle.buttonRadius};
                --brand-shadow: ${brandKit.uiStyle.shadowStrength};
            }

            body {
                font-family: var(--brand-body-font), sans-serif;
                background-color: var(--brand-bg);
                color: var(--brand-text);
                font-size: var(--brand-base-size);
            }

            h1, h2, h3, h4, h5, h6 {
                font-family: var(--brand-heading-font), sans-serif;
            }
        `
        brandStyle.innerHTML = cssVariables

        // Inject Fonts if needed (Assuming Google Fonts for simplicity now)
        const doc = canvas.getDocument()
        if (doc) {
            const head = doc.head
            let fontLink = head.querySelector('#brand-fonts')
            if (!fontLink) {
                fontLink = document.createElement('link')
                fontLink.id = 'brand-fonts'
                fontLink.rel = 'stylesheet'
                head.appendChild(fontLink)
            }
            const fonts = [brandKit.typography.headingFont, brandKit.typography.bodyFont]
            const uniqueFonts = Array.from(new Set(fonts)).map(f => f.replace(/\s+/g, '+'))
            fontLink.href = `https://fonts.googleapis.com/css2?family=${uniqueFonts.join('&family=')}:wght@300;400;500;600;700&display=swap`
        }

    }, [brandKit, editorReady])

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
    const handlePreview = () => {
        if (!editorInstanceRef.current) return
        setPreviewMode(true)
        editorInstanceRef.current.runCommand('core:preview')
    }

    const handleSave = async () => {
        if (!editorInstanceRef.current) return

        try {
            const projectData = editorInstanceRef.current.getProjectData()
            const html = editorInstanceRef.current.getHtml()
            const css = editorInstanceRef.current.getCss()

            let previewImage = pageDetails.previewImage
            try {
                const html2canvas = (await import('html2canvas')).default

                const iframe = editorRef.current?.querySelector('iframe') as HTMLIFrameElement
                if (iframe?.contentWindow && iframe?.contentDocument?.body) {
                    // Scroll to top to capture hero section
                    iframe.contentWindow.scrollTo(0, 0)

                    // Wait for images and animations to load
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Capture hero section at full quality
                    const canvas = await html2canvas(iframe.contentDocument.body, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 1, // Full scale for maximum quality
                        logging: false,
                        height: 800, // Capture top 800px (hero section)
                        windowHeight: 800,
                        y: 0,
                        scrollY: 0,
                        scrollX: 0,
                        backgroundColor: '#ffffff'
                    })

                    // Create thumbnail with standard dimensions
                    const THUMBNAIL_WIDTH = 400
                    const THUMBNAIL_HEIGHT = 300

                    const resizedCanvas = document.createElement('canvas')
                    resizedCanvas.width = THUMBNAIL_WIDTH
                    resizedCanvas.height = THUMBNAIL_HEIGHT

                    const ctx = resizedCanvas.getContext('2d')
                    if (ctx) {
                        // Enable high-quality image smoothing
                        ctx.imageSmoothingEnabled = true
                        ctx.imageSmoothingQuality = 'high'

                        // Fill with white background
                        ctx.fillStyle = '#ffffff'
                        ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)

                        // Calculate dimensions for cover-style cropping
                        const sourceAspectRatio = canvas.width / canvas.height
                        const targetAspectRatio = THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT

                        let sourceX = 0
                        let sourceY = 0
                        let sourceWidth = canvas.width
                        let sourceHeight = canvas.height

                        // Crop to match target aspect ratio
                        if (sourceAspectRatio > targetAspectRatio) {
                            // Source is wider - crop sides
                            sourceWidth = canvas.height * targetAspectRatio
                            sourceX = (canvas.width - sourceWidth) / 2
                        } else {
                            // Source is taller - crop bottom (keep top/hero)
                            sourceHeight = canvas.width / targetAspectRatio
                            sourceY = 0
                        }

                        // Draw cropped and scaled image
                        ctx.drawImage(
                            canvas,
                            sourceX, sourceY, sourceWidth, sourceHeight,
                            0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT
                        )

                        previewImage = resizedCanvas.toDataURL('image/jpeg', 0.85)
                    } else {
                        previewImage = canvas.toDataURL('image/jpeg', 0.8)
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

    const handlePublish = () => {
        console.log('=== PUBLISH BUTTON CLICKED ===')
        setPublishDialogOpen(true)
    }

    const handleFullPreview = async () => {
        await handleSave()
        window.open(`/site-preview/${funnelId}`, '_blank')
    }

    const handleViewCode = () => {
        if (!editorInstanceRef.current) return
        const editor = editorInstanceRef.current
        setViewerHtml(editor.getHtml() || '')
        setViewerCss(editor.getCss() || '')
        setCodeViewerOpen(true)
    }

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
            })
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }

    const handleImport = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json,.html'
        input.onchange = async (e: any) => {
            const file = e.target.files[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = (event: any) => {
                const content = event.target.result
                if (!editorInstanceRef.current) return

                try {
                    if (file.name.endsWith('.json')) {
                        const data = JSON.parse(content)
                        editorInstanceRef.current.loadProjectData(data)
                        toast({ title: 'Import Successful', description: 'Project data loaded from JSON file.' })
                    } else if (file.name.endsWith('.html')) {
                        editorInstanceRef.current.setComponents(content)
                        toast({ title: 'Import Successful', description: 'HTML content loaded from file.' })
                    }
                } catch (error) {
                    console.error('Import error:', error)
                    toast({ title: 'Import Failed', description: 'Could not parse the file content.', variant: 'destructive' })
                }
            }
            reader.readAsText(file)
        }
        input.click()
    }

    useEffect(() => {
        if (!editorReady || !editorInstanceRef.current) return
        const editor = editorInstanceRef.current

        // Manual Type Registration (Force)
        console.log('Force registering smart-bg-type inside useEffect...');
        editor.StyleManager.addType('smart-bg-type', {
            create({ props, change }: any) {
                const el = document.createElement('div');
                el.className = 'smart-bg-wrapper';
                el.style.width = '100%';
                el.style.minHeight = '50px';
                el.style.border = '2px solid cyan'; // DIAGNOSTIC
                el.style.background = 'rgba(0, 255, 255, 0.1)'; // DIAGNOSTIC
                el.innerHTML = '<div style="color: cyan; font-weight: bold; padding: 4px;">ADVANCED MODE DIAGNOSTIC</div>';
                return el;
            },
            emit({ props, change }: any) {
                // No-op
            },
            update({ el, props }: any) {
                // No-op, handled by React
            },
            onRender({ el, props }: any) {
                if (!el._root) {
                    el._root = createRoot(el);
                }
                el._root.render(
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <BackgroundLayers editor={editor} property={props} />
                    </div>
                );
            },
        });

        // Refresh Style Manager to pick up custom types
        editor.StyleManager.render();

        console.log('Registering custom blocks:', customBlocks.length)
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
        <EditorProvider
            subaccountId={subaccountId}
            funnelId={funnelId}
            pageDetails={pageDetails}
        >
            {editorInstanceRef.current && (
                <GjsEditorBridge editor={editorInstanceRef.current} />
            )}
            <div className="h-screen w-full flex flex-col bg-background">
                {!previewMode && (
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
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleViewCode} className="gap-2">
                                <Code className="w-4 h-4" />
                                <span className="hidden sm:inline">View Code</span>
                            </Button>
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
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleUndo}><Undo className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={handleRedo}><Redo className="w-4 h-4" /></Button>
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button variant="ghost" size="sm" onClick={handleToggleFullscreen} title="Toggle Fullscreen">
                                <Maximize className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handlePreview}><Eye className="w-4 h-4 mr-2" />Preview</Button>
                            <Button variant="ghost" size="sm" onClick={handleFullPreview}><ExternalLink className="w-4 h-4 mr-2" />Full Site</Button>
                            <div className="w-px h-6 bg-border mx-1" />
                            <Button variant="outline" size="sm" onClick={handleImport} className="gap-2">
                                <FileUp className="w-4 h-4" />
                                <span className="hidden sm:inline">Import</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button>
                            <Button size="sm" onClick={handlePublish}><Upload className="w-4 h-4 mr-2" />Publish</Button>
                        </div>
                    </div>
                )}
                <div className="flex-1 flex overflow-hidden w-full relative">
                    {!previewMode && editorReady && editorInstanceRef.current && (
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
                            brandKit={brandKit}
                            setBrandKit={setBrandKit}
                            website={website}
                        />
                    )}
                    <main className="flex-1 relative min-w-0 overflow-auto bg-[#0b0d11]">
                        <div id="gjs" ref={editorRef} className="absolute inset-0 w-full h-full"></div>
                        {/* Exit Preview Button */}
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
                    {!previewMode && editorReady && editorInstanceRef.current && (
                        <aside className="flex-shrink-0 w-[260px] border-l bg-background z-40 relative h-full overflow-hidden">
                            <StylePanel editor={editorInstanceRef.current} subaccountId={subaccountId} />
                        </aside>
                    )}
                </div>

                {/* Publish Dialog */}
                {console.log('Rendering PublishDialog section, editorReady:', editorReady, 'instance:', !!editorInstanceRef.current, 'open:', publishDialogOpen)}
                {
                    editorReady && editorInstanceRef.current && (
                        <PublishDialog
                            open={publishDialogOpen}
                            onOpenChange={setPublishDialogOpen}
                            editorInstance={editorInstanceRef.current}
                            websiteId={funnelId}
                            subaccountId={subaccountId}
                            websiteName={websiteName || 'Untitled Website'}
                            userId={userId || ''}
                            currentDomain={currentDomain}
                            subdomain={website?.subdomain || undefined}
                            isPublished={website?.published}
                        />
                    )
                }
                {editorReady && editorInstanceRef.current && (
                    <GjsEditorBridge editor={editorInstanceRef.current} />
                )}

                <CodeViewerDialog
                    open={codeViewerOpen}
                    onOpenChange={setCodeViewerOpen}
                    html={viewerHtml}
                    css={viewerCss}
                />
            </div >
        </EditorProvider>
    )
}

export default GrapeJsEditor
