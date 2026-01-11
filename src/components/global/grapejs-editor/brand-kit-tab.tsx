'use client'

import React, { useState } from 'react'
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
import { Palette, Type, Square, Image as ImageIcon, Save, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
    brandKit: BrandKit
    setBrandKit: (kit: BrandKit) => void
    website?: Website
}

const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display', 'Merriweather'
]

const BrandKitTab = ({ brandKit, setBrandKit, website }: Props) => {
    const [saving, setSaving] = useState(false)

    const updateColor = (key: keyof BrandKit['colors'], value: string) => {
        setBrandKit({
            ...brandKit,
            colors: {
                ...brandKit.colors,
                [key]: value
            }
        })
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
                description: 'Brand Kit saved successfully'
            })
        } catch (error) {
            console.error('Error saving brand kit:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save Brand Kit'
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Brand Kit
                </h3>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                        <TabsTrigger value="colors" title="Colors">
                            Colors
                        </TabsTrigger>
                        <TabsTrigger value="type" title="Typography">
                            Type
                        </TabsTrigger>
                        <TabsTrigger value="ui" title="UI Style">
                            UI
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="space-y-4">
                        <div className="space-y-3">
                            <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Primary Colors</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px]">Primary</Label>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded border shrink-0" style={{ backgroundColor: brandKit.colors.primary }} />
                                        <Input
                                            type="text"
                                            value={brandKit.colors.primary}
                                            onChange={(e) => updateColor('primary', e.target.value)}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px]">Secondary</Label>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded border shrink-0" style={{ backgroundColor: brandKit.colors.secondary }} />
                                        <Input
                                            type="text"
                                            value={brandKit.colors.secondary}
                                            onChange={(e) => updateColor('secondary', e.target.value)}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-2">
                                <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Interaction</Label>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px]">Accent</Label>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded border shrink-0" style={{ backgroundColor: brandKit.colors.accent }} />
                                        <Input
                                            type="text"
                                            value={brandKit.colors.accent}
                                            onChange={(e) => updateColor('accent', e.target.value)}
                                            className="h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-2" />
                            <div className="space-y-1.5">
                                <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Surface</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px]">Background</Label>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded border shrink-0" style={{ backgroundColor: brandKit.colors.background }} />
                                            <Input
                                                type="text"
                                                value={brandKit.colors.background}
                                                onChange={(e) => updateColor('background', e.target.value)}
                                                className="h-8 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px]">Text Default</Label>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded border shrink-0" style={{ backgroundColor: brandKit.colors.text }} />
                                            <Input
                                                type="text"
                                                value={brandKit.colors.text}
                                                onChange={(e) => updateColor('text', e.target.value)}
                                                className="h-8 text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="type" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Heading Font Family</Label>
                                <Select value={brandKit.typography.headingFont} onValueChange={(val) => updateTypography('headingFont', val)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select heading font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fontOptions.map(font => (
                                            <SelectItem key={font} value={font}>{font}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Body Font Family</Label>
                                <Select value={brandKit.typography.bodyFont} onValueChange={(val) => updateTypography('bodyFont', val)}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select body font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fontOptions.map(font => (
                                            <SelectItem key={font} value={font}>{font}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Base Font Size ({brandKit.typography.baseFontSize})</Label>
                                <Input
                                    type="text"
                                    value={brandKit.typography.baseFontSize}
                                    onChange={(e) => updateTypography('baseFontSize', e.target.value)}
                                    className="h-8 text-xs"
                                    placeholder="e.g. 16px"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ui" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Global Border Radius</Label>
                                <Input
                                    type="text"
                                    value={brandKit.uiStyle.borderRadius}
                                    onChange={(e) => updateUIStyle('borderRadius', e.target.value)}
                                    className="h-8 text-xs"
                                    placeholder="e.g. 8px"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Button Radius</Label>
                                <Input
                                    type="text"
                                    value={brandKit.uiStyle.buttonRadius}
                                    onChange={(e) => updateUIStyle('buttonRadius', e.target.value)}
                                    className="h-8 text-xs"
                                    placeholder="e.g. 4px"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Shadow Strength</Label>
                                <Input
                                    type="text"
                                    value={brandKit.uiStyle.shadowStrength}
                                    onChange={(e) => updateUIStyle('shadowStrength', e.target.value)}
                                    className="h-8 text-xs font-mono"
                                    placeholder="CSS shadow string"
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator />

                <div className="space-y-4">
                    <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        Brand Assets
                    </Label>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label className="text-[10px]">Logo (Light)</Label>
                            <Input
                                type="text"
                                value={brandKit.assets.logoLight}
                                onChange={(e) => setBrandKit({ ...brandKit, assets: { ...brandKit.assets, logoLight: e.target.value } })}
                                className="h-8 text-xs"
                                placeholder="Logo URL"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px]">Logo (Dark)</Label>
                            <Input
                                type="text"
                                value={brandKit.assets.logoDark}
                                onChange={(e) => setBrandKit({ ...brandKit, assets: { ...brandKit.assets, logoDark: e.target.value } })}
                                className="h-8 text-xs"
                                placeholder="Logo URL"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px]">Favicon</Label>
                            <Input
                                type="text"
                                value={brandKit.assets.favicon}
                                onChange={(e) => setBrandKit({ ...brandKit, assets: { ...brandKit.assets, favicon: e.target.value } })}
                                className="h-8 text-xs"
                                placeholder="Favicon URL"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrandKitTab
