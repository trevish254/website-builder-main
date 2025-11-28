'use client'

import { GetMediaFiles } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import MediaUploadButton from './upload-buttons'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command'
import { FolderSearch } from 'lucide-react'
import { getMedia } from '@/lib/queries'
import Image from 'next/image'
import { Media } from '@prisma/client'

type Props = {
    subaccountId: string
    onSelect: (media: Media) => void
}

const MediaPicker = ({ subaccountId, onSelect }: Props) => {
    const [mediaFiles, setMediaFiles] = useState<Media[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchMedia = async () => {
            setIsLoading(true)
            const mediaData = await getMedia(subaccountId)
            if (mediaData?.Media) {
                setMediaFiles(mediaData.Media)
            }
            setIsLoading(false)
        }
        fetchMedia()
    }, [subaccountId])

    return (
        <div className="flex flex-col gap-4 h-full w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Media Bucket</h1>
                <MediaUploadButton
                    subaccountId={subaccountId}
                    onUploadComplete={async () => {
                        const mediaData = await getMedia(subaccountId)
                        if (mediaData?.Media) {
                            setMediaFiles(mediaData.Media)
                        }
                    }}
                />
            </div>
            <Command className="bg-transparent">
                <CommandInput placeholder="Search for file name..." />
                <CommandList className="pb-40 max-h-[400px] overflow-y-auto">
                    <CommandEmpty>No Media Files</CommandEmpty>
                    <CommandGroup heading="Media Files">
                        <div className="flex flex-wrap gap-4 pt-4">
                            {mediaFiles.length > 0 ? (
                                mediaFiles.map((file) => (
                                    <CommandItem
                                        key={file.id}
                                        className="p-0 max-w-[150px] w-full rounded-lg !bg-transparent !font-medium !text-white cursor-pointer hover:opacity-80 transition-opacity"
                                        onSelect={() => onSelect(file)}
                                    >
                                        <div className="relative w-full h-32 rounded-lg bg-slate-900 border overflow-hidden">
                                            <Image
                                                src={file.link}
                                                alt={file.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="truncate mt-2 text-xs text-muted-foreground">{file.name}</p>
                                    </CommandItem>
                                ))
                            ) : (
                                <div className="flex items-center justify-center w-full flex-col">
                                    <FolderSearch
                                        size={100}
                                        className="dark:text-muted text-slate-300"
                                    />
                                    <p className="text-muted-foreground">
                                        Empty! no files to show.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    )
}

export default MediaPicker
