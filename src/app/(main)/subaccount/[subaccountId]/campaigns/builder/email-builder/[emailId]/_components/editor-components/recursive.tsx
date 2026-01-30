'use client'
import { EditorElement } from '@/providers/editor/email-editor-provider'
import React from 'react'
import EmailTextComponent from './text'
import EmailContainer from './container'
import EmailImageComponent from './image'
import EmailLinkComponent from './link-component'

type Props = {
    element: EditorElement
}

const Recursive = ({ element }: Props) => {
    switch (element.type) {
        case 'text':
            return <EmailTextComponent element={element} />
        case 'container':
            return <EmailContainer element={element} />
        case 'video':
            return null
        case '2Col':
            return <EmailContainer element={element} />
        case '__body':
            return <EmailContainer element={element} />
        case 'link':
            return <EmailLinkComponent element={element} />
        case 'image':
            return <EmailImageComponent element={element} />
        default:
            return null
    }
}

export default Recursive
