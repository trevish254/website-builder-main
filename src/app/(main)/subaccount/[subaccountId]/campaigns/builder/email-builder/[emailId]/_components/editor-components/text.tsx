'use client'
import { Badge } from '@/components/ui/badge'
import { useEmailEditor } from '@/providers/editor/email-editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'
import { EditorElement } from '@/providers/editor/email-editor-provider'

type Props = {
    element: EditorElement
}

const EmailTextComponent = (props: Props) => {
    const { dispatch, state } = useEmailEditor()

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: props.element },
        })
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: props.element,
            },
        })
    }

    return (
        <div
            style={props.element.styles}
            className={clsx(
                'p-[2px] w-full m-[5px] relative text-[16px] transition-all cursor-text',
                {
                    'ring-2 ring-primary ring-offset-2':
                        state.editor.selectedElement.id === props.element.id,
                    'border-dashed border-[1px] border-slate-300': !state.editor.previewMode,
                }
            )}
            onClick={handleOnClickBody}
        >
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.previewMode && (
                    <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
                        {state.editor.selectedElement.name}
                    </Badge>
                )}
            <div
                contentEditable={!state.editor.previewMode}
                onBlur={(e) => {
                    const divElement = e.target as HTMLDivElement
                    dispatch({
                        type: 'UPDATE_ELEMENT',
                        payload: {
                            elementDetails: {
                                ...props.element,
                                content: {
                                    innerText: divElement.innerText,
                                },
                            },
                        },
                    })
                }}
                className="outline-none"
            >
                {!Array.isArray(props.element.content) &&
                    props.element.content.innerText}
            </div>
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.previewMode && (
                    <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white hover:bg-red-500">
                        <Trash
                            className="cursor-pointer"
                            size={16}
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    )
}

export default EmailTextComponent
