'use client'

import React, { useState, useEffect } from 'react'
import { BrandKit } from './index'
import { Website, upsertWebsite } from '@/lib/website-queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import { Palette, Type, Square, Image as ImageIcon, Save, Loader2, Sparkles, Wand2, Check } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUpload from '../file-upload'
import { cn } from '@/lib/utils'

type Props = {
    brandKit: BrandKit
    setBrandKit: (kit: BrandKit) => void
    website?: Website
}

const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display', 'Merriweather', 'Lora', 'Outfit', 'Plus Jakarta Sans'
]

const colorPresets = [
    {
        name: 'Modern Blue',
        colors: { primary: '#3b82f6', secondary: '#64748b', accent: '#f59e0b', background: '#ffffff', text: '#020617' }
    },
    {
        name: 'Deep Purple',
        colors: { primary: '#8b5cf6', secondary: '#475569', accent: '#ec4899', background: '#ffffff', text: '#1e1b4b' }
    },
    {
        name: 'Nature Green',
        colors: { primary: '#10b981', secondary: '#3f6212', accent: '#f59e0b', background: '#f8fafc', text: '#064e3b' }
    },
    {
        name: 'Midnight Dark',
        colors: { primary: '#3b82f6', secondary: '#94a3b8', accent: '#60a5fa', background: '#020617', text: '#f8fafc' }
    },
    {
        name: 'Sunset Orange',
        colors: { primary: '#f97316', secondary: '#7c2d12', accent: '#fbbf24', background: '#fff7ed', text: '#431407' }
    }
]

const BrandKitTab = ({ brandKit, setBrandKit, website }: Props) => {
    const [saving, setSaving] = useState(false)
    const [activePreset, setActivePreset] = useState<string | null>(null)

    const updateColor = (key: keyof BrandKit['colors'], value: string) => {
        setBrandKit({
            ...brandKit,
            colors: {
                ...brandKit.colors,
                [key]: value
            }
        })
        setActivePreset(null)
    }

    const updateTypography = (key: keyof BrandKit['typography'], value: string) => {
        setBrandKit({
            ...brandKit,
            typography: {
                ...brandKit.typography,
                [key]: value
            }
        })
    }

    const updateUIStyle = (key: keyof BrandKit['uiStyle'], value: string) => {
        setBrandKit({
            ...brandKit,
            uiStyle: {
                ...brandKit.uiStyle,
                [key]: value
            }
        })
    }

    const applyPreset = (preset: typeof colorPresets[0]) => {
        setBrandKit({
            ...brandKit,
            colors: preset.colors
        })
        setActivePreset(preset.name)
        toast({
            title: 'Preset Applied',
            description: `Applied the ${preset.name} color palette.`
        })
    }

    const handleSave = async () => {
        if (!website) return
        setSaving(true)
        try {
            await upsertWebsite({
                ...website,
                settings: {
                    ...website.settings,
                    brandKit: brandKit
                }
            })
            toast({
                title: 'Success',
                description: 'Brand identity synchronized successfully.'
            })
        } catch (error) {
            console.error('Error saving brand kit:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to synchronize brand kit.'
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            <div className="p-6 border-b flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-tight">Brand Identity</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-70">Design System</p>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 active:shadow-sm"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Sync
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Tabs defaultValue="colors" className="w-full">
                    <div className="px-6 pt-4 sticky top-0 z-10 bg-background pb-2">
                        <TabsList className="grid grid-cols-3 w-full p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl h-12">
                            <TabsTrigger value="colors" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all duration-300 gap-2">
                                <Palette className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">Colors</span>
                            </TabsTrigger>
                            <TabsTrigger value="type" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all duration-300 gap-2">
                                <Type className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">Type</span>
                            </TabsTrigger>
                            <TabsTrigger value="ui" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm transition-all duration-300 gap-2">
                                <Square className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">UI</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6 pt-2 pb-24 space-y-8">
                        <TabsContent value="colors" className="space-y-8 m-0 outline-none">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs uppercase text-muted-foreground font-black tracking-[0.2em]">Core Palette</Label>
                                    <Wand2 className="w-3.5 h-3.5 text-primary opacity-50" />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="group relative bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 hover:border-primary/30 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="text-[10px] font-black uppercase text-neutral-400">Primary Identity</Label>
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="relative group/swatch">
                                                <div
                                                    className="w-14 h-14 rounded-2xl border-4 border-white dark:border-neutral-800 shadow-xl cursor-pointer transition-transform group-hover/swatch:scale-105"
                                                    style={{ backgroundColor: brandKit.colors.primary }}
                                                />
                                                <input
                                                    type="color"
                                                    value={brandKit.colors.primary}
                                                    onChange={(e) => updateColor('primary', e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Input
                                                    type="text"
                                                    value={brandKit.colors.primary}
                                                    onChange={(e) => updateColor('primary', e.target.value)}
                                                    className="h-10 text-sm font-bold font-mono bg-transparent border-none focus-visible:ring-0 p-0"
                                                />
                                                <p className="text-[9px] text-muted-foreground font-medium">Used for buttons, links and active states.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                            <Label className="text-[9px] font-black uppercase text-neutral-400 block mb-3">Secondary</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden flex-shrink-0">
                                                    <div className="absolute inset-0" style={{ backgroundColor: brandKit.colors.secondary }} />
                                                    <input type="color" value={brandKit.colors.secondary} onChange={(e) => updateColor('secondary', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={brandKit.colors.secondary}
                                                    onChange={(e) => updateColor('secondary', e.target.value)}
                                                    className="h-8 text-xs font-bold font-mono bg-transparent border-none focus-visible:ring-0 p-0"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                            <Label className="text-[9px] font-black uppercase text-neutral-400 block mb-3">Accent</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden flex-shrink-0">
                                                    <div className="absolute inset-0" style={{ backgroundColor: brandKit.colors.accent }} />
                                                    <input type="color" value={brandKit.colors.accent} onChange={(e) => updateColor('accent', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={brandKit.colors.accent}
                                                    onChange={(e) => updateColor('accent', e.target.value)}
                                                    className="h-8 text-xs font-bold font-mono bg-transparent border-none focus-visible:ring-0 p-0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                            <Label className="text-[9px] font-black uppercase text-neutral-400 block mb-3">Canvas</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden flex-shrink-0">
                                                    <div className="absolute inset-0" style={{ backgroundColor: brandKit.colors.background }} />
                                                    <input type="color" value={brandKit.colors.background} onChange={(e) => updateColor('background', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={brandKit.colors.background}
                                                    onChange={(e) => updateColor('background', e.target.value)}
                                                    className="h-8 text-xs font-bold font-mono bg-transparent border-none focus-visible:ring-0 p-0"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                            <Label className="text-[9px] font-black uppercase text-neutral-400 block mb-3">Main Text</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden flex-shrink-0">
                                                    <div className="absolute inset-0" style={{ backgroundColor: brandKit.colors.text }} />
                                                    <input type="color" value={brandKit.colors.text} onChange={(e) => updateColor('text', e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                                <Input
                                                    type="text"
                                                    value={brandKit.colors.text}
                                                    onChange={(e) => updateColor('text', e.target.value)}
                                                    className="h-8 text-xs font-bold font-mono bg-transparent border-none focus-visible:ring-0 p-0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-dashed">
                                <Label className="text-xs uppercase text-muted-foreground font-black tracking-[0.2em]">Curation</Label>
                                <div className="grid grid-cols-5 gap-3">
                                    {colorPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => applyPreset(preset)}
                                            className={cn(
                                                "group relative flex flex-col items-center p-1 rounded-2xl transition-all duration-300",
                                                activePreset === preset.name ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-neutral-50 dark:hover:bg-neutral-900"
                                            )}
                                            title={preset.name}
                                        >
                                            <div className="w-full aspect-square rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm group-hover:scale-110 transition-transform overflow-hidden flex flex-wrap relative">
                                                <div className="w-1/2 h-1/2" style={{ backgroundColor: preset.colors.primary }} />
                                                <div className="w-1/2 h-1/2" style={{ backgroundColor: preset.colors.secondary }} />
                                                <div className="w-1/2 h-1/2" style={{ backgroundColor: preset.colors.accent }} />
                                                <div className="w-1/2 h-1/2" style={{ backgroundColor: preset.colors.background }} />
                                                {activePreset === preset.name && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="type" className="space-y-6 m-0 outline-none">
                            <div className="space-y-6">
                                <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Type className="w-3.5 h-3.5 text-primary" />
                                        <Label className="text-[10px] font-black uppercase text-neutral-400">Headlines</Label>
                                    </div>
                                    <Select value={brandKit.typography.headingFont} onValueChange={(val) => updateTypography('headingFont', val)}>
                                        <SelectTrigger className="h-11 bg-background border-none shadow-sm rounded-xl font-bold">
                                            <SelectValue placeholder="Select heading font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fontOptions.map(font => (
                                                <SelectItem key={font} value={font} className="font-bold">{font}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div
                                        className="p-4 mt-2 rounded-xl bg-background border border-neutral-100 dark:border-neutral-800 text-center overflow-hidden whitespace-nowrap"
                                        style={{ fontFamily: brandKit.typography.headingFont }}
                                    >
                                        <span className="text-xl font-bold tracking-tight">The Quick Brown Fox</span>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Type className="w-3.5 h-3.5 text-primary" />
                                        <Label className="text-[10px] font-black uppercase text-neutral-400">Body Text</Label>
                                    </div>
                                    <Select value={brandKit.typography.bodyFont} onValueChange={(val) => updateTypography('bodyFont', val)}>
                                        <SelectTrigger className="h-11 bg-background border-none shadow-sm rounded-xl font-medium">
                                            <SelectValue placeholder="Select body font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fontOptions.map(font => (
                                                <SelectItem key={font} value={font}>{font}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div
                                        className="p-4 mt-2 rounded-xl bg-background border border-neutral-100 dark:border-neutral-800"
                                        style={{ fontFamily: brandKit.typography.bodyFont }}
                                    >
                                        <p className="text-sm leading-relaxed opacity-70">Sphinx of black quartz, judge my vow. This is how your body font will look in long paragraphs.</p>
                                    </div>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                                    <Label className="text-[10px] font-black uppercase text-neutral-400 block mb-3">Base Font Size</Label>
                                    <div className="flex items-center gap-4">
                                        <Slider
                                            value={[parseInt(brandKit.typography.baseFontSize) || 16]}
                                            max={24}
                                            min={12}
                                            step={1}
                                            onValueChange={(val) => updateTypography('baseFontSize', `${val[0]}px`)}
                                            className="flex-1"
                                        />
                                        <span className="min-w-[40px] text-center font-mono font-bold text-sm bg-background p-2 rounded-lg shadow-sm">{brandKit.typography.baseFontSize}</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ui" className="space-y-8 m-0 outline-none">
                            <div className="space-y-6">
                                <div className="bg-neutral-50 dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50">
                                    <Label className="text-[10px] font-black uppercase text-neutral-400 block mb-6">Component Radii</Label>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span>Global Corner</span>
                                                <span className="font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">{brandKit.uiStyle.borderRadius}</span>
                                            </div>
                                            <Slider
                                                value={[parseInt(brandKit.uiStyle.borderRadius) || 0]}
                                                max={32}
                                                onValueChange={(val) => updateUIStyle('borderRadius', `${val[0]}px`)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span>Buttons</span>
                                                <span className="font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">{brandKit.uiStyle.buttonRadius}</span>
                                            </div>
                                            <Slider
                                                value={[parseInt(brandKit.uiStyle.buttonRadius) || 0]}
                                                max={40}
                                                onValueChange={(val) => updateUIStyle('buttonRadius', `${val[0]}px`)}
                                            />
                                            <div className="flex gap-2">
                                                <div className="p-3 bg-primary text-white text-[10px] font-bold shadow-lg shadow-primary/20" style={{ borderRadius: brandKit.uiStyle.buttonRadius }}>Preview</div>
                                                <div className="p-3 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold" style={{ borderRadius: brandKit.uiStyle.buttonRadius }}>Outline</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50">
                                    <Label className="text-[10px] font-black uppercase text-neutral-400 block mb-4">Shadow Architecture</Label>
                                    <Input
                                        value={brandKit.uiStyle.shadowStrength}
                                        onChange={(e) => updateUIStyle('shadowStrength', e.target.value)}
                                        className="h-11 bg-background border-none shadow-sm rounded-xl font-mono text-xs"
                                        placeholder="e.g. 0 10px 15px -3px rgb(0 0 0 / 0.1)"
                                    />
                                    <div
                                        className="mt-4 p-8 bg-background rounded-2xl flex items-center justify-center border border-neutral-100 dark:border-neutral-800"
                                        style={{ boxShadow: brandKit.uiStyle.shadowStrength }}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-30 italic">Shadow Depth Preview</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="px-6 space-y-8 mt-4 border-t border-dashed pt-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 opacity-50" />
                        </div>
                        <Label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Brand Assets</Label>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                Canvas Logo (Light)
                            </Label>
                            <FileUpload
                                apiEndpoint="subaccountFile"
                                value={brandKit.assets.logoLight}
                                onChange={(url) => setBrandKit({ ...brandKit, assets: { ...brandKit.assets, logoLight: Array.isArray(url) ? url[0] : url || '' } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-neutral-900" />
                                Canvas Logo (Dark)
                            </Label>
                            <FileUpload
                                apiEndpoint="subaccountFile"
                                value={brandKit.assets.logoDark}
                                onChange={(url) => setBrandKit({ ...brandKit, assets: { ...brandKit.assets, logoDark: Array.isArray(url) ? url[0] : url || '' } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-primary" />
                                Favicon
                            </Label>
                            <FileUpload
                                apiEndpoint="subaccountFile"
                                value={brandKit.assets.favicon}
                                onChange={(url) => setBrandKit({ ...brandKit, assets: { ...brandKit.assets, favicon: Array.isArray(url) ? url[0] : url || '' } })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] z-20 pointer-events-none">
                <div className="w-full p-4 bg-background/80 backdrop-blur-3xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl shadow-2xl pointer-events-auto flex items-center justify-between gap-4">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: brandKit.colors.primary }} />
                        <div className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: brandKit.colors.secondary }} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">Draft Identity</span>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        className="h-9 px-6 rounded-2xl bg-primary text-white font-bold"
                    >
                        Sync Live
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BrandKitTab
