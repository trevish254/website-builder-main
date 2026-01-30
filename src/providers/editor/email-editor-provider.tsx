'use client'
import { EditorBtns } from '@/lib/constants'
import { Dispatch, createContext, useContext, useReducer } from 'react'
import { EmailCampaign } from '@/lib/email-queries'

export type DeviceTypes = 'Desktop' | 'Mobile' | 'Tablet'

export type EditorElement = {
    id: string
    styles: React.CSSProperties
    name: string
    type: EditorBtns
    content: EditorElement[] | { href?: string; innerText?: string; src?: string }
}

export type Editor = {
    liveMode: boolean
    elements: EditorElement[]
    selectedElement: EditorElement
    device: DeviceTypes
    previewMode: boolean
    emailId: string
    sidebarWidth: number
}

export type HistoryState = {
    history: Editor[]
    currentIndex: number
}

export type EditorState = {
    editor: Editor
    history: HistoryState
}

export type EditorAction =
    | {
        type: 'ADD_ELEMENT'
        payload: {
            containerId: string
            elementDetails: EditorElement
        }
    }
    | {
        type: 'UPDATE_ELEMENT'
        payload: {
            elementDetails: EditorElement
        }
    }
    | {
        type: 'DELETE_ELEMENT'
        payload: {
            elementDetails: EditorElement
        }
    }
    | {
        type: 'CHANGE_CLICKED_ELEMENT'
        payload: {
            elementDetails?:
            | EditorElement
            | {
                id: ''
                content: []
                name: ''
                styles: {}
                type: null
            }
        }
    }
    | {
        type: 'CHANGE_DEVICE'
        payload: {
            device: DeviceTypes
        }
    }
    | {
        type: 'TOGGLE_PREVIEW_MODE'
    }
    | {
        type: 'TOGGLE_LIVE_MODE'
        payload?: {
            value: boolean
        }
    }
    | { type: 'REDO' }
    | { type: 'UNDO' }
    | {
        type: 'LOAD_DATA'
        payload: {
            elements: EditorElement[]
            withLive: boolean
        }
    }
    | {
        type: 'SET_SIDEBAR_WIDTH'
        payload: {
            width: number
        }
    }

const initialEditorState: EditorState['editor'] = {
    elements: [
        {
            content: [],
            id: '__body',
            name: 'Body',
            styles: {
                backgroundColor: 'white',
                width: '100%',
            },
            type: '__body',
        },
    ],
    selectedElement: {
        id: '',
        content: [],
        name: '',
        styles: {},
        type: null,
    },
    device: 'Desktop',
    liveMode: false,
    emailId: '',
    sidebarWidth: 320,
}

const initialHistoryState: HistoryState = {
    history: [initialEditorState],
    currentIndex: 0,
}

const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
}

const addAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'ADD_ELEMENT')
        throw Error(
            'You sent the wrong action type to the Add Element editor State'
        )
    return editorArray.map((item) => {
        if (item.id === action.payload.containerId && Array.isArray(item.content)) {
            return {
                ...item,
                content: [...item.content, action.payload.elementDetails],
            }
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: addAnElement(item.content, action),
            }
        }
        return item
    })
}

const updateAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'UPDATE_ELEMENT') {
        throw Error('You sent the wrong action type to the update Element State')
    }
    return editorArray.map((item) => {
        if (item.id === action.payload.elementDetails.id) {
            return { ...item, ...action.payload.elementDetails }
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: updateAnElement(item.content, action),
            }
        }
        return item
    })
}

const deleteAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'DELETE_ELEMENT')
        throw Error(
            'You sent the wrong action type to the Delete Element editor State'
        )
    return editorArray.filter((item) => {
        if (item.id === action.payload.elementDetails.id) {
            return false
        } else if (item.content && Array.isArray(item.content)) {
            item.content = deleteAnElement(item.content, action)
        }
        return true
    })
}

const editorReducer = (
    state: EditorState = initialState,
    action: EditorAction
): EditorState => {
    switch (action.type) {
        case 'ADD_ELEMENT':
            const updatedEditorState = {
                ...state.editor,
                elements: addAnElement(state.editor.elements, action),
            }
            const updatedHistory = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorState },
            ]

            return {
                ...state,
                editor: updatedEditorState,
                history: {
                    ...state.history,
                    history: updatedHistory,
                    currentIndex: updatedHistory.length - 1,
                },
            }

        case 'UPDATE_ELEMENT':
            const updatedElements = updateAnElement(state.editor.elements, action)

            const UpdatedElementIsSelected =
                state.editor.selectedElement.id === action.payload.elementDetails.id

            const updatedEditorStateWithUpdate = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: UpdatedElementIsSelected
                    ? action.payload.elementDetails
                    : state.editor.selectedElement,
            }

            const updatedHistoryWithUpdate = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateWithUpdate },
            ]
            return {
                ...state,
                editor: updatedEditorStateWithUpdate,
                history: {
                    ...state.history,
                    history: updatedHistoryWithUpdate,
                    currentIndex: updatedHistoryWithUpdate.length - 1,
                },
            }

        case 'DELETE_ELEMENT':
            const updatedElementsAfterDelete = deleteAnElement(
                state.editor.elements,
                action
            )
            const updatedEditorStateAfterDelete = {
                ...state.editor,
                elements: updatedElementsAfterDelete,
            }
            const updatedHistoryAfterDelete = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateAfterDelete },
            ]

            return {
                ...state,
                editor: updatedEditorStateAfterDelete,
                history: {
                    ...state.history,
                    history: updatedHistoryAfterDelete,
                    currentIndex: updatedHistoryAfterDelete.length - 1,
                },
            }

        case 'CHANGE_CLICKED_ELEMENT':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    selectedElement: action.payload.elementDetails || initialEditorState.selectedElement,
                },
            }
        case 'CHANGE_DEVICE':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    device: action.payload.device,
                },
            }

        case 'TOGGLE_PREVIEW_MODE':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    previewMode: !state.editor.previewMode,
                },
            }

        case 'TOGGLE_LIVE_MODE':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    liveMode: action.payload
                        ? action.payload.value
                        : !state.editor.liveMode,
                },
            }

        case 'REDO':
            if (state.history.currentIndex < state.history.history.length - 1) {
                const nextIndex = state.history.currentIndex + 1
                return {
                    ...state,
                    editor: state.history.history[nextIndex],
                    history: {
                        ...state.history,
                        currentIndex: nextIndex,
                    },
                }
            }
            return state

        case 'UNDO':
            if (state.history.currentIndex > 0) {
                const prevIndex = state.history.currentIndex - 1
                return {
                    ...state,
                    editor: state.history.history[prevIndex],
                    history: {
                        ...state.history,
                        currentIndex: prevIndex,
                    },
                }
            }
            return state

        case 'LOAD_DATA':
            return {
                ...initialState,
                editor: {
                    ...initialState.editor,
                    elements: action.payload.elements || initialEditorState.elements,
                    liveMode: !!action.payload.withLive,
                },
            }

        case 'SET_SIDEBAR_WIDTH':
            return {
                ...state,
                editor: {
                    ...state.editor,
                    sidebarWidth: action.payload.width,
                },
            }

        default:
            return state
    }
}

export const EmailEditorContext = createContext<{
    state: EditorState
    dispatch: Dispatch<EditorAction>
    subaccountId: string
    emailId: string
    emailDetails: EmailCampaign | null
}>({
    state: initialState,
    dispatch: () => undefined,
    subaccountId: '',
    emailId: '',
    emailDetails: null,
})

type EditorProps = {
    children: React.ReactNode
    subaccountId: string
    emailId: string
    emailDetails: EmailCampaign
}

const EmailEditorProvider = (props: EditorProps) => {
    const [state, dispatch] = useReducer(editorReducer, initialState)

    return (
        <EmailEditorContext.Provider
            value={{
                state,
                dispatch,
                subaccountId: props.subaccountId,
                emailId: props.emailId,
                emailDetails: props.emailDetails,
            }}
        >
            {props.children}
        </EmailEditorContext.Provider>
    )
}

export const useEmailEditor = () => {
    const context = useContext(EmailEditorContext)
    if (!context) {
        throw new Error('useEmailEditor Hook must be used within the editor Provider')
    }
    return context
}

export default EmailEditorProvider
