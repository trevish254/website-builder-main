import { EditorElement } from '@/providers/editor/editor-provider'
import React, { memo } from 'react'
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

/**
 * Custom comparison function for React.memo
 * Only re-render if the element's critical properties have changed
 */
const arePropsEqual = (prevProps: Props, nextProps: Props): boolean => {
  const prev = prevProps.element
  const next = nextProps.element

  // Quick reference check - if same object, no re-render needed
  if (prev === next) return true

  // Check critical properties that would require re-render
  if (
    prev.id !== next.id ||
    prev.type !== next.type ||
    prev.name !== next.name ||
    JSON.stringify(prev.styles) !== JSON.stringify(next.styles) ||
    prev.innerText !== next.innerText ||
    prev.src !== next.src ||
    prev.href !== next.href
  ) {
    return false
  }

  // Check if content array length changed
  if (Array.isArray(prev.content) && Array.isArray(next.content)) {
    if (prev.content.length !== next.content.length) {
      return false
    }
    // Deep check of content IDs (shallow check for performance)
    for (let i = 0; i < prev.content.length; i++) {
      if (prev.content[i].id !== next.content[i].id) {
        return false
      }
    }
  } else if (prev.content !== next.content) {
    return false
  }

  // Props are equal, skip re-render
  return true
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

// Export memoized version with custom comparison
export default memo(Recursive, arePropsEqual)
