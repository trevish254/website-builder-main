'use client'

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/parser-html'
import parserCss from 'prettier/parser-postcss'

interface CodeViewerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    html: string
    css: string
}

export default function CodeViewerDialog({
    open,
    onOpenChange,
    html,
    css,
}: CodeViewerDialogProps) {
    const [copiedHtml, setCopiedHtml] = React.useState(false)
    const [copiedCss, setCopiedCss] = React.useState(false)
    const [formattedHtml, setFormattedHtml] = useState(' ')
    const [formattedCss, setFormattedCss] = useState(' ')
    const [isFormatting, setIsFormatting] = useState(false)

    // Format code when dialog opens or code changes
    useEffect(() => {
        if (open && html) {
            setIsFormatting(true)
            try {
                const formatted = prettier.format(html, {
                    parser: 'html',
                    plugins: [parserHtml],
                    printWidth: 80,
                    tabWidth: 2,
                    useTabs: false,
                })
                setFormattedHtml(formatted)
            } catch (error) {
                console.error('Error formatting HTML:', error)
                setFormattedHtml(html || ' ')
            } finally {
                setIsFormatting(false)
            }
        }
    }, [open, html])

    useEffect(() => {
        if (open && css) {
            setIsFormatting(true)
            try {
                const formatted = prettier.format(css, {
                    parser: 'css',
                    plugins: [parserCss],
                    printWidth: 80,
                    tabWidth: 2,
                    useTabs: false,
                })
                setFormattedCss(formatted)
            } catch (error) {
                console.error('Error formatting CSS:', error)
                setFormattedCss(css || ' ')
            } finally {
                setIsFormatting(false)
            }
        }
    }, [open, css])

    const handleCopyHtml = async () => {
        try {
            await navigator.clipboard.writeText(formattedHtml)
            setCopiedHtml(true)
            toast({
                title: 'Copied!',
                description: 'HTML code copied to clipboard',
            })
            setTimeout(() => setCopiedHtml(false), 2000)
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to copy HTML',
            })
        }
    }

    const handleCopyCss = async () => {
        try {
            await navigator.clipboard.writeText(formattedCss)
            setCopiedCss(true)
            toast({
                title: 'Copied!',
                description: 'CSS code copied to clipboard',
            })
            setTimeout(() => setCopiedCss(false), 2000)
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to copy CSS',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] h-[90vh] overflow-hidden flex flex-col p-6">
                <DialogHeader>
                    <DialogTitle>View Code</DialogTitle>
                    <DialogDescription>
                        View and copy the formatted HTML and CSS code for your page
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="split" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="split">Split View</TabsTrigger>
                        <TabsTrigger value="html">HTML Only</TabsTrigger>
                        <TabsTrigger value="css">CSS Only</TabsTrigger>
                    </TabsList>

                    {/* Split View */}
                    <TabsContent value="split" className="flex-1 flex gap-4 overflow-hidden mt-4">
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold">HTML</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopyHtml}
                                    className="gap-2"
                                >
                                    {copiedHtml ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="flex-1 overflow-auto rounded-lg border">
                                {formattedHtml.trim() ? (
                                    <SyntaxHighlighter
                                        language="html"
                                        style={vscDarkPlus}
                                        customStyle={{
                                            margin: 0,
                                            height: '100%',
                                            fontSize: '13px',
                                        }}
                                        showLineNumbers
                                    >
                                        {formattedHtml}
                                    </SyntaxHighlighter>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        {isFormatting ? 'Formatting...' : 'Loading...'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold">CSS</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopyCss}
                                    className="gap-2"
                                >
                                    {copiedCss ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="flex-1 overflow-auto rounded-lg border">
                                {formattedCss.trim() ? (
                                    <SyntaxHighlighter
                                        language="css"
                                        style={vscDarkPlus}
                                        customStyle={{
                                            margin: 0,
                                            height: '100%',
                                            fontSize: '13px',
                                        }}
                                        showLineNumbers
                                    >
                                        {formattedCss}
                                    </SyntaxHighlighter>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        {isFormatting ? 'Formatting...' : 'Loading...'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* HTML Only */}
                    <TabsContent value="html" className="flex-1 flex flex-col overflow-hidden mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">HTML</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyHtml}
                                className="gap-2"
                            >
                                {copiedHtml ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto rounded-lg border">
                            {formattedHtml.trim() ? (
                                <SyntaxHighlighter
                                    language="html"
                                    style={vscDarkPlus}
                                    customStyle={{
                                        margin: 0,
                                        height: '100%',
                                        fontSize: '14px',
                                    }}
                                    showLineNumbers
                                >
                                    {formattedHtml}
                                </SyntaxHighlighter>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    {isFormatting ? 'Formatting...' : 'Loading...'}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* CSS Only */}
                    <TabsContent value="css" className="flex-1 flex flex-col overflow-hidden mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">CSS</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyCss}
                                className="gap-2"
                            >
                                {copiedCss ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto rounded-lg border">
                            {formattedCss.trim() ? (
                                <SyntaxHighlighter
                                    language="css"
                                    style={vscDarkPlus}
                                    customStyle={{
                                        margin: 0,
                                        height: '100%',
                                        fontSize: '14px',
                                    }}
                                    showLineNumbers
                                >
                                    {formattedCss}
                                </SyntaxHighlighter>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    {isFormatting ? 'Formatting...' : 'Loading...'}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
