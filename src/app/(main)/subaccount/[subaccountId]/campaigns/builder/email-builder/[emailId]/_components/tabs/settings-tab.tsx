'use client'
import React from 'react'
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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useEmailEditor } from '@/providers/editor/email-editor-provider'
import CustomColorPicker from '@/components/global/custom-color-picker'

type Props = {
    subaccountId: string
}

const EmailSettingsTab = (props: Props) => {
    const { state, dispatch } = useEmailEditor()

    const handleOnChanges = (e: any) => {
        const styleSettings = e.target.id
        let value = e.target.value
        const styleObject = {
            [styleSettings]: value,
        }

        if (
            [
                'height',
                'width',
                'marginTop',
                'marginBottom',
                'marginLeft',
                'marginRight',
                'paddingTop',
                'paddingBottom',
                'paddingLeft',
                'paddingRight',
                'fontSize',
                'borderRadius',
            ].includes(styleSettings)
        ) {
            if (!isNaN(Number(value)) && value !== '') {
                styleObject[styleSettings] = value + 'px'
            }
        }

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                        ...state.editor.selectedElement.styles,
                        ...styleObject,
                    },
                },
            },
        })
    }

    const handleChangeCustomValues = (e: any) => {
        const settingProperty = e.target.id
        let value = e.target.value
        const styleObject = {
            [settingProperty]: value,
        }

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        ...styleObject,
                    },
                },
            },
        })
    }

    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['Typography', 'Dimensions', 'Decorations']}
        >
            <AccordionItem value="Custom" className="px-6 py-0 border-y">
                <AccordionTrigger className="!no-underline uppercase text-xs font-bold tracking-widest text-muted-foreground">Properties</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    {state.editor.selectedElement.type === 'link' &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-2">
                                <Label className="text-muted-foreground">URL</Label>
                                <Input
                                    id="href"
                                    placeholder="https://example.com"
                                    onChange={handleChangeCustomValues}
                                    value={state.editor.selectedElement.content.href}
                                />
                            </div>
                        )}
                    {state.editor.selectedElement.type === 'image' &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-2">
                                <Label className="text-muted-foreground">Image Source</Label>
                                <Input
                                    id="src"
                                    placeholder="https://example.com/image.png"
                                    onChange={handleChangeCustomValues}
                                    value={state.editor.selectedElement.content.src}
                                />
                            </div>
                        )}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Typography" className="px-6 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-xs font-bold tracking-widest text-muted-foreground">Typography</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Alignment</Label>
                        <Tabs
                            onValueChange={(e) =>
                                handleOnChanges({ target: { id: 'textAlign', value: e } })
                            }
                            value={state.editor.selectedElement.styles.textAlign}
                        >
                            <TabsList className="grid grid-cols-4 bg-transparent border h-fit p-1">
                                <TabsTrigger value="left" className="h-8 p-0"><AlignLeft size={16} /></TabsTrigger>
                                <TabsTrigger value="center" className="h-8 p-0"><AlignCenter size={16} /></TabsTrigger>
                                <TabsTrigger value="right" className="h-8 p-0"><AlignRight size={16} /></TabsTrigger>
                                <TabsTrigger value="justify" className="h-8 p-0"><AlignJustify size={16} /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Color</Label>
                        <CustomColorPicker
                            color={state.editor.selectedElement.styles.color}
                            onChange={(e) => handleOnChanges({ target: { id: 'color', value: e } })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-muted-foreground">Size</Label>
                            <Input
                                id="fontSize"
                                placeholder="16px"
                                onChange={handleOnChanges}
                                value={state.editor.selectedElement.styles.fontSize}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-muted-foreground">Weight</Label>
                            <Select
                                onValueChange={(e) => handleOnChanges({ target: { id: 'fontWeight', value: e } })}
                                value={state.editor.selectedElement.styles.fontWeight}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Weight" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Regular</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="lighter">Light</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Dimensions" className="px-6 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-xs font-bold tracking-widest text-muted-foreground">Dimensions</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-muted-foreground">Width</Label>
                            <Input id="width" placeholder="100%" onChange={handleOnChanges} value={state.editor.selectedElement.styles.width} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-muted-foreground">Height</Label>
                            <Input id="height" placeholder="auto" onChange={handleOnChanges} value={state.editor.selectedElement.styles.height} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Padding</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input id="paddingTop" placeholder="Top" onChange={handleOnChanges} value={state.editor.selectedElement.styles.paddingTop} />
                            <Input id="paddingBottom" placeholder="Bottom" onChange={handleOnChanges} value={state.editor.selectedElement.styles.paddingBottom} />
                            <Input id="paddingLeft" placeholder="Left" onChange={handleOnChanges} value={state.editor.selectedElement.styles.paddingLeft} />
                            <Input id="paddingRight" placeholder="Right" onChange={handleOnChanges} value={state.editor.selectedElement.styles.paddingRight} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Margin</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input id="marginTop" placeholder="Top" onChange={handleOnChanges} value={state.editor.selectedElement.styles.marginTop} />
                            <Input id="marginBottom" placeholder="Bottom" onChange={handleOnChanges} value={state.editor.selectedElement.styles.marginBottom} />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Decorations" className="px-6 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-xs font-bold tracking-widest text-muted-foreground">Decorations</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Background Color</Label>
                        <CustomColorPicker
                            color={state.editor.selectedElement.styles.backgroundColor}
                            onChange={(e) => handleOnChanges({ target: { id: 'backgroundColor', value: e } })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Border Radius</Label>
                        <Input id="borderRadius" placeholder="0px" onChange={handleOnChanges} value={state.editor.selectedElement.styles.borderRadius} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default EmailSettingsTab
