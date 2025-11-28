'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'
import React from 'react'
import { HexColorPicker } from 'react-colorful'

type Props = {
    color: string
    onChange: (color: string) => void
    children?: React.ReactNode
}

const CustomColorPicker = ({ color, onChange, children }: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children || (
                    <div className="w-full flex items-center gap-2 cursor-pointer border rounded-md p-1">
                        <div
                            className="h-8 w-8 rounded-md border"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-muted-foreground flex-1">
                            {color || 'Pick a color'}
                        </span>
                        <Paintbrush className="h-4 w-4 text-muted-foreground mr-2" />
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3">
                <div className="flex flex-col gap-4">
                    <HexColorPicker
                        color={color}
                        onChange={onChange}
                    />
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground">Hex Code</span>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">#</span>
                            <Input
                                value={color?.replace('#', '') || ''}
                                onChange={(e) => onChange(`#${e.target.value}`)}
                                className="h-8"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground">Presets</span>
                        <div className="flex flex-wrap gap-2 max-w-[200px]">
                            {[
                                '#000000',
                                '#ffffff',
                                '#ef4444',
                                '#f97316',
                                '#f59e0b',
                                '#84cc16',
                                '#22c55e',
                                '#10b981',
                                '#06b6d4',
                                '#0ea5e9',
                                '#3b82f6',
                                '#6366f1',
                                '#8b5cf6',
                                '#d946ef',
                                '#f43f5e',
                            ].map((presetColor) => (
                                <div
                                    key={presetColor}
                                    className={cn(
                                        'h-6 w-6 rounded-md border cursor-pointer transition-all hover:scale-110',
                                        color === presetColor && 'ring-2 ring-offset-2 ring-primary'
                                    )}
                                    style={{ backgroundColor: presetColor }}
                                    onClick={() => onChange(presetColor)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default CustomColorPicker
