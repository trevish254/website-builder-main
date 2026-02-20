'use client'
import React from 'react'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { createMedia, saveActivityLogsNotification } from '@/lib/queries'
import { Input } from '../ui/input'
import FileUpload from '../global/file-upload'
import { Button } from '../ui/button'
import { useModal } from '@/providers/modal-provider'

type Props = {
  subaccountId: string
  onSuccess?: () => void
}

const formSchema = z.object({
  files: z.array(z.object({
    link: z.string(),
    name: z.string()
  })).min(1, { message: 'At least one file is required' }),
})

const UploadMediaForm = ({ subaccountId, onSuccess }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const { setClose } = useModal()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      files: [],
    },
  })

  const [isUploading, setIsUploading] = React.useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true)
    try {
      console.log('📤 Bulk uploading media files:', values.files.length)

      const uploadPromises = values.files.map(async (file) => {
        const response = await createMedia(subaccountId, {
          name: file.name,
          link: file.link,
        })

        if (response) {
          await saveActivityLogsNotification({
            agencyId: undefined,
            description: `Uploaded a media file | ${response.name}`,
            subaccountId,
          })
          return response
        }
        return null
      })

      const results = await Promise.all(uploadPromises)
      const successCount = results.filter(Boolean).length

      if (successCount === 0) {
        throw new Error('Failed to upload any media files')
      }

      console.log(`✅ ${successCount} media files uploaded successfully`)

      toast({
        title: 'Success',
        description: `${successCount} media file(s) uploaded successfully!`
      })

      // Reset form
      form.reset({
        files: [],
      })

      // Close modal immediately
      setClose()

      // Trigger refresh callback if provided
      if (onSuccess) {
        console.log('🔄 Calling onSuccess callback')
        await onSuccess()
      }

      // Refresh page
      router.refresh()
    } catch (error) {
      console.error('❌ Error bulk uploading media:', error)
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not upload media files. Please try again.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Upload Media</CardTitle>
        <CardDescription>
          Select multiple files to upload at once. File names will be preserved from your device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Files</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="media"
                      multiple={true}
                      value={field.value.map(f => f.link)}
                      onChange={(urls) => {
                        // This onChange is called when files are REMOVED from the preview
                        if (Array.isArray(urls)) {
                          field.onChange(field.value.filter(f => urls.includes(f.link)))
                        } else if (!urls) {
                          field.onChange([])
                        }
                      }}
                      onUploadComplete={(files) => {
                        // This is called when new files are UPLOADED
                        const currentFiles = field.value
                        const newFiles = files.filter(f => !currentFiles.some(cf => cf.link === f.url))
                        field.onChange([...currentFiles, ...newFiles.map(f => ({ link: f.url, name: f.name }))])
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 w-full h-11 shadow-lg shadow-primary/20"
              disabled={isUploading || form.getValues('files').length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading {form.getValues('files').length} files...
                </>
              ) : (
                `Upload ${form.getValues('files').length} Media File(s)`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UploadMediaForm
