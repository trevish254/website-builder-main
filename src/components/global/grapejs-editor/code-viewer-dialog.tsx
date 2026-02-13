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
import { Copy, Check, X } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/plugins/html'
import parserCss from 'prettier/plugins/postcss'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    html: string
    css: string
}

const CodeViewerDialog = ({ open, onOpenChange, html, css }: Props) => {
    const [activeTab, setActiveTab] = useState<'split' | 'html' | 'css'>('split')
    const [copiedHtml, setCopiedHtml] = useState(false)
    const [copiedCss, setCopiedCss] = useState(false)
    const [formattedHtml, setFormattedHtml] = useState('')
    const [formattedCss, setFormattedCss] = useState('')
    const [isFormatting, setIsFormatting] = useState(false)

    useEffect(() => {
        const formatContent = async () => {
            if (open) {
                setIsFormatting(true)
                try {
                    // Format HTML
                    const fHtml = await prettier.format(html || '', {
                        parser: 'html',
                        plugins: [parserHtml],
                        printWidth: 60,
                        tabWidth: 2,
                        bracketSameLine: false,
                        htmlWhitespaceSensitivity: 'ignore',
                    })
                    setFormattedHtml(fHtml)

                    // Format CSS
                    const fCss = await prettier.format(css || '', {
                        parser: 'css',
                        plugins: [parserCss],
                        printWidth: 60,
                        tabWidth: 2,
                    })
                    setFormattedCss(fCss)
                } catch (error) {
                    console.error('Error formatting code:', error)
                    setFormattedHtml(html || '')
                    setFormattedCss(css || '')
                } finally {
                    setIsFormatting(false)
                }
            }
        }
        formatContent()
    }, [open, html, css])

    const handleCopyHtml = async () => {
        try {
            await navigator.clipboard.writeText(formattedHtml)
            setCopiedHtml(true)
            toast({
                title: 'Copied!',
                description: 'HTML code copied to clipboard',
            })
            setTimeout(() => setCopiedHtml(false), 2000)
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to copy HTML code',
                variant: 'destructive',
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
        } catch (err) {
            toast({
                title: 'Error',
                description: 'Failed to copy CSS code',
                variant: 'destructive',
            })
        }
    }

    const CodeArea = ({
        language,
        code,
        title,
        onCopy,
        isCopied
    }: {
        language: string,
        code: string,
        title: string,
        onCopy: () => void,
        isCopied: boolean
    }) => (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#2D2D2D] rounded-lg shadow-xl border border-white/10 h-full">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{title}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="h-7 px-2 text-slate-400 hover:text-white hover:bg-white/10 gap-1.5"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-[10px]">COPIED</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">COPY</span>
                        </>
                    )}
                </Button>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
                {isFormatting ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '1.5rem 1rem',
                            minHeight: '100%',
                            fontSize: '13px',
                            backgroundColor: 'transparent',
                            lineHeight: '1.5',
                        }}
                        showLineNumbers
                        wrapLines={true}
                        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap', display: 'block' } }}
                        lineNumberStyle={{
                            minWidth: '3.5em',
                            paddingRight: '1.5em',
                            color: '#858585',
                            textAlign: 'right',
                            userSelect: 'none',
                            opacity: 0.5,
                            fontSize: '11px',
                        }}
                    >
                        {code || ' '}
                    </SyntaxHighlighter>
                )}
            </div>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden bg-white border-none shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">Code</DialogTitle>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                    <DialogDescription className="sr-only">
                        View and copy the formatted HTML and CSS code for your page
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col bg-slate-100/50 p-6 overflow-hidden">
                    <Tabs defaultValue="split" className="flex-1 flex flex-col h-full" onValueChange={(v) => setActiveTab(v as any)}>
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-slate-200 p-1">
                                <TabsTrigger value="split" className="data-[state=active]:bg-white">Split View</TabsTrigger>
                                <TabsTrigger value="html" className="data-[state=active]:bg-white">HTML Only</TabsTrigger>
                                <TabsTrigger value="css" className="data-[state=active]:bg-white">CSS Only</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="split" className="flex-1 flex gap-4 overflow-hidden min-h-0 data-[state=inactive]:hidden data-[state=active]:flex">
                            <CodeArea
                                title="HTML"
                                language="html"
                                code={formattedHtml}
                                onCopy={handleCopyHtml}
                                isCopied={copiedHtml}
                            />
                            <CodeArea
                                title="CSS"
                                language="css"
                                code={formattedCss}
                                onCopy={handleCopyCss}
                                isCopied={copiedCss}
                            />
                        </TabsContent>

                        <TabsContent value="html" className="flex-1 flex flex-col overflow-hidden min-h-0 data-[state=inactive]:hidden data-[state=active]:flex">
                            <CodeArea
                                title="HTML"
                                language="html"
                                code={formattedHtml}
                                onCopy={handleCopyHtml}
                                isCopied={copiedHtml}
                            />
                        </TabsContent>

                        <TabsContent value="css" className="flex-1 flex flex-col overflow-hidden min-h-0 data-[state=inactive]:hidden data-[state=active]:flex">
                            <CodeArea
                                title="CSS"
                                language="css"
                                code={formattedCss}
                                onCopy={handleCopyCss}
                                isCopied={copiedCss}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CodeViewerDialog
