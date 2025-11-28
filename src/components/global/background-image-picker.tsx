'use client'

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Image as ImageIcon } from 'lucide-react'
import MediaPicker from '@/components/media/media-picker'
import { Input } from '@/components/ui/input'

type Props = {
    background: string
    subaccountId: string
    onChange: (value: string) => void
}

const BackgroundImagePicker = ({ background, subaccountId, onChange }: Props) => {
    // Extract the raw URL from url('...') if present
    const rawUrl = background?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') || ''

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="w-12 h-12 relative border rounded-md cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-900 hover:opacity-80 transition-opacity">
                            {rawUrl ? (
                                <img
                                    src={rawUrl}
                                    alt="Background"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="text-muted-foreground w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                        <div className="p-4">
                            <MediaPicker
                                subaccountId={subaccountId}
                                onSelect={(media) => {
                                    onChange(`url(${media.link})`)
                                }}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="flex-1">
                    <Input
                        placeholder="https://image.com"
                        value={rawUrl}
                        onChange={(e) => {
                            const val = e.target.value
                            onChange(val ? `url(${val})` : '')
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default BackgroundImagePicker
