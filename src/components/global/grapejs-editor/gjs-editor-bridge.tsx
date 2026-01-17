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
            if (selected) {
                const gjsStyles = selected.getStyle()
                const reactStyles: any = {}

                // Convert kebab keys to camelCase for the React UI
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

        return () => {
            editor.off('component:selected', handleSelection)
            editor.off('component:update:style', handleSelection)
        }
    }, [editor, dispatch])

    // 2. Sync Style Updates FROM React TO Gjs
    // We use a ref to track the last applied style to avoid infinite loops
    const lastUpdateRef = React.useRef<string>('')

    useEffect(() => {
        const selected = editor?.getSelected()
        if (!selected || !state.editor.selectedElement.id) return
        if (selected.getId() !== state.editor.selectedElement.id) return

        const styles = state.editor.selectedElement.styles
        const styleString = JSON.stringify(styles)

        // Only apply if the change came from React
        if (lastUpdateRef.current !== styleString) {
            lastUpdateRef.current = styleString

            const gjsStyles: any = {}
            Object.keys(styles).forEach(key => {
                gjsStyles[camelToKebab(key)] = (styles as any)[key]
            })

            selected.addStyle(gjsStyles)

            // Handle attributes (like href)
            const content = state.editor.selectedElement.content
            if (content && typeof content === 'object' && 'href' in content) {
                selected.addAttributes({ href: content.href })
            }
        }
    }, [state.editor.selectedElement.styles, state.editor.selectedElement.content, editor])

    return null
}

export default GjsEditorBridge
