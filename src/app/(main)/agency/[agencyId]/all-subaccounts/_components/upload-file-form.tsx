'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { SubAccountFile } from '@/lib/database.types'
import { Upload, FileText, Image, Video, Music, FileSpreadsheet, Presentation, File } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing'

type Props = {
  subaccountId: string
  userId: string
  onFileAdded: (file: SubAccountFile) => void
  onClose: () => void
}

const UploadFileForm = ({ subaccountId, userId, onFileAdded, onClose }: Props) => {
  const [fileType, setFileType] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    size: number
    url: string
  } | null>(null)

  const fileTypes = [
    { value: 'DOCUMENT', label: 'Document', icon: FileText },
    { value: 'IMAGE', label: 'Image', icon: Image },
    { value: 'VIDEO', label: 'Video', icon: Video },
    { value: 'AUDIO', label: 'Audio', icon: Music },
    { value: 'SPREADSHEET', label: 'Spreadsheet', icon: FileSpreadsheet },
    { value: 'PRESENTATION', label: 'Presentation', icon: Presentation },
    { value: 'PDF', label: 'PDF', icon: File },
    { value: 'OTHER', label: 'Other', icon: FileText }
  ]

  const handleUploadComplete = async (res: any) => {
    if (res && res[0]) {
      const fileData = res[0]
      setUploadedFile({
        name: fileData.name,
        size: fileData.size,
        url: fileData.url
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedFile || !fileType) return

    try {
      setLoading(true)
      
      // Save file record to database
      const { data, error } = await supabase
        .from('SubAccountFile')
        .insert({
          id: crypto.randomUUID(),
          name: uploadedFile.name,
          originalName: uploadedFile.name,
          type: fileType as any,
          size: uploadedFile.size,
          url: uploadedFile.url,
          subAccountId: subaccountId,
          uploadedBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      onFileAdded(data)
      onClose()
    } catch (error) {
      console.error('Error saving file record:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload New File</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select File *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <UploadDropzone
                endpoint="subaccountFile"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={(error: Error) => {
                  console.error('Upload error:', error)
                }}
                appearance={{
                  container: "w-full",
                  uploadIcon: "text-gray-400",
                  label: "text-gray-600 dark:text-gray-400",
                  button: "bg-blue-600 hover:bg-blue-700 text-white"
                }}
              />
              {uploadedFile && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              File Type *
            </label>
            <Select value={fileType} onValueChange={setFileType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select file type..." />
              </SelectTrigger>
              <SelectContent>
                {fileTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !uploadedFile} className="flex-1">
              {loading ? 'Saving...' : 'Save File'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default UploadFileForm
