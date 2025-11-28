'use client'
'use client'
'use client'

import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import React, { useEffect, useRef } from 'react'
import interact from 'interactjs'

type Props = {
    children: React.ReactNode
    element: EditorElement
}

const ResizableWrapper = ({ children, element }: Props) => {
    const { state, dispatch } = useEditor()
    const elementRef = useRef<HTMLDivElement>(null)

    // Store the latest element in a ref to access it inside interact listeners
    // without triggering re-initialization of the interact instance
    const latestElementRef = useRef<EditorElement>(element)

    // Update the ref whenever the element prop changes
    useEffect(() => {
        latestElementRef.current = element
    }, [element])

    const isSelected = state.editor.selectedElement.id === element.id
    const isLiveMode = state.editor.liveMode

    useEffect(() => {
        if (!isLiveMode && isSelected && elementRef.current) {
            const interactable = interact(elementRef.current)
                .resizable({
                    // resize from all edges and corners
                    edges: {
                        left: '.resize-handle-left',
                        right: '.resize-handle-right',
                        bottom: '.resize-handle-bottom',
                        top: '.resize-handle-top',
                    },

                    listeners: {
                        move(event) {
                            const target = event.target as HTMLElement
                            // Access the latest element state from the ref
                            const currentElement = latestElementRef.current

                            // update the element's style
                            const newWidth = event.rect.width
                            const newHeight = event.rect.height

                            // Parse current transform or default to 0,0
                            const transform = currentElement.styles.transform || 'translate(0px, 0px)'
                            const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)

                            let x = 0
                            let y = 0

                            if (match) {
                                x = parseFloat(match[1])
                                y = parseFloat(match[2])
                            }

                            // Update x and y based on deltaRect
                            x += event.deltaRect.left
                            y += event.deltaRect.top

                            dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: {
                                    elementDetails: {
                                        ...currentElement,
                                        styles: {
                                            ...currentElement.styles,
                                            width: `${newWidth}px`,
                                            height: `${newHeight}px`,
                                            transform: `translate(${x}px, ${y}px)`,
                                        },
                                    },
                                },
                            })
                        },
                    },
                    modifiers: [
                        // keep the edges inside the parent
                        interact.modifiers.restrictEdges({
                            outer: 'parent',
                        }),

                        // minimum size
                        interact.modifiers.restrictSize({
                            min: { width: 50, height: 50 },
                        }),
                        interact.modifiers.snapSize({
                            targets: [interact.snappers.grid({ x: 50, y: 50 })],
                        }),
                    ],
                    invert: 'reposition',
                    autoScroll: {
                        container: '#funnel-editor-canvas',
                        margin: 50,
                        distance: 5,
                        interval: 10,
                        speed: 300,
                    },
                })
                .draggable({
                    listeners: {
                        move(event) {
                            const target = event.target as HTMLElement
                            const currentElement = latestElementRef.current

                            // Parse current transform or default to 0,0
                            const transform = currentElement.styles.transform || 'translate(0px, 0px)'
                            const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)

                            let x = 0
                            let y = 0

                            if (match) {
                                x = parseFloat(match[1])
                                y = parseFloat(match[2])
                            }

                            x += event.dx
                            y += event.dy

                            dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: {
                                    elementDetails: {
                                        ...currentElement,
                                        styles: {
                                            ...currentElement.styles,
                                            transform: `translate(${x}px, ${y}px)`,
                                        },
                                    },
                                },
                            })
                        },
                    },
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: 'parent',
                            endOnly: true,
                        }),
                        interact.modifiers.snap({
                            targets: [interact.snappers.grid({ x: 50, y: 50 })],
                            range: Infinity,
                            relativePoints: [{ x: 0, y: 0 }],
                        }),
                    ],
                    autoScroll: {
                        container: '#funnel-editor-canvas',
                        margin: 50,
                        distance: 5,
                        interval: 10,
                        speed: 300,
                    },
                    ignoreFrom: 'input, textarea, [contenteditable], a, button',
                })

            return () => {
                interactable.unset()
            }
        }
        // Removed 'element' from dependency array to prevent re-initialization
    }, [isLiveMode, isSelected, dispatch])

    if (!isSelected || isLiveMode) return <>{children}</>

    return (
        <div
            className="relative group resize-drag"
            ref={elementRef}
            style={{
                width: element.styles.width,
                height: element.styles.height,
                marginTop: element.styles.marginTop,
                marginLeft: element.styles.marginLeft,
                transform: element.styles.transform, // Apply transform here
                position: 'relative',
                touchAction: 'none', // Prevent browser panning
                userSelect: 'none', // Disable text selection
            }}
        >
            {children}

            {/* Visual indicators for resize handles can be added here if needed,
          but interact.js handles the interaction logic on the element itself.
          We might want to keep visual handles for better UX. */}

            {/* Right Handle */}
            <div className="resize-handle-right absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-500 cursor-ew-resize z-50 rounded-full hover:scale-125 transition-transform" />

            {/* Left Handle */}
            <div className="resize-handle-left absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-500 cursor-ew-resize z-50 rounded-full hover:scale-125 transition-transform" />

            {/* Bottom Handle */}
            <div className="resize-handle-bottom absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-blue-500 cursor-ns-resize z-50 rounded-full hover:scale-125 transition-transform" />

            {/* Top Handle */}
            <div className="resize-handle-top absolute top-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-blue-500 cursor-ns-resize z-50 rounded-full hover:scale-125 transition-transform" />
        </div>
    )
}

export default ResizableWrapper
