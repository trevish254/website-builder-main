'use client'

import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Paintbrush, Check } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

type Props = {
    color: string
    onChange: (color: string) => void
    children?: React.ReactNode
}

const CustomColorPicker = ({ color: initialColor, onChange, children }: Props) => {
    const [localColor, setLocalColor] = useState(initialColor)
    const [isOpen, setIsOpen] = useState(false)

    // Sync local color with initial color when details open or props change
    useEffect(() => {
        if (isOpen) {
            setLocalColor(initialColor)
        }
    }, [initialColor, isOpen])

    const handleSelect = () => {
        onChange(localColor)
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {children || (
                    <div className="w-full flex items-center gap-2 cursor-pointer border rounded-md p-1">
                        <div
                            className="h-8 w-8 rounded-md border"
                            style={{ backgroundColor: initialColor }}
                        />
                        <span className="text-sm text-muted-foreground flex-1">
                            {initialColor || 'Pick a color'}
                        </span>
                        <Paintbrush className="h-4 w-4 text-muted-foreground mr-2" />
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 shadow-xl border-border/50 bg-background/95 backdrop-blur-sm">
                <div className="flex flex-col gap-4">
                    <HexColorPicker
                        className="!w-full min-w-[200px]"
                        color={localColor}
                        onChange={setLocalColor}
                    />

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-left">Hex Code</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/30 rounded-lg border border-border/40">
                                    <span className="text-muted-foreground font-mono text-xs">#</span>
                                    <input
                                        value={localColor?.replace('#', '') || ''}
                                        onChange={(e) => setLocalColor(`#${e.target.value}`)}
                                        className="bg-transparent border-none outline-none font-mono text-xs w-full uppercase"
                                    />
                                </div>
                            </div>
                            <div
                                className="h-10 w-10 rounded-xl border-2 border-white/10 shadow-inner shrink-0"
                                style={{ backgroundColor: localColor }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-left">Presets</span>
                            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                {[
                                    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
                                    '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#0ea5e9',
                                    '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e',
                                ].map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        type="button"
                                        className={cn(
                                            'h-5 w-5 rounded-md border-0 cursor-pointer transition-all hover:scale-125 hover:rotate-12',
                                            localColor === presetColor && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                        )}
                                        style={{ backgroundColor: presetColor }}
                                        onClick={() => setLocalColor(presetColor)}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSelect}
                            className="w-full h-9 gap-2 mt-2 font-black uppercase text-[10px] tracking-widest"
                        >
                            <Check className="h-3 w-3" /> Select Color
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default CustomColorPicker
