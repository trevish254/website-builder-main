import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadDropzone } from '@/lib/uploadthing'

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo' | 'productImage'
  onChange: (url?: string | string[]) => void
  value?: string | string[]
  multiple?: boolean
}

const FileUpload = ({ apiEndpoint, onChange, value, multiple }: Props) => {
  const isMultiple = multiple && Array.isArray(value)
  const firstValue = Array.isArray(value) ? value[0] : value
  const type = firstValue?.split('.').pop()

  if (value && (typeof value === 'string' || (Array.isArray(value) && value.length > 0))) {
    const images = Array.isArray(value) ? value : [value]
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {images.map((url, idx) => (
            <div key={idx} className="relative w-40 h-40 border rounded-lg overflow-hidden group">
              <Image
                src={url}
                alt="uploaded image"
                className="object-contain"
                fill
              />
              <Button
                onClick={() => {
                  if (Array.isArray(value)) {
                    onChange(value.filter((_, i) => i !== idx))
                  } else {
                    onChange('')
                  }
                }}
                variant="destructive"
                size="icon"
                type="button"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {multiple && (
          <UploadDropzone
            endpoint={apiEndpoint}
            onClientUploadComplete={(res) => {
              if (res) {
                const newUrls = res.map(file => file.url)
                onChange([...(Array.isArray(value) ? value : [value]), ...newUrls])
              }
            }}
            className="ut-label:text-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
          />
        )}
        {!multiple && (
          <Button
            onClick={() => onChange('')}
            variant="ghost"
            type="button"
          >
            <X className="h-4 w-4" />
            Remove Logo
          </Button>
        )}
      </div>
    )
  }
  return (
    <div className="w-full bg-muted/30 p-4 border-2 border-dashed rounded-lg">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          if (res) {
            const urls = res.map(file => file.url)
            onChange(multiple ? urls : urls[0])
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
