'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useEmailEditor } from '@/providers/editor/email-editor-provider'
import clsx from 'clsx'
import React from 'react'
import { v4 } from 'uuid'
import Recursive from './recursive'
import { Trash } from 'lucide-react'

type Props = { element: EditorElement }

const EmailContainer = ({ element }: Props) => {
    const { id, content, name, styles, type } = element
    const { dispatch, state } = useEmailEditor()

    const handleOnDrop = (e: React.DragEvent, type: string) => {
        e.stopPropagation()
        const componentType = e.dataTransfer.getData('componentType') as EditorBtns

        switch (componentType) {
            case 'text':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: { innerText: 'Text Element' },
                            id: v4(),
                            name: 'Text',
                            styles: {
                                color: 'black',
                                padding: '10px',
                                ...defaultStyles,
                            },
                            type: 'text',
                        },
                    },
                })
                break
            case 'link':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                innerText: 'Link Element',
                                href: '#',
                            },
                            id: v4(),
                            name: 'Link',
                            styles: {
                                color: 'blue',
                                textDecoration: 'underline',
                                padding: '10px',
                                ...defaultStyles,
                            },
                            type: 'link',
                        },
                    },
                })
                break
            case 'container':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: 'Container',
                            styles: { ...defaultStyles, padding: '20px' },
                            type: 'container',
                        },
                    },
                })
                break
            case 'image':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                src: 'https://via.placeholder.com/600x400',
                            },
                            id: v4(),
                            name: 'Image',
                            styles: {
                                width: '100%',
                                height: 'auto',
                            },
                            type: 'image',
                        },
                    },
                })
                break
            case '2Col':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%', padding: '10px' },
                                    type: 'container',
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%', padding: '10px' },
                                    type: 'container',
                                },
                            ],
                            id: v4(),
                            name: 'Two Columns',
                            styles: { ...defaultStyles, display: 'flex' },
                            type: '2Col',
                        },
                    },
                })
                break
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDragStart = (e: React.DragEvent, type: string) => {
        if (type === '__body') return
        e.dataTransfer.setData('componentType', type)
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: element,
            },
        })
    }

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: {
                elementDetails: element,
            },
        })
    }

    return (
        <div
            style={styles}
            className={clsx('relative transition-all group', {
                'max-w-full w-full': type === 'container' || type === '2Col',
                'h-fit min-h-[40px]': type === 'container',
                'min-h-full h-full': type === '__body',
                'flex flex-col md:!flex-row': type === '2Col',
                'ring-2 ring-primary':
                    state.editor.selectedElement.id === id &&
                    !state.editor.previewMode &&
                    state.editor.selectedElement.type !== '__body',
                'ring-4 ring-yellow-400':
                    state.editor.selectedElement.id === id &&
                    !state.editor.previewMode &&
                    state.editor.selectedElement.type === '__body',
                'border-dashed border-[1px] border-slate-300': !state.editor.previewMode && type !== '__body',
                'p-8': type === '__body',
            })}
            onDrop={(e) => handleOnDrop(e, id)}
            onDragOver={handleDragOver}
            draggable={type !== '__body'}
            onClick={handleOnClickBody}
            onDragStart={(e) => handleDragStart(e, 'container')}
        >
            {state.editor.selectedElement.id === element.id &&
                !state.editor.previewMode && (
                    <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg z-[50]">
                        {element.name}
                    </Badge>
                )}

            {Array.isArray(content) &&
                content.map((childElement) => (
                    <Recursive
                        key={childElement.id}
                        element={childElement}
                    />
                ))}

            {state.editor.selectedElement.id === element.id &&
                !state.editor.previewMode &&
                state.editor.selectedElement.type !== '__body' && (
                    <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg z-[50] !text-white">
                        <Trash
                            size={16}
                            className="cursor-pointer"
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    )
}

export default EmailContainer
