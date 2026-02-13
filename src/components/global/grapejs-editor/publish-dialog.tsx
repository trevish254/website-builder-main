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
import { Loader2, Share2, Globe, FileArchive, FileJson, ExternalLink } from 'lucide-react'
import { slugify } from '@/lib/utils'
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
    subaccountId: string
    currentDomain?: string
    subdomain?: string
    isPublished?: boolean
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
    subaccountId,
    currentDomain,
    subdomain,
    isPublished,
}: PublishDialogProps) {
    console.log('!!! PUBLISH DIALOG MOUNTED !!! open:', open)

    const [activeTab, setActiveTab] = useState('template')
    const [loading, setLoading] = useState(false)

    // Calculate effective subdomain for display
    const effectiveSubdomain = subdomain || `${slugify(websiteName)}.${websiteId.substring(0, 7)}`
    const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'
    const fullDefaultDomain = `${effectiveSubdomain}.${mainDomain}`

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

            // Generate high-quality hero section thumbnail
            let thumbnail = ''
            try {
                const html2canvas = (await import('html2canvas')).default

                // Try multiple selectors to find the GrapesJS iframe
                const iframe = document.querySelector('#gjs iframe') as HTMLIFrameElement ||
                    document.querySelector('iframe[class*="gjs"]') as HTMLIFrameElement ||
                    document.querySelector('.gjs-frame') as HTMLIFrameElement

                if (iframe?.contentDocument?.body) {
                    // Scroll to top to capture hero section
                    iframe.contentWindow?.scrollTo(0, 0)

                    // Wait for any animations/images to load
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Capture the hero section (top portion) at high quality
                    // We'll capture more height to ensure we get the full hero section
                    const canvas = await html2canvas(iframe.contentDocument.body, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 1, // Full scale for maximum quality
                        logging: false,
                        height: 800, // Capture top 800px (typical hero section height)
                        windowHeight: 800,
                        y: 0, // Start from top
                        scrollY: 0,
                        scrollX: 0,
                        backgroundColor: '#ffffff'
                    })

                    // Create thumbnail with standard dimensions
                    const THUMBNAIL_WIDTH = 400
                    const THUMBNAIL_HEIGHT = 300

                    const resizedCanvas = document.createElement('canvas')
                    resizedCanvas.width = THUMBNAIL_WIDTH
                    resizedCanvas.height = THUMBNAIL_HEIGHT

                    const ctx = resizedCanvas.getContext('2d')
                    if (ctx) {
                        // Enable image smoothing for better quality
                        ctx.imageSmoothingEnabled = true
                        ctx.imageSmoothingQuality = 'high'

                        // Fill with white background
                        ctx.fillStyle = '#ffffff'
                        ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)

                        // Calculate dimensions to maintain aspect ratio
                        const sourceAspectRatio = canvas.width / canvas.height
                        const targetAspectRatio = THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT

                        let sourceX = 0
                        let sourceY = 0
                        let sourceWidth = canvas.width
                        let sourceHeight = canvas.height

                        // Crop to match target aspect ratio (cover mode)
                        if (sourceAspectRatio > targetAspectRatio) {
                            // Source is wider - crop sides
                            sourceWidth = canvas.height * targetAspectRatio
                            sourceX = (canvas.width - sourceWidth) / 2
                        } else {
                            // Source is taller - crop top/bottom (keep top portion)
                            sourceHeight = canvas.width / targetAspectRatio
                            sourceY = 0 // Keep from top
                        }

                        // Draw the cropped and scaled image
                        ctx.drawImage(
                            canvas,
                            sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
                            0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT // Destination rectangle
                        )

                        // Use higher quality JPEG encoding
                        thumbnail = resizedCanvas.toDataURL('image/jpeg', 0.85)
                        console.log('✓ High-quality hero section thumbnail generated')
                    } else {
                        // Fallback: simple resize
                        const fallbackCanvas = document.createElement('canvas')
                        fallbackCanvas.width = THUMBNAIL_WIDTH
                        fallbackCanvas.height = THUMBNAIL_HEIGHT
                        const fallbackCtx = fallbackCanvas.getContext('2d')
                        if (fallbackCtx) {
                            fallbackCtx.drawImage(canvas, 0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
                            thumbnail = fallbackCanvas.toDataURL('image/jpeg', 0.8)
                        }
                    }

                    if (!thumbnail) {
                        console.warn('Thumbnail generation produced empty result')
                    }
                } else {
                    console.warn('Could not find GrapesJS iframe for thumbnail generation')
                }
            } catch (err) {
                console.error('Failed to generate thumbnail:', err)
                // Don't throw - allow template creation to continue without thumbnail
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
                    title: 'Success!',
                    description: (
                        <div className="flex flex-col gap-2">
                            <p>Template "{templateName}" has been {isPublicTemplate ? 'shared with the community' : 'saved to your library'}!</p>
                            {isPublicTemplate && (
                                <Button variant="outline" size="sm" className="w-fit" asChild>
                                    <a href={`/subaccount/${subaccountId}/websites`}>View in Community Gallery</a>
                                </Button>
                            )}
                        </div>
                    )
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
                subdomain: effectiveSubdomain,
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
                            <span className="hidden sm:inline">Community</span>
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
                        <div className="rounded-lg border p-4 bg-primary/5 border-primary/20 flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-primary">Community Marketplace</h4>
                                <p className="text-sm text-muted-foreground">Share your design with the Plura community or save as a private template.</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <a href={`/subaccount/${subaccountId}/websites`} target="_blank">Browse Community</a>
                            </Button>
                        </div>

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
                            className={`w-full ${isPublicTemplate ? 'bg-primary hover:bg-primary/90' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Template...
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    {isPublicTemplate ? 'Share to Community Gallery' : 'Save as Private Template'}
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

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="domain">Custom Domain (Optional)</Label>
                                <Input
                                    id="domain"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="example.com"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Connect your own domain (e.g., example.com)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Generated Domain</Label>
                                <a
                                    href={`http://${fullDefaultDomain}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between group hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Globe size={14} className="text-primary flex-shrink-0" />
                                        <span className="text-sm font-medium text-primary break-all">
                                            {fullDefaultDomain}
                                        </span>
                                    </div>
                                    <ExternalLink size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                                <p className="text-xs text-muted-foreground">
                                    Your website will be live at this address.
                                </p>
                            </div>
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
                                    {isPublished ? 'Update Website' : 'Publish Website'}
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
