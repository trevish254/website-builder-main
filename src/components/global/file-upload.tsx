import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadDropzone } from '@/lib/uploadthing'

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo'
  onChange: (url?: string) => void
  value?: string
}

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split('.').pop()

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== 'pdf' ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button
          onClick={() => onChange('')}
          variant="ghost"
          type="button"
        >
          <X className="h-4 w-4" />
          Remove Logo
        </Button>
      </div>
    )
  }
  return (
    <div className="w-full bg-muted/30 p-4">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          console.log('✅ Upload complete:', res)
          if (res && res[0]?.url) {
            console.log('✅ Image URL:', res[0].url)
            onChange(res[0].url)
          }
        }}
        onUploadError={(error: Error) => {
          console.error('❌ Upload error:', error)
          alert('Failed to upload image. Please try again or skip the logo.')
        }}
        onUploadBegin={(name) => {
          console.log('📤 Upload began:', name)
        }}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Logo is optional. You can skip this step and add a logo later.
      </p>
    </div>
  )
}

export default FileUpload
