'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, X, GripVertical, Image as ImageIcon, Square, Layers, ChevronDown, ChevronRight, Pipette } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'

declare global {
    interface Window {
        EyeDropper: any;
    }
}

type BackgroundLayerType = 'color' | 'image' | 'gradient'

interface BackgroundLayer {
    id: string
    type: BackgroundLayerType
    color?: string
    imageUrl?: string
    imageSize?: string
    imagePosition?: string
    imageRepeat?: string
    imageAttachment?: string
    gradientType?: string
    gradientDirection?: string
    gradientColor1?: string
    gradientColor2?: string
}

interface BackgroundLayersProps {
    editor: any
    property: any
}

const BackgroundLayers = ({ editor, property }: BackgroundLayersProps) => {
    // Start with a default color layer so it's not "blank"
    const [layers, setLayers] = useState<BackgroundLayer[]>([
        {
            id: 'initial-layer',
            type: 'color',
            color: '#ffffff'
        }
    ])
    const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null)
    const isInternalUpdate = useRef(false)

    useEffect(() => {
        console.log('BackgroundLayers component mounted');
    }, []);

    // Load initial layers from component style
    useEffect(() => {
        if (!editor) return

        const loadStyles = () => {
            const selected = editor.getSelected()
            if (!selected) return
            // For now we keep our session state. In a full version, we'd parse the 'background' CSS
        }

        editor.on('component:toggled', loadStyles)
        return () => editor.off('component:toggled', loadStyles)
    }, [editor])

    // Apply styles to editor when layers change
    useEffect(() => {
        if (!editor || !layers.length) return

        const applyStyles = () => {
            const selected = editor.getSelected()
            if (!selected) return

            const images: string[] = []
            const positions: string[] = []
            const sizes: string[] = []
            const repeats: string[] = []
            const attachments: string[] = []
            let baseColor = 'transparent'

            layers.forEach(layer => {
                if (layer.type === 'color') {
                    baseColor = layer.color || 'transparent'
                } else if (layer.type === 'image' && layer.imageUrl) {
                    images.push(`url("${layer.imageUrl}")`)
                    positions.push(layer.imagePosition || 'left top')
                    sizes.push(layer.imageSize || 'auto')
                    repeats.push(layer.imageRepeat || 'repeat')
                    attachments.push(layer.imageAttachment || 'scroll')
                } else if (layer.type === 'gradient') {
                    const type = layer.gradientType || 'linear-gradient'
                    const dir = layer.gradientDirection || 'to bottom'
                    const c1 = layer.gradientColor1 || '#3b82f6'
                    const c2 = layer.gradientColor2 || '#1e293b'
                    images.push(`${type}(${dir}, ${c1}, ${c2})`)
                    positions.push('center center')
                    sizes.push('auto')
                    repeats.push('no-repeat')
                    attachments.push('scroll')
                }
            })

            selected.addStyle({
                'background-image': images.join(', ') || 'none',
                'background-position': positions.join(', ') || 'initial',
                'background-size': sizes.join(', ') || 'initial',
                'background-repeat': repeats.join(', ') || 'initial',
                'background-attachment': attachments.join(', ') || 'initial',
                'background-color': baseColor,
            })
        }

        applyStyles()
    }, [layers, editor])

    const addLayer = () => {
        const newLayer: BackgroundLayer = {
            id: `layer-${Date.now()}`,
            type: 'color',
            color: '#ffffff'
        }
        setLayers([newLayer, ...layers])
        setExpandedLayerId(newLayer.id)
    }

    const removeLayer = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        setLayers(layers.filter(l => l.id !== id))
        if (expandedLayerId === id) {
            setExpandedLayerId(null)
        }
    }

    const updateLayer = (id: string, updates: Partial<BackgroundLayer>) => {
        setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l))
    }

    const openAssetManager = (layerId: string) => {
        if (!editor) return
        try {
            editor.runCommand('open-assets', {
                types: ['image'],
                accept: 'image/*',
                onSelect: (asset: any) => {
                    const url = asset.get('src')
                    updateLayer(layerId, { imageUrl: url, type: 'image' })
                    editor.Modal.close()
                }
            })
        } catch (e) {
            console.error('Asset Manager error:', e);
        }
    }

    const openEyeDropper = async (layerId: string) => {
        if (!window.EyeDropper) {
            alert('Your browser does not support the EyeDropper API');
            return;
        }

        try {
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            updateLayer(layerId, { color: result.sRGBHex });
        } catch (e) {
            console.log('EyeDropper closed or failed', e);
        }
    };

    return (
        <div style={{ width: '100%', background: '#1e1e1e', borderRadius: '4px', padding: '4px' }}>
            {/* Header: Background X + */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#c07373' }}>Background</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={() => setLayers([])}
                        style={{ color: '#888', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={addLayer}
                        style={{ color: '#888', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Layers List */}
            <div className="space-y-1">
                {layers.length === 0 && (
                    <div className="py-4 text-center border border-dashed border-[#3d3d3d] rounded text-[#666] text-xs">
                        No background layers
                    </div>
                )}
                {layers.map((layer) => (
                    <div
                        key={layer.id}
                        className="bg-[#2d2d2d] border border-[#3d3d3d] rounded overflow-hidden"
                    >
                        <div
                            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#333] transition-colors"
                            onClick={() => setExpandedLayerId(expandedLayerId === layer.id ? null : layer.id)}
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="w-3.5 h-3.5 text-[#555] cursor-grab" />
                                <span className="text-xs text-[#bbb] capitalize">
                                    {layer.type === 'color' ? 'Solid Color' : layer.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-sm border border-[#1e1e1e]"
                                    style={{
                                        backgroundColor: layer.type === 'color' ? layer.color : (layer.type === 'gradient' ? layer.gradientColor1 : '#fff'),
                                        backgroundImage: layer.type === 'image' && layer.imageUrl ? `url(${layer.imageUrl})` : 'none',
                                        backgroundSize: 'cover'
                                    }}
                                />
                                <button
                                    onClick={(e) => removeLayer(layer.id, e)}
                                    className="text-[#555] hover:text-red-400 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {expandedLayerId === layer.id && (
                            <div className="p-3 bg-[#2d2d2d] border-t border-[#3d3d3d] space-y-4">
                                {/* Mode Toggle */}
                                <div className="flex gap-0.5 p-0.5 bg-[#1e1e1e] rounded border border-[#3d3d3d]">
                                    <button
                                        onClick={() => updateLayer(layer.id, { type: 'image' })}
                                        className={`flex-1 flex items-center justify-center py-2 rounded-sm ${layer.type === 'image' ? 'bg-[#4a4a4a] text-white' : 'text-[#888]'}`}
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => updateLayer(layer.id, { type: 'color' })}
                                        className={`flex-1 flex items-center justify-center py-2 rounded-sm ${layer.type === 'color' ? 'bg-[#4a4a4a] text-white' : 'text-[#888]'}`}
                                    >
                                        <Square className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => updateLayer(layer.id, { type: 'gradient' })}
                                        className={`flex-1 flex items-center justify-center py-2 rounded-sm ${layer.type === 'gradient' ? 'bg-[#4a4a4a] text-white' : 'text-[#888]'}`}
                                    >
                                        <Layers className="w-4 h-4" />
                                    </button>
                                </div>

                                {layer.type === 'image' && (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => openAssetManager(layer.id)}
                                            className="w-full py-2 bg-[#3a3a3a] border border-[#4a4a4a] rounded text-xs text-gray-300 hover:bg-[#4a4a4a] transition-colors"
                                        >
                                            {layer.imageUrl ? 'Change Image' : 'Choose Image'}
                                        </button>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-[#888] uppercase">Repeat</label>
                                                <select
                                                    value={layer.imageRepeat || 'repeat'}
                                                    onChange={e => updateLayer(layer.id, { imageRepeat: e.target.value })}
                                                    className="w-full bg-[#1e1e1e] text-xs p-1.5 rounded border border-[#3d3d3d] text-[#ddd] outline-none focus:border-[#555]"
                                                >
                                                    <option value="no-repeat">No Repeat</option>
                                                    <option value="repeat">Repeat</option>
                                                    <option value="repeat-x">Repeat X</option>
                                                    <option value="repeat-y">Repeat Y</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] text-[#888] uppercase">Position</label>
                                                <select
                                                    value={layer.imagePosition || 'left top'}
                                                    onChange={e => updateLayer(layer.id, { imagePosition: e.target.value })}
                                                    className="w-full bg-[#1e1e1e] text-xs p-1.5 rounded border border-[#3d3d3d] text-[#ddd] outline-none focus:border-[#555]"
                                                >
                                                    <option value="left top">Left Top</option>
                                                    <option value="left center">Left Center</option>
                                                    <option value="left bottom">Left Bottom</option>
                                                    <option value="right top">Right Top</option>
                                                    <option value="right center">Right Center</option>
                                                    <option value="right bottom">Right Bottom</option>
                                                    <option value="center top">Center Top</option>
                                                    <option value="center center">Center Center</option>
                                                    <option value="center bottom">Center Bottom</option>
                                                    <option value="custom">Custom</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] text-[#888] uppercase">Attachment</label>
                                                <select
                                                    value={layer.imageAttachment || 'scroll'}
                                                    onChange={e => updateLayer(layer.id, { imageAttachment: e.target.value })}
                                                    className="w-full bg-[#1e1e1e] text-xs p-1.5 rounded border border-[#3d3d3d] text-[#ddd] outline-none focus:border-[#555]"
                                                >
                                                    <option value="scroll">Scroll</option>
                                                    <option value="fixed">Fixed</option>
                                                    <option value="local">Local</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] text-[#888] uppercase">Size</label>
                                                <select
                                                    value={layer.imageSize || 'auto'}
                                                    onChange={e => updateLayer(layer.id, { imageSize: e.target.value })}
                                                    className="w-full bg-[#1e1e1e] text-xs p-1.5 rounded border border-[#3d3d3d] text-[#ddd] outline-none focus:border-[#555]"
                                                >
                                                    <option value="auto">Auto</option>
                                                    <option value="cover">Cover</option>
                                                    <option value="contain">Contain</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {layer.type === 'color' && (
                                    <div className="space-y-3">
                                        <HexColorPicker
                                            color={layer.color}
                                            onChange={color => updateLayer(layer.id, { color })}
                                            style={{ width: '100%', height: '120px' }}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={layer.color}
                                                onChange={e => updateLayer(layer.id, { color: e.target.value })}
                                                className="flex-1 bg-[#1e1e1e] text-xs p-1.5 rounded border border-[#3d3d3d] text-white"
                                            />
                                            <button
                                                onClick={() => openEyeDropper(layer.id)}
                                                className="p-1.5 bg-[#333] border border-[#3d3d3d] rounded text-[#bbb] hover:text-white"
                                                title="Pick Color"
                                            >
                                                <Pipette size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {layer.type === 'gradient' && (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input type="color" value={layer.gradientColor1} onChange={e => updateLayer(layer.id, { gradientColor1: e.target.value })} />
                                            <input type="color" value={layer.gradientColor2} onChange={e => updateLayer(layer.id, { gradientColor2: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BackgroundLayers
