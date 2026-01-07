'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { SubAccountFile } from '@/lib/database.types'
import { Upload, FileText, Image, Video, Music, FileSpreadsheet, Presentation, File, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  const [uploadError, setUploadError] = useState<string | null>(null)
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

  const detectFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (!ext) return 'OTHER'

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'IMAGE'
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'VIDEO'
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'AUDIO'
    if (['pdf'].includes(ext)) return 'PDF'
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'SPREADSHEET'
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'DOCUMENT'
    if (['ppt', 'pptx'].includes(ext)) return 'PRESENTATION'

    return 'OTHER'
  }

  const handleUploadComplete = async (res: any) => {
    if (res && res[0]) {
      const fileData = res[0]
      setUploadedFile({
        name: fileData.name,
        size: fileData.size,
        url: fileData.url
      })
      // Auto-set file type
      setFileType(detectFileType(fileData.name))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError(null)

    if (!uploadedFile || !fileType) {
      setUploadError('Please select a file and classification.')
      return
    }

    if (!userId) {
      setUploadError('Session error: User ID not found. Please refresh.')
      return
    }

    try {
      setLoading(true)
      console.log('🚀 UPLOAD LOG: Finalizing file record for user:', userId)

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

      if (error) {
        console.error('❌ UPLOAD LOG: Supabase Insert Error:', error)
        throw error
      }

      console.log('✅ UPLOAD LOG: File record saved successfully')
      onFileAdded(data)
      onClose()
    } catch (error: any) {
      console.error('❌ UPLOAD LOG: Finalizing Failed:', error)
      setUploadError(error.message || 'Failed to save file record.')
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
    <Card className="bg-gray-950/80 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden p-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Upload className="h-5 w-5 text-emerald-400" />
          </div>
          Upload Asset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Select File
            </label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-emerald-500/30">
                <UploadDropzone
                  endpoint="subaccountFile"
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={(error: Error) => {
                    console.error('Upload error:', error)
                    setUploadError(`Upload failed: ${error.message}`)
                  }}
                  appearance={{
                    container: "w-full border-none bg-transparent",
                    uploadIcon: "text-emerald-500/50",
                    label: "text-gray-400 font-medium",
                    button: "bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-widest px-6 h-10 rounded-xl ut-uploading:bg-emerald-500/50",
                  }}
                />
              </div>
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <FileText className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-200 truncate leading-tight">{uploadedFile.name}</p>
                  <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-wider mt-1">{formatFileSize(uploadedFile.size)} • READY</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="fileType" className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Classification
              </label>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter bg-blue-400/10 px-2 py-0.5 rounded-full">
                Auto-Detected
              </span>
            </div>
            <Select value={fileType} onValueChange={setFileType} required>
              <SelectTrigger className="bg-white/[0.03] border-white/10 h-12 rounded-xl text-gray-200 focus:ring-emerald-500/20">
                <SelectValue placeholder="Categorize this file..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {fileTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value} className="focus:bg-white/10">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-tight animate-in fade-in zoom-in-95">
              ⚠️ {uploadError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || !uploadedFile}
              className="flex-1 h-12 rounded-xl bg-white text-black font-bold hover:bg-white/90 disabled:opacity-30 transition-all border-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  Finalizing Asset...
                </div>
              ) : 'Securely Save Asset'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-gray-400"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default UploadFileForm
