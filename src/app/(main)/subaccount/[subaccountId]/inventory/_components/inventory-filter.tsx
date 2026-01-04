'use client'
import React, { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface InventoryFilterProps {
    subAccountId: string
    attributes?: Record<string, string[]>
    existingBrands?: string[]
    existingCategories?: string[]
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({
    subAccountId,
    attributes = {},
    existingBrands = [],
    existingCategories = []
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [priceRange, setPriceRange] = useState([0, 10000])

    useEffect(() => {
        const min = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0
        const max = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 10000
        setPriceRange([min, max])
    }, [searchParams])

    const updateFilters = (key: string, value: string | number | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === null || value === '') {
            params.delete(key)
        } else {
            params.set(key, String(value))
        }
        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }

    const handleBrandChange = (brand: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        const current = params.getAll('brand')
        params.delete('brand')
        if (isChecked) {
            [...current, brand].forEach(b => params.append('brand', b))
        } else {
            current.filter(b => b !== brand).forEach(b => params.append('brand', b))
        }
        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }

    const commitPriceChange = (value: number[]) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('minPrice', String(value[0]))
        params.set('maxPrice', String(value[1]))
        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }

    // Helper for availability/active check
    const handleAvailabilityChange = (isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        if (isChecked) params.set('active', 'true')
        else params.delete('active')
        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }

    const handleAttributeChange = (key: string, value: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        const paramKey = `attr_${key}`
        const current = params.getAll(paramKey)

        params.delete(paramKey)

        if (isChecked) {
            [...current, value].forEach(v => params.append(paramKey, v))
        } else {
            current.filter(v => v !== value).forEach(v => params.append(paramKey, v))
        }

        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }


    const defaultCategories = ['Clothing', 'Shoes', 'Bags', 'Accessories', 'Jewelry']
    const defaultBrands = ['Gucci', 'Dolce & Gabbana', 'Chanel', 'Louis Vuitton', 'Versace', 'Adidas', 'Nike', 'Prada', 'Puma', 'Reebok']

    // Merge dynamic (first) and default (second), removing duplicates
    const categories = Array.from(new Set([...existingCategories, ...defaultCategories]))
    const brands = Array.from(new Set([...existingBrands, ...defaultBrands]))

    // Color mapping
    const colors = [
        { name: 'Red', hex: '#ef4444' },
        { name: 'Orange', hex: '#f97316' },
        { name: 'Yellow', hex: '#eab308' },
        { name: 'Green', hex: '#22c55e' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Purple', hex: '#a855f7' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Gray', hex: '#6b7280' },
    ]

    const selectedColors = searchParams.get('colors')?.split(',') || []

    const handleColorToggle = (colorName: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const current = params.get('colors')?.split(',').filter(Boolean) || []

        let newColors
        if (current.includes(colorName)) {
            newColors = current.filter(c => c !== colorName)
        } else {
            newColors = [...current, colorName]
        }

        if (newColors.length > 0) params.set('colors', newColors.join(','))
        else params.delete('colors')

        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }


    return (
        <div className="w-full bg-card rounded-xl border shadow-sm sticky top-4 flex flex-col max-h-[calc(100vh-2rem)]">
            <div className="p-4 border-b flex items-center justify-between bg-card/50 shrink-0">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                    onClick={() => router.push(`/subaccount/${subAccountId}/inventory`)}
                    className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                >
                    <X size={14} /> Clear all
                </button>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto">
                {/* Type / Category */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground/80">Category</h4>
                        <X className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
                    </div>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div key={cat} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cat-${cat}`}
                                    checked={searchParams.get('category') === cat}
                                    onCheckedChange={(checked) => updateFilters('category', checked ? cat : null)}
                                    className="rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground/30"
                                />
                                <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer text-muted-foreground peer-data-[state=checked]:text-foreground hover:text-foreground transition-colors">
                                    {cat}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-[1px] bg-border/50" />

                {/* Brands */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground/80">Brands</h4>
                        <X className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
                    </div>

                    <ScrollArea className="h-[180px] w-full pr-3">
                        <div className="space-y-2">
                            {brands.map((brand) => {
                                const isChecked = searchParams.getAll('brand').includes(brand)
                                return (
                                    <div key={brand} className="flex items-center space-x-2 group">
                                        <Checkbox
                                            id={`brand-${brand}`}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                                            className="rounded-md border-muted-foreground/30"
                                        />
                                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer text-muted-foreground group-hover:text-foreground transition-colors flex-1 flex justify-between">
                                            <span>{brand}</span>
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </div>

                <div className="h-[1px] bg-border/50" />

                {/* Price */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground/80">Price</h4>
                        <X className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">KES</span>
                            <Input
                                type="number"
                                className="pl-9 h-9 text-sm"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                onBlur={() => commitPriceChange(priceRange)}
                            />
                        </div>
                        <span className="text-xs text-muted-foreground">To</span>
                        <div className="relative flex-1">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">KES</span>
                            <Input
                                type="number"
                                className="pl-9 h-9 text-sm"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                onBlur={() => commitPriceChange(priceRange)}
                            />
                        </div>
                    </div>
                    <Slider
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        onValueCommit={commitPriceChange}
                        className="mt-2"
                    />
                </div>

                <div className="h-[1px] bg-border/50" />

                {/* Colors */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground/80">Colors Options</h4>
                        <X className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                            const isSelected = selectedColors.includes(color.name)
                            return (
                                <div
                                    key={color.name}
                                    onClick={() => handleColorToggle(color.name)}
                                    title={color.name}
                                    className={cn(
                                        "h-8 w-8 rounded-full cursor-pointer transition-all border border-border shadow-sm flex items-center justify-center",
                                        isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {color.name === 'White' && !isSelected && <div className="text-[8px] text-gray-400"></div>}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="h-[1px] bg-border/50" />

                {/* Availability */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground/80">Availability</h4>
                        <X className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="stock"
                            checked={searchParams.get('active') === 'true'}
                            onCheckedChange={(c) => handleAvailabilityChange(!!c)}
                            className="rounded-md data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="stock" className="text-sm font-normal cursor-pointer">In Stock</Label>
                    </div>
                </div>

                {/* Dynamic Attributes */}
                {Object.entries(attributes).map(([key, values]) => (
                    <div key={key} className="space-y-3">
                        <div className="h-[1px] bg-border/50" />
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-foreground/80">{key}</h4>
                            <X className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-foreground" />
                        </div>
                        <div className="space-y-2">
                            {values.map((val) => (
                                <div key={val} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`attr-${key}-${val}`}
                                        checked={searchParams.getAll(`attr_${key}`).includes(val)}
                                        onCheckedChange={(checked) => handleAttributeChange(key, val, !!checked)}
                                        className="rounded-md border-muted-foreground/30"
                                    />
                                    <Label htmlFor={`attr-${key}-${val}`} className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                        {val}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default InventoryFilter
