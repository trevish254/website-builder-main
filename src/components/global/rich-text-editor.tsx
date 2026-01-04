'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder,
    className
}) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value
        }
    }, [value])

    const execCommand = (command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus()
            document.execCommand(command, false, value)
            onChange(editorRef.current.innerHTML)
        }
    }

    const handleToolbarAction = (e: React.MouseEvent, command: string, value?: string) => {
        e.preventDefault() // Crucial: prevents focus from leaving the contentEditable
        execCommand(command, value)
    }

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    if (!isMounted) return null

    return (
        <div className={cn("flex flex-col rounded-md border border-input bg-background overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
                <div className="flex items-center gap-0.5 border-r pr-2 mr-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'bold')}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'italic')}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                </div>

                <Select onValueChange={(val) => execCommand('fontSize', val)}>
                    <SelectTrigger className="h-8 w-24 text-[10px] font-bold uppercase tracking-wider">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">Small</SelectItem>
                        <SelectItem value="3">Regular</SelectItem>
                        <SelectItem value="5">Large</SelectItem>
                        <SelectItem value="7">Extra Large</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-0.5 border-r border-l px-2 mx-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'justifyLeft')}
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'justifyCenter')}
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'justifyRight')}
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'insertUnorderedList')}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onMouseDown={(e) => handleToolbarAction(e, 'insertOrderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[300px] p-4 focus:outline-none max-w-full overflow-y-auto rich-text-content"
                placeholder={placeholder}
            />
        </div>
    )
}

export default RichTextEditor
