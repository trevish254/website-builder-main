'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Share2, Globe, FileArchive, FileJson } from 'lucide-react'
import {
    createTemplateFromWebsite,
    publishWebsite,
    getWebsiteExportData,
    getProjectJsonExport,
} from '@/lib/export-actions'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface PublishDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editorInstance: any
    websiteId: string
    websiteName: string
    userId: string
    currentDomain?: string
}

const TEMPLATE_CATEGORIES = [
    'General',
    'Business',
    'Portfolio',
    'E-commerce',
    'Blog',
    'Landing Page',
    'Agency',
    'Restaurant',
    'Education',
    'Health',
    'Technology',
    'Creative',
]

export default function PublishDialog({
    open,
    onOpenChange,
    editorInstance,
    websiteId,
    websiteName,
    userId,
    currentDomain,
}: PublishDialogProps) {
    const [activeTab, setActiveTab] = useState('template')
    const [loading, setLoading] = useState(false)

    // Template form state
    const [templateName, setTemplateName] = useState(websiteName)
    const [templateDescription, setTemplateDescription] = useState('')
    const [templateCategory, setTemplateCategory] = useState('General')
    const [isPublicTemplate, setIsPublicTemplate] = useState(false)

    // Publish form state
    const [domain, setDomain] = useState(currentDomain || '')

    const handleShareAsTemplate = async () => {
        if (!templateName.trim()) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please enter a template name',
            })
            return
        }

        if (!userId || userId === '') {
            toast({
                variant: 'destructive',
                title: 'Authentication Required',
                description: 'Please sign in to share templates',
            })
            return
        }

        setLoading(true)
        try {
            // Get project data from editor
            const projectData = editorInstance.getProjectData()

            // Generate thumbnail
            let thumbnail = ''
            try {
                const html2canvas = (await import('html2canvas')).default
                const iframe = document.querySelector('#gjs iframe') as HTMLIFrameElement

                if (iframe?.contentDocument) {
                    const canvas = await html2canvas(iframe.contentDocument.body, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 0.3,
                        logging: false,
                    })
                    thumbnail = canvas.toDataURL('image/jpeg', 0.6)
                }
            } catch (err) {
                console.error('Failed to generate thumbnail:', err)
            }

            const result = await createTemplateFromWebsite(
                {
                    name: templateName,
                    description: templateDescription,
                    category: templateCategory,
                    thumbnail,
                    content: projectData,
                    isPublic: isPublicTemplate,
                },
                userId
            )

            if (result.success) {
                toast({
                    title: 'Success',
                    description: `Template "${templateName}" has been ${isPublicTemplate ? 'shared with the community' : 'saved'}!`,
                })
                onOpenChange(false)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error || 'Failed to create template',
                })
            }
        } catch (error) {
            console.error('Error sharing template:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create template',
            })
        } finally {
            setLoading(false)
        }
    }

    const handlePublishWebsite = async () => {
        setLoading(true)
        try {
            const result = await publishWebsite({
                websiteId,
                domain: domain.trim() || undefined,
            })

            if (result.success) {
                toast({
                    title: 'Success',
                    description: 'Website has been published!',
                })
                onOpenChange(false)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error || 'Failed to publish website',
                })
            }
        } catch (error) {
            console.error('Error publishing website:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to publish website',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleExportHTML = async () => {
        setLoading(true)
        try {
            const result = await getWebsiteExportData(websiteId)

            if (!result.success || !result.data) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error || 'Failed to get export data',
                })
                return
            }

            const { websiteName, pages } = result.data
            const zip = new JSZip()

            // Create index navigation page
            const navLinks = pages
                .map(
                    (page) =>
                        `<li><a href="${page.pathName}.html">${page.name}</a></li>`
                )
                .join('\n          ')

            const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${websiteName} - Navigation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    ul { list-style: none; padding: 0; }
    li { margin: 10px 0; }
    a {
      display: block;
      padding: 15px 20px;
      background: white;
      color: #0066cc;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }
    a:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <h1>${websiteName}</h1>
  <p>Select a page to view:</p>
  <ul>
          ${navLinks}
  </ul>
</body>
</html>`

            zip.file('index.html', indexHtml)

            // Add each page
            pages.forEach((page) => {
                const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <link rel="stylesheet" href="css/${page.pathName}.css">
</head>
<body>
${page.html}
</body>
</html>`

                zip.file(`${page.pathName}.html`, fullHtml)
                zip.file(`css/${page.pathName}.css`, page.css)
            })

            // Generate and download ZIP
            const blob = await zip.generateAsync({ type: 'blob' })
            saveAs(blob, `${websiteName.replace(/\s+/g, '-').toLowerCase()}.zip`)

            toast({
                title: 'Success',
                description: 'Website exported as ZIP file!',
            })
            onOpenChange(false)
        } catch (error) {
            console.error('Error exporting HTML:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to export website',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleExportJSON = async () => {
        setLoading(true)
        try {
            const result = await getProjectJsonExport(websiteId)

            if (!result.success || !result.data) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error || 'Failed to get project data',
                })
                return
            }

            const jsonString = JSON.stringify(result.data, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            saveAs(blob, `${result.data.websiteName.replace(/\s+/g, '-').toLowerCase()}-project.json`)

            toast({
                title: 'Success',
                description: 'Project exported as JSON file!',
            })
            onOpenChange(false)
        } catch (error) {
            console.error('Error exporting JSON:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to export project',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Publish Options</DialogTitle>
                    <DialogDescription>
                        Choose how you want to share or export your website
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="template" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Template</span>
                        </TabsTrigger>
                        <TabsTrigger value="publish" className="gap-2">
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">Publish</span>
                        </TabsTrigger>
                        <TabsTrigger value="html" className="gap-2">
                            <FileArchive className="w-4 h-4" />
                            <span className="hidden sm:inline">HTML/CSS</span>
                        </TabsTrigger>
                        <TabsTrigger value="json" className="gap-2">
                            <FileJson className="w-4 h-4" />
                            <span className="hidden sm:inline">JSON</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Share as Template Tab */}
                    <TabsContent value="template" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="template-name">Template Name *</Label>
                            <Input
                                id="template-name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Enter template name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template-description">Description</Label>
                            <Textarea
                                id="template-description"
                                value={templateDescription}
                                onChange={(e) => setTemplateDescription(e.target.value)}
                                placeholder="Describe your template..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template-category">Category</Label>
                            <Select value={templateCategory} onValueChange={setTemplateCategory}>
                                <SelectTrigger id="template-category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEMPLATE_CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="public-template">Share with Community</Label>
                                <p className="text-sm text-muted-foreground">
                                    Make this template available to all users
                                </p>
                            </div>
                            <Switch
                                id="public-template"
                                checked={isPublicTemplate}
                                onCheckedChange={setIsPublicTemplate}
                            />
                        </div>

                        <Button
                            onClick={handleShareAsTemplate}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Template...
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share Template
                                </>
                            )}
                        </Button>
                    </TabsContent>

                    {/* Publish Website Tab */}
                    <TabsContent value="publish" className="space-y-4 mt-4">
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <p className="text-sm text-muted-foreground">
                                Publishing will make your website live and accessible to visitors.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="domain">Custom Domain (Optional)</Label>
                            <Input
                                id="domain"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="example.com"
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to use default domain
                            </p>
                        </div>

                        <Button
                            onClick={handlePublishWebsite}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Publish Website
                                </>
                            )}
                        </Button>
                    </TabsContent>

                    {/* Export HTML/CSS Tab */}
                    <TabsContent value="html" className="space-y-4 mt-4">
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <h4 className="font-medium mb-2">What's included:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• All website pages as HTML files</li>
                                <li>• Separate CSS files for each page</li>
                                <li>• Navigation index page</li>
                                <li>• Ready to host anywhere</li>
                            </ul>
                        </div>

                        <Button
                            onClick={handleExportHTML}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating ZIP...
                                </>
                            ) : (
                                <>
                                    <FileArchive className="w-4 h-4 mr-2" />
                                    Export as ZIP
                                </>
                            )}
                        </Button>
                    </TabsContent>

                    {/* Export JSON Tab */}
                    <TabsContent value="json" className="space-y-4 mt-4">
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <h4 className="font-medium mb-2">What's included:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Complete GrapeJS project data</li>
                                <li>• All pages with components and styles</li>
                                <li>• Website settings and configuration</li>
                                <li>• Can be imported back into the editor</li>
                            </ul>
                        </div>

                        <Button
                            onClick={handleExportJSON}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating JSON...
                                </>
                            ) : (
                                <>
                                    <FileJson className="w-4 h-4 mr-2" />
                                    Export JSON
                                </>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
