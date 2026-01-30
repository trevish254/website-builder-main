'use client'
import React, { useEffect, useState, useCallback } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
} from 'lucide-react'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type Props = {
    editor: any
}

const BasicSettings = ({ editor }: Props) => {
    const [selectedElement, setSelectedElement] = useState<any>(null)
    const [styles, setStyles] = useState<any>({})

    const updateState = useCallback(() => {
        const selected = editor.getSelected()
        if (selected) {
            setSelectedElement(selected)
            setStyles(selected.getStyle())
        } else {
            setSelectedElement(null)
            setStyles({})
        }
    }, [editor])

    useEffect(() => {
        if (!editor) return

        editor.on('component:selected component:styleUpdate', updateState)
        updateState()

        return () => {
            editor.off('component:selected component:styleUpdate', updateState)
        }
    }, [editor, updateState])

    const handleStyleChange = (property: string, value: string) => {
        if (!selectedElement) return

        selectedElement.addStyle({ [property]: value })
        setStyles(prev => ({ ...prev, [property]: value }))
    }

    const handleInputChange = (property: string, value: string) => {
        let finalValue = value
        // Add px if it's a number and needs units
        if (['fontSize', 'width', 'height', 'padding', 'margin', 'borderRadius'].some(p => property.toLowerCase().includes(p.toLowerCase()))) {
            if (!isNaN(Number(value)) && value !== '') {
                finalValue = value + 'px'
            }
        }
        handleStyleChange(property, finalValue)
    }

    if (!selectedElement) {
        return (
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <AlignLeft className="w-6 h-6 opacity-20" />
                </div>
                <p>Select an element to edit its properties</p>
            </div>
        )
    }

    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['Typography', 'Dimensions', 'Decorations']}
        >
            <AccordionItem value="Typography" className="px-4 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors">Typography</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-2">
                        <Label className="text-[11px] text-muted-foreground font-medium">Alignment</Label>
                        <Tabs
                            onValueChange={(v) => handleStyleChange('text-align', v)}
                            value={styles['text-align'] || 'left'}
                        >
                            <TabsList className="grid grid-cols-4 bg-muted/50 border-none h-9 p-1">
                                <TabsTrigger value="left" className="h-7"><AlignLeft size={14} /></TabsTrigger>
                                <TabsTrigger value="center" className="h-7"><AlignCenter size={14} /></TabsTrigger>
                                <TabsTrigger value="right" className="h-7"><AlignRight size={14} /></TabsTrigger>
                                <TabsTrigger value="justify" className="h-7"><AlignJustify size={14} /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] text-muted-foreground font-medium">Font Size</Label>
                            <Input
                                placeholder="16px"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['font-size'] || ''}
                                onChange={(e) => handleInputChange('font-size', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] text-muted-foreground font-medium">Weight</Label>
                            <Select
                                onValueChange={(v) => handleStyleChange('font-weight', v)}
                                value={styles['font-weight'] || '400'}
                            >
                                <SelectTrigger className="h-8 text-xs bg-muted/30 border-none">
                                    <SelectValue placeholder="Weight" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="400">Regular</SelectItem>
                                    <SelectItem value="700">Bold</SelectItem>
                                    <SelectItem value="300">Light</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-[11px] text-muted-foreground font-medium">Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                                value={styles['color'] || '#000000'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                            />
                            <Input
                                className="h-8 text-xs bg-muted/30 border-none flex-1 font-mono"
                                value={styles['color'] || '#000000'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Dimensions" className="px-4 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors">Dimensions</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] text-muted-foreground font-medium">Width</Label>
                            <Input
                                placeholder="100%"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['width'] || ''}
                                onChange={(e) => handleInputChange('width', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[11px] text-muted-foreground font-medium">Height</Label>
                            <Input
                                placeholder="auto"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['height'] || ''}
                                onChange={(e) => handleInputChange('height', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] text-muted-foreground font-medium">Padding</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Top"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['padding-top'] || ''}
                                onChange={(e) => handleInputChange('padding-top', e.target.value)}
                            />
                            <Input
                                placeholder="Bottom"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['padding-bottom'] || ''}
                                onChange={(e) => handleInputChange('padding-bottom', e.target.value)}
                            />
                            <Input
                                placeholder="Left"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['padding-left'] || ''}
                                onChange={(e) => handleInputChange('padding-left', e.target.value)}
                            />
                            <Input
                                placeholder="Right"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['padding-right'] || ''}
                                onChange={(e) => handleInputChange('padding-right', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] text-muted-foreground font-medium">Margin</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                placeholder="Top"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['margin-top'] || ''}
                                onChange={(e) => handleInputChange('margin-top', e.target.value)}
                            />
                            <Input
                                placeholder="Bottom"
                                className="h-8 text-xs bg-muted/30 border-none"
                                value={styles['margin-bottom'] || ''}
                                onChange={(e) => handleInputChange('margin-bottom', e.target.value)}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Decorations" className="px-4 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-[10px] font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors">Decorations</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-2">
                        <Label className="text-[11px] text-muted-foreground font-medium">Background Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
                                value={styles['background-color'] || '#ffffff'}
                                onChange={(e) => handleStyleChange('background-color', e.target.value)}
                            />
                            <Input
                                className="h-8 text-xs bg-muted/30 border-none flex-1 font-mono"
                                value={styles['background-color'] || '#ffffff'}
                                onChange={(e) => handleStyleChange('background-color', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-[11px] text-muted-foreground font-medium">Border Radius</Label>
                        <Input
                            placeholder="0px"
                            className="h-8 text-xs bg-muted/30 border-none"
                            value={styles['border-radius'] || ''}
                            onChange={(e) => handleInputChange('border-radius', e.target.value)}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default BasicSettings
