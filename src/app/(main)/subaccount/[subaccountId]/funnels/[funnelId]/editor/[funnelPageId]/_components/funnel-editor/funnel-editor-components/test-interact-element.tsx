'use client'

import React, { useEffect, useRef } from 'react'
import interact from 'interactjs'

const TestInteractElement = () => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const position = { x: 0, y: 0 }

            interact(ref.current)
                .draggable({
                    listeners: {
                        move(event) {
                            position.x += event.dx
                            position.y += event.dy

                            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
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
                })
                .resizable({
                    edges: { left: true, right: true, bottom: true, top: true },
                    listeners: {
                        move(event) {
                            let { x, y } = position

                            event.target.style.width = `${event.rect.width}px`
                            event.target.style.height = `${event.rect.height}px`

                            x += event.deltaRect.left
                            y += event.deltaRect.top

                            event.target.style.transform = `translate(${x}px, ${y}px)`

                            position.x = x
                            position.y = y
                        },
                    },
                    modifiers: [
                        interact.modifiers.restrictEdges({
                            outer: 'parent',
                        }),
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
        }
    }, [])

    return (
        <div
            ref={ref}
            style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#29b6f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 9999,
                touchAction: 'none',
                userSelect: 'none',
                borderRadius: '4px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
        >
            Test Me
        </div>
    )
}

export default TestInteractElement
