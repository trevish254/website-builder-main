import { EditorElement } from '@/providers/editor/editor-provider'
import React from 'react'
import TextComponent from './text'
import Container from './container'
import VideoComponent from './video'
import LinkComponent from './link-component'
import ContactFormComponent from './contact-form-component'
import Checkout from './checkout'
import ResizableWrapper from './resizable-wrapper'

type Props = {
  element: EditorElement
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return (
        <ResizableWrapper element={element}>
          <TextComponent element={element} />
        </ResizableWrapper>
      )
    case 'container':
      return (
        <ResizableWrapper element={element}>
          <Container element={element} />
        </ResizableWrapper>
      )
    case 'video':
      return (
        <ResizableWrapper element={element}>
          <VideoComponent element={element} />
        </ResizableWrapper>
      )
    case 'contactForm':
      return (
        <ResizableWrapper element={element}>
          <ContactFormComponent element={element} />
        </ResizableWrapper>
      )
    case 'paymentForm':
      return (
        <ResizableWrapper element={element}>
          <Checkout element={element} />
        </ResizableWrapper>
      )
    case '2Col':
      return (
        <ResizableWrapper element={element}>
          <Container element={element} />
        </ResizableWrapper>
      )
    case '__body':
      return <Container element={element} />

    case 'link':
      return (
        <ResizableWrapper element={element}>
          <LinkComponent element={element} />
        </ResizableWrapper>
      )
    default:
      return null
  }
}

export default Recursive
