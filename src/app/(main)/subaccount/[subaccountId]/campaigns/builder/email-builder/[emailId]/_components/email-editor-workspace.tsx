'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useEmailEditor } from '@/providers/editor/email-editor-provider'
import clsx from 'clsx'
import { EyeOff } from 'lucide-react'
import Recursive from './editor-components/recursive'

type Props = { emailId: string }

const EmailEditorWorkspace = ({ emailId }: Props) => {
    const { dispatch, state, emailDetails } = useEmailEditor()

    useEffect(() => {
        if (emailDetails?.content) {
            try {
                dispatch({
                    type: 'LOAD_DATA',
                    payload: {
                        elements: JSON.parse(emailDetails.content),
                        withLive: false,
                    },
                })
            } catch (e) {
                console.error('Failed to parse email content', e)
            }
        }
    }, [emailId, emailDetails, dispatch])

    const handleClick = () => {
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: {
                    id: '',
                    content: [],
                    name: '',
                    styles: {},
                    type: null,
                }
            },
        })
    }

    const handleUnpreview = () => {
        dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    }

    return (
        <div
            id="email-editor-workspace"
            className={clsx(
                'use-automation-zoom-in h-full overflow-scroll bg-background rounded-md relative transition-all duration-300 flex-1',
                {
                    '!p-0 !mr-0': state.editor.previewMode,
                    '!w-[850px]': state.editor.device === 'Tablet',
                    '!w-[420px]': state.editor.device === 'Mobile',
                    'w-full': state.editor.device === 'Desktop',
                }
            )}
            onClick={handleClick}
        >
            {state.editor.previewMode && (
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className="w-10 h-10 bg-slate-800 text-white p-[2px] fixed top-4 left-4 z-[100] hover:bg-slate-700"
                    onClick={handleUnpreview}
                >
                    <EyeOff />
                </Button>
            )}

            <div className="min-h-full w-full bg-white flex flex-col items-center py-10">
                {Array.isArray(state.editor.elements) &&
                    state.editor.elements.map((childElement) => (
                        <Recursive
                            key={childElement.id}
                            element={childElement}
                        />
                    ))}
            </div>
        </div>
    )
}

export default EmailEditorWorkspace
