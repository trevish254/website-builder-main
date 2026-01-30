import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import React from 'react'
import { Type, Box, Columns, Image, Link, Layout, Square } from 'lucide-react'
import { EditorBtns } from '@/lib/constants'

const Placeholder = ({ id, label, icon: Icon }: { id: EditorBtns, label: string, icon: any }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('componentType', id || '')
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center flex-col gap-2 cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-all border border-transparent hover:border-primary"
        >
            <Icon size={24} className="text-muted-foreground" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">{label}</span>
        </div>
    )
}

const EmailComponentsTab = () => {
    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['Layout', 'Elements']}
        >
            <AccordionItem value="Layout" className="px-6 py-0 border-y">
                <AccordionTrigger className="!no-underline uppercase text-xs font-bold tracking-widest text-muted-foreground">Layout</AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-4 pt-2 pb-6">
                    <Placeholder id="container" label="Container" icon={Box} />
                    <Placeholder id="2Col" label="2 Columns" icon={Columns} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Elements" className="px-6 py-0 border-b">
                <AccordionTrigger className="!no-underline uppercase text-xs font-bold tracking-widest text-muted-foreground">Elements</AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-4 pt-2 pb-6">
                    <Placeholder id="text" label="Text" icon={Type} />
                    <Placeholder id="image" label="Image" icon={Image} />
                    <Placeholder id="link" label="Button" icon={Square} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default EmailComponentsTab
