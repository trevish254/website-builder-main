'use client'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Highlighter,
    Link as LinkIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Image,
    Table,
    Minus,
    FileCode,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { EditorHandle } from './editor-wrapper'
import ImagePickerDialog from './image-picker-dialog'
import { useState } from 'react'

type Props = {
    editorRef: React.RefObject<EditorHandle>
    subaccountId?: string
}

export default function EditorToolbar({ editorRef, subaccountId }: Props) {
    const [showImagePicker, setShowImagePicker] = useState(false)
    const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72']
    const fonts = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Comic Sans MS',
        'Trebuchet MS',
        'Arial Black',
        'Impact',
        'Lucida Console',
    ]

    const insertBlock = async (type: string, data?: any) => {
        await editorRef.current?.insertBlock(type, data)
    }

    const handleHeading = async (level: number) => {
        await insertBlock('header', { text: '', level })
    }

    const handleList = async (style: 'ordered' | 'unordered') => {
        await insertBlock('list', { style, items: [''] })
    }

    const applyFormat = (command: string, value?: string) => {
        // Ensure browser commands work even if focus was lost (though ShadCN buttons usually steal focus)
        // We might need to restore focus or just hope the selection is preserved
        document.execCommand(command, false, value)
    }

    const handleFontFamily = (font: string) => {
        document.execCommand('fontName', false, font)
    }

    const handleFontSize = (size: string) => {
        // Use insertHTML to wrap in span with explicit font size since execCommand fontSize is limited to 1-7
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const span = document.createElement('span')
            span.style.fontSize = `${size}px`
            span.textContent = selection.toString()

            range.deleteContents()
            range.insertNode(span)

            // cleanup empty spans? default browser behavior handling
        }
    }

    const handleLink = () => {
        const url = prompt('Enter URL:')
        if (url) {
            document.execCommand('createLink', false, url)
        }
    }

    return (
        <div className="sticky top-0 z-20 bg-background border-b shadow-sm">
            <div className="flex items-center gap-1 p-2 overflow-x-auto">
                {/* Font Family */}
                <Select defaultValue="Arial" onValueChange={handleFontFamily}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                        {fonts.map((font) => (
                            <SelectItem key={font} value={font} className="text-xs">
                                <span style={{ fontFamily: font }}>{font}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Font Size */}
                <Select defaultValue="16" onValueChange={handleFontSize}>
                    <SelectTrigger className="w-[70px] h-8 text-xs">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        {fontSizes.map((size) => (
                            <SelectItem key={size} value={size} className="text-xs">
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text Formatting - These use Editor.js inline toolbar */}
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Bold (Ctrl+B)"
                        onClick={() => applyFormat('bold')}
                        onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Italic (Ctrl+I)"
                        onClick={() => applyFormat('italic')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Underline (Ctrl+U)"
                        onClick={() => applyFormat('underline')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Strikethrough"
                        onClick={() => applyFormat('strikeThrough')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Inline Code"
                        onClick={() => {
                            const selection = window.getSelection()
                            if (selection && selection.toString()) {
                                document.execCommand('insertHTML', false, `<code>${selection.toString()}</code>`)
                            }
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Code className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Highlight"
                        onClick={() => applyFormat('hiliteColor', 'yellow')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Highlighter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Link"
                        onClick={handleLink}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Heading 1"
                        onClick={() => handleHeading(1)}
                    >
                        <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Heading 2"
                        onClick={() => handleHeading(2)}
                    >
                        <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Heading 3"
                        onClick={() => handleHeading(3)}
                    >
                        <Heading3 className="h-4 w-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Alignment */}
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Align Left"
                        onClick={() => applyFormat('justifyLeft')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Align Center"
                        onClick={() => applyFormat('justifyCenter')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Align Right"
                        onClick={() => applyFormat('justifyRight')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Justify"
                        onClick={() => applyFormat('justifyFull')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <AlignJustify className="h-4 w-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Bullet List"
                        onClick={() => handleList('unordered')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Numbered List"
                        onClick={() => handleList('ordered')}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Insert Elements */}
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Quote"
                        onClick={() => insertBlock('quote', { text: '', caption: '' })}
                    >
                        <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Code Block"
                        onClick={() => insertBlock('code', { code: '' })}
                    >
                        <FileCode className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Table"
                        onClick={() => insertBlock('table', {
                            withHeadings: false,
                            content: [
                                ['', '', ''],
                                ['', '', '']
                            ]
                        })}
                    >
                        <Table className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Insert Image"
                        onClick={() => setShowImagePicker(true)}
                    >
                        <Image className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Divider"
                        onClick={() => insertBlock('delimiter', {})}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ImagePickerDialog
                open={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onSelect={(url) => insertBlock('image', { url, caption: '' })}
                subaccountId={subaccountId}
            />
        </div>
    )
}
