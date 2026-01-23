import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadButton, UploadDropzone } from '@/lib/uploadthing'

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo' | 'productImage' | 'media' | 'subaccountFile'
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
          <UploadButton
            endpoint={apiEndpoint}
            onClientUploadComplete={(res) => {
              if (res) {
                const newUrls = res.map(file => file.url)
                onChange([...(Array.isArray(value) ? value : [value]), ...newUrls])
              }
            }}
            appearance={{
              button: "ut-ready:bg-blue-600 ut-uploading:cursor-not-allowed bg-blue-600 bg-none after:bg-blue-700",
              container: "w-full focus-within:ring-blue-600",
              allowedContent: "text-neutral-400 text-[10px]"
            }}
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
    <div className="w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 hover:border-blue-500/50 transition-all duration-300">
      <UploadButton
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          if (res) {
            const urls = res.map(file => file.url)
            onChange(multiple ? urls : urls[0])
          }
        }}
        onUploadError={(error: Error) => {
          console.error('❌ Upload error:', error)
        }}
        onUploadBegin={(name) => {
          console.log('📤 Upload began:', name)
        }}
        appearance={{
          button: "ut-ready:bg-blue-600 ut-uploading:cursor-not-allowed bg-blue-600 bg-none after:bg-blue-700 h-10 px-6 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]",
          container: "w-fit",
          allowedContent: "text-neutral-400 text-[10px] mt-2 font-medium"
        }}
      />
      {!value && (
        <p className="text-[10px] text-neutral-400 mt-4 uppercase tracking-widest font-bold">
          Click above to auto-upload
        </p>
      )}
    </div>
  )
}

export default FileUpload
