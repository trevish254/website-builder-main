'use client'

import React, { useEffect } from 'react'
import { useEditor } from '@/providers/editor/editor-provider'

type Props = {
    editor: any
}

// Map camelCase to kebab-case for GrapesJS
const camelToKebab = (str: string) => {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

// Map kebab-case to camelCase for React
const kebabToCamel = (str: string) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

const GjsEditorBridge = ({ editor }: Props) => {
    const { state, dispatch } = useEditor()

    useEffect(() => {
        if (!editor) return

        // 1. Sync Selection FROM Gjs TO React
        const handleSelection = () => {
            const selected = editor.getSelected()

            // REPAIRER FUNCTION - ABSOLUTE FORCE & EXPANDED VERSION
            const repairUI = () => {
                const toolbars = document.querySelectorAll('.gjs-toolbar');
                const badges = document.querySelectorAll('.gjs-badge');

                // DIMENSION CONSTANTS
                const BAR_HEIGHT = '30px';
                const ICON_SIZE = '16px';
                const ITEM_SIZE = '36px';

                toolbars.forEach((toolbar: any) => {
                    toolbar.style.setProperty('display', 'flex', 'important');
                    toolbar.style.setProperty('visibility', 'visible', 'important');
                    toolbar.style.setProperty('opacity', '1', 'important');
                    toolbar.style.setProperty('flex-direction', 'row', 'important');
                    toolbar.style.setProperty('flex-wrap', 'nowrap', 'important');
                    toolbar.style.setProperty('align-items', 'center', 'important');
                    toolbar.style.setProperty('justify-content', 'center', 'important');
                    toolbar.style.setProperty('height', BAR_HEIGHT, 'important');
                    toolbar.style.setProperty('top', `-${BAR_HEIGHT}`, 'important');
                    toolbar.style.setProperty('background-color', '#1e3a8a', 'important');
                    toolbar.style.setProperty('border-radius', '4px', 'important');

                    // FORCE MIN-WIDTH: At least 140px if there are items
                    const items = Array.from(toolbar.children);
                    if (items.length > 0) {
                        const calculatedWidth = Math.max(140, (items.length * 36) + 8);
                        toolbar.style.setProperty('min-width', `${calculatedWidth}px`, 'important');
                    }

                    toolbar.style.setProperty('z-index', '100000', 'important');
                    toolbar.style.setProperty('box-shadow', '0 2px 12px rgba(0,0,0,0.2)', 'important');

                    items.forEach((item: any) => {
                        item.style.setProperty('display', 'flex', 'important');
                        item.style.setProperty('visibility', 'visible', 'important');
                        item.style.setProperty('opacity', '1', 'important');
                        item.style.setProperty('width', ITEM_SIZE, 'important');
                        item.style.setProperty('height', BAR_HEIGHT, 'important');
                        item.style.setProperty('justify-content', 'center', 'important');
                        item.style.setProperty('align-items', 'center', 'important');
                        item.style.setProperty('flex-shrink', '0', 'important');

                        // Action Detection Logic (Aggressive)
                        const title = (item.title || item.getAttribute('title') || '').toLowerCase();
                        const className = (item.className || '').toLowerCase();
                        let iconSvg = '';

                        // MOVE
                        if (title.includes('move') || className.includes('tlb-move')) {
                            iconSvg = `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="white"><circle cx="4" cy="9" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="20" cy="9" r="2"/><circle cx="4" cy="15" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="20" cy="15" r="2"/></svg>`;
                        }
                        // CLONE / COPY
                        else if (title.includes('clone') || title.includes('copy') || className.includes('tlb-clone')) {
                            iconSvg = `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                        }
                        // DELETE
                        else if (title.includes('delete') || title.includes('remove') || className.includes('tlb-delete')) {
                            iconSvg = `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
                        }
                        // PARENT
                        else if (title.includes('parent') || title.includes('up') || className.includes('tlb-select-parent')) {
                            iconSvg = `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
                        }

                        if (iconSvg && (!item.querySelector('svg') || item.innerHTML.includes('gjs-'))) {
                            item.innerHTML = iconSvg;
                        }
                    });
                });

                badges.forEach((badge: any) => {
                    badge.style.setProperty('display', 'flex', 'important');
                    badge.style.setProperty('visibility', 'visible', 'important');
                    badge.style.setProperty('opacity', '1', 'important');
                    badge.style.setProperty('height', BAR_HEIGHT, 'important');
                    badge.style.setProperty('top', `-${BAR_HEIGHT}`, 'important');
                    badge.style.setProperty('background-color', '#3b82f6', 'important');
                    badge.style.setProperty('border-radius', '4px', 'important');
                    badge.style.setProperty('padding', '0 16px', 'important');
                    badge.style.setProperty('min-width', '80px', 'important');
                    badge.style.setProperty('z-index', '100001', 'important');
                    badge.style.setProperty('align-items', 'center', 'important');
                    badge.style.setProperty('justify-content', 'center', 'important');

                    let label = (badge.innerText || badge.textContent || '').trim();
                    if ((!label || label === 'COMPONENT') && selected) {
                        label = selected.getName() || selected.get('name') || selected.get('type') || 'Component';
                    }

                    if (label) {
                        badge.innerHTML = `<span style="color:white !important; white-space:nowrap; letter-spacing:0.8px; text-transform:uppercase; font-size:10px; font-weight:500;">${label}</span>`;
                    }
                });
            };

            // High-frequency Pulse
            const repairInterval = setInterval(repairUI, 50);
            setTimeout(() => clearInterval(repairInterval), 5000);

            try {
                const canvas = editor.Canvas;
                if (canvas && canvas.getBody) {
                    const canvasBody = canvas.getBody();
                    ['mouseover', 'mouseout', 'mousemove'].forEach(evt => {
                        canvasBody.addEventListener(evt, repairUI);
                    });
                }
            } catch (e) { }

            if (selected) {
                const gjsStyles = selected.getStyle()
                const reactStyles: any = {}
                Object.keys(gjsStyles).forEach(key => {
                    reactStyles[kebabToCamel(key)] = gjsStyles[key]
                })

                const elementDetails = {
                    id: selected.getId(),
                    name: selected.getName() || selected.get('name') || 'Component',
                    type: selected.get('type') || 'component',
                    styles: reactStyles,
                    content: selected.get('tagName') === 'a' ? { href: selected.getAttributes().href || '' } : []
                }

                dispatch({
                    type: 'CHANGE_CLICKED_ELEMENT',
                    payload: { elementDetails } as any
                })
            } else {
                dispatch({
                    type: 'CHANGE_CLICKED_ELEMENT',
                    payload: {}
                })
            }
        }

        editor.on('component:selected', handleSelection)
        editor.on('component:update:style', handleSelection)
        editor.on('component:hovered', handleSelection)

        return () => {
            editor.off('component:selected', handleSelection)
            editor.off('component:update:style', handleSelection)
            editor.off('component:hovered', handleSelection)
        }
    }, [editor, dispatch])

    const lastUpdateRef = React.useRef<string>('')

    useEffect(() => {
        const selected = editor?.getSelected()
        if (!selected || !state.editor.selectedElement.id) return
        if (selected.getId() !== state.editor.selectedElement.id) return

        const styles = state.editor.selectedElement.styles
        const styleString = JSON.stringify(styles)

        if (lastUpdateRef.current !== styleString) {
            lastUpdateRef.current = styleString
            const gjsStyles: any = {}
            Object.keys(styles).forEach(key => {
                gjsStyles[camelToKebab(key)] = (styles as any)[key]
            })
            selected.addStyle(gjsStyles)
            const content = state.editor.selectedElement.content
            if (content && typeof content === 'object' && 'href' in content) {
                selected.addAttributes({ href: content.href })
            }
        }
    }, [state.editor.selectedElement.styles, state.editor.selectedElement.content, editor])

    return null
}

export default GjsEditorBridge
