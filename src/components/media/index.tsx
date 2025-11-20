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
import MediaCard from './media-card'
import { FolderSearch } from 'lucide-react'
import { getMedia } from '@/lib/queries'

type Props = {
  data: GetMediaFiles
  subaccountId: string
}

const MediaComponent = ({ data, subaccountId }: Props) => {
  const [mediaFiles, setMediaFiles] = useState(data?.Media || [])
  const [isLoading, setIsLoading] = useState(false)
  
  // Fetch media files when component mounts or subaccountId changes
  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true)
      console.log('📤 Fetching media for:', subaccountId)
      const mediaData = await getMedia(subaccountId)
      console.log('✅ Media data received:', mediaData?.Media?.length || 0, 'files')
      console.log('📦 Media files:', mediaData?.Media)
      
      if (mediaData?.Media) {
        setMediaFiles(mediaData.Media)
      }
      setIsLoading(false)
    }
    
    fetchMedia()
  }, [subaccountId])
  
  console.log('📦 MediaComponent - Files count:', mediaFiles.length)
  console.log('📦 MediaComponent - Files:', mediaFiles)
  
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton 
          subaccountId={subaccountId} 
          onUploadComplete={async () => {
            // Refresh media list after upload
            console.log('🔄 Refreshing media list after upload')
            const mediaData = await getMedia(subaccountId)
            if (mediaData?.Media) {
              setMediaFiles(mediaData.Media)
            }
          }}
        />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="flex flex-wrap gap-4 pt-4">
              {mediaFiles.length > 0 ? (
                mediaFiles.map((file) => (
                  <CommandItem
                    key={file.id}
                    className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                  >
                    <MediaCard file={file} />
                  </CommandItem>
                ))
              ) : (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
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

export default MediaComponent
