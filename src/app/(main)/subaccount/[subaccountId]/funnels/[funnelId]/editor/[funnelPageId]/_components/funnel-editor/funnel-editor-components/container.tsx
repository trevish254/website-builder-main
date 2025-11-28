'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import { v4 } from 'uuid'
import Recursive from './recursive'
import { Trash } from 'lucide-react'

type Props = { element: EditorElement }

const Container = ({ element }: Props) => {
  const { id, content, name, styles, type } = element
  const { dispatch, state } = useEditor()

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
                color: 'black',
                ...defaultStyles,
              },
              type: 'link',
            },
          },
        })
        break
      case 'video':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: 'https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1',
              },
              id: v4(),
              name: 'Video',
              styles: {},
              type: 'video',
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
              styles: { ...defaultStyles },
              type: 'container',
            },
          },
        })
        break
      case 'contactForm':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: 'Contact Form',
              styles: {},
              type: 'contactForm',
            },
          },
        })
        break
      case 'paymentForm':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: 'Contact Form',
              styles: {},
              type: 'paymentForm',
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
                  styles: { ...defaultStyles, width: '100%' },
                  type: 'container',
                },
                {
                  content: [],
                  id: v4(),
                  name: 'Container',
                  styles: { ...defaultStyles, width: '100%' },
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
      case 'header':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: 'Brand Name' },
                  id: v4(),
                  name: 'Logo',
                  styles: {
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    ...defaultStyles,
                  },
                  type: 'text',
                },
                {
                  content: [
                    {
                      content: { innerText: 'Home', href: '#' },
                      id: v4(),
                      name: 'Link',
                      styles: { color: 'black', ...defaultStyles },
                      type: 'link',
                    },
                    {
                      content: { innerText: 'About', href: '#' },
                      id: v4(),
                      name: 'Link',
                      styles: { color: 'black', ...defaultStyles },
                      type: 'link',
                    },
                    {
                      content: { innerText: 'Contact', href: '#' },
                      id: v4(),
                      name: 'Link',
                      styles: { color: 'black', ...defaultStyles },
                      type: 'link',
                    },
                  ],
                  id: v4(),
                  name: 'Nav Links',
                  styles: {
                    display: 'flex',
                    gap: '20px',
                    ...defaultStyles,
                  },
                  type: 'container',
                },
              ],
              id: v4(),
              name: 'Header',
              styles: {
                ...defaultStyles,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#ffffff',
              },
              type: 'container',
            },
          },
        })
        break
      case 'hero':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: 'Catchy Headline Here' },
                  id: v4(),
                  name: 'Headline',
                  styles: {
                    color: 'black',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '20px',
                    ...defaultStyles,
                  },
                  type: 'text',
                },
                {
                  content: { innerText: 'Subheadline describing your value proposition.' },
                  id: v4(),
                  name: 'Subheadline',
                  styles: {
                    color: 'gray',
                    fontSize: '20px',
                    textAlign: 'center',
                    marginBottom: '40px',
                    ...defaultStyles,
                  },
                  type: 'text',
                },
                {
                  content: { innerText: 'Get Started', href: '#' },
                  id: v4(),
                  name: 'CTA Button',
                  styles: {
                    ...defaultStyles,
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    textAlign: 'center',
                  },
                  type: 'link',
                },
              ],
              id: v4(),
              name: 'Hero Section',
              styles: {
                ...defaultStyles,
                width: '100%',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                padding: '40px',
              },
              type: 'container',
            },
          },
        })
        break
      case 'footer':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: { innerText: '© 2024 Your Company. All rights reserved.' },
                  id: v4(),
                  name: 'Copyright',
                  styles: {
                    color: 'white',
                    fontSize: '14px',
                    textAlign: 'center',
                    ...defaultStyles,
                  },
                  type: 'text',
                },
              ],
              id: v4(),
              name: 'Footer',
              styles: {
                ...defaultStyles,
                width: '100%',
                padding: '40px',
                backgroundColor: '#1f2937',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              type: 'container',
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
      className={clsx('relative p-4 transition-all group', {
        'max-w-full w-full': type === 'container' || type === '2Col',
        'h-fit': type === 'container',
        'h-full': type === '__body',
        'overflow-scroll ': type === '__body',
        'flex flex-col md:!flex-row': type === '2Col',
        '!border-blue-500':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== '__body',
        '!border-yellow-400 !border-4':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === '__body',
        '!border-solid':
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== '__body'}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, 'container')}
    >
      <Badge
        className={clsx(
          'absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden',
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive
            key={childElement.id}
            element={childElement}
          />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== '__body' && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default Container
