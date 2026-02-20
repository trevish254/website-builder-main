import { FileIcon, X, Upload, ImageIcon as LucideImageIcon, FileText } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadButton, UploadDropzone } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo' | 'productImage' | 'media' | 'subaccountFile'
  onChange: (url?: string | string[]) => void
  onUploadComplete?: (files: { url: string; name: string }[]) => void
  value?: string | string[]
  multiple?: boolean
}

const FileUpload = ({ apiEndpoint, onChange, value, multiple, onUploadComplete }: Props) => {
  const isMultiple = multiple && Array.isArray(value)
  const firstValue = Array.isArray(value) ? value[0] : value

  // Use Dropzone for media or multiple files for better UX
  const useDropzone = apiEndpoint === 'media' || multiple

  if (value && (typeof value === 'string' || (Array.isArray(value) && value.length > 0))) {
    const images = Array.isArray(value) ? value : [value]
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-wrap gap-4">
          {images.map((url, idx) => (
            <div key={idx} className="relative w-full aspect-video md:aspect-square md:w-32 border rounded-xl overflow-hidden group border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm">
              <Image
                src={url}
                alt="uploaded image"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                fill
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
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
                  className="h-8 w-8 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="group relative">
          <UploadButton
            endpoint={apiEndpoint}
            onClientUploadComplete={(res) => {
              if (res) {
                const newUrls = res.map(file => file.url)
                if (multiple) {
                  onChange([...(Array.isArray(value) ? value : [value]), ...newUrls])
                } else {
                  onChange(newUrls[0])
                }
                if (onUploadComplete) {
                  onUploadComplete(res.map(f => ({ url: f.url, name: f.name })))
                }
              }
            }}
            appearance={{
              button: "ut-ready:bg-primary/10 ut-ready:text-primary ut-ready:border-primary/20 ut-ready:hover:bg-primary/20 ut-uploading:cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 h-10 px-4 rounded-xl font-medium transition-all duration-300 w-full text-xs after:hidden",
              container: "w-full",
              allowedContent: "hidden"
            }}
            content={{
              button({ ready }) {
                if (ready) return <div className="flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Replace File</div>
                return "Preparing..."
              }
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {useDropzone ? (
        <UploadDropzone
          endpoint={apiEndpoint}
          onClientUploadComplete={(res) => {
            if (res) {
              const urls = res.map(file => file.url)
              onChange(multiple ? urls : urls[0])
              if (onUploadComplete) {
                onUploadComplete(res.map(f => ({ url: f.url, name: f.name })))
              }
            }
          }}
          onUploadError={(error: Error) => {
            console.error('❌ Upload error:', error)
          }}
          appearance={{
            container: "w-full border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-primary/[0.02] hover:border-primary/50 transition-all duration-500 py-12 px-6 group cursor-pointer",
            label: "hidden",
            button: "ut-ready:bg-primary ut-uploading:bg-primary/50 bg-primary px-10 py-2.5 rounded-xl text-white font-semibold mt-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 duration-300",
            allowedContent: "text-neutral-400 dark:text-neutral-500 text-xs mt-3 font-medium"
          }}
          content={{
            uploadIcon() {
              return (
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-700 opacity-50" />
                  <div className="relative w-16 h-16 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl flex items-center justify-center border border-neutral-100 dark:border-neutral-700 group-hover:-translate-y-1 transition-transform duration-500">
                    <LucideImageIcon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              )
            },
            label() {
              return (
                <div className="mt-6 text-center">
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Drop files here</p>
                  <p className="text-xs text-neutral-500 mt-1">or click to browse your system</p>
                </div>
              )
            }
          }}
        />
      ) : (
        <div className="w-full group">
          <div className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-primary/[0.02] hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Upload className="w-20 h-20 text-primary rotate-12" />
            </div>

            <div className="relative w-12 h-12 bg-white dark:bg-neutral-800 rounded-xl shadow-lg flex items-center justify-center border border-neutral-100 dark:border-neutral-700 mb-4 group-hover:-translate-y-1 transition-transform duration-500">
              <Upload className="w-6 h-6 text-primary" />
            </div>

            <div className="text-center mb-6">
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Select Brand Asset</p>
              <p className="text-xs text-neutral-500 mt-1">Images up to 4MB</p>
            </div>

            <UploadButton
              endpoint={apiEndpoint}
              onClientUploadComplete={(res) => {
                if (res) {
                  const urls = res.map(file => file.url)
                  onChange(multiple ? urls : urls[0])
                  if (onUploadComplete) {
                    onUploadComplete(res.map(f => ({ url: f.url, name: f.name })))
                  }
                }
              }}
              appearance={{
                button: "ut-ready:bg-primary bg-primary h-10 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all active:scale-95 duration-300 text-white min-w-[140px] after:hidden",
                allowedContent: "hidden"
              }}
              content={{
                button({ ready }) {
                  if (ready) return "Choose File"
                  return "Loading..."
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
