'use client'
import React, { useState, useMemo } from 'react'
import { Product, ProductVariant } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
    Star,
    ChevronLeft,
    Truck,
    Package,
    CheckCircle2,
    Box,
    Tag,
    Layers,
    Store,
    CreditCard,
    Plus,
    Minus,
    ShoppingCart,
    ShieldCheck,
    ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProductWithVariants extends Product {
    ProductVariant: ProductVariant[]
}

interface ProductCheckoutViewProps {
    product: ProductWithVariants
}

const ProductCheckoutView: React.FC<ProductCheckoutViewProps> = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '')
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    // Payment toggles
    const [paystackEnabled, setPaystackEnabled] = useState(true)
    const [mpesaEnabled, setMpesaEnabled] = useState(false)

    const router = useRouter()

    const price = Number(product.price)
    const tax = price * 0.16 // Sample 16% VAT
    const totalAmount = (price * quantity) + tax

    // Extract unique colors and sizes from variants
    const colors = useMemo(() => {
        const uniqueColors = new Set<string>()
        product.ProductVariant?.forEach(v => {
            if (v.name.toLowerCase() === 'color' && v.value) uniqueColors.add(v.value)
        })
        product.colors?.forEach(c => uniqueColors.add(c))
        return Array.from(uniqueColors)
    }, [product])

    const sizes = useMemo(() => {
        const uniqueSizes = new Set<string>()
        product.ProductVariant?.forEach(v => {
            if (v.name.toLowerCase() === 'size' && v.value) uniqueSizes.add(v.value)
        })
        return Array.from(uniqueSizes)
    }, [product])

    const specifications = useMemo(() => {
        const specs: { label: string; value: string | null; icon?: React.ReactNode }[] = [
            { label: 'SKU', value: product.id.slice(0, 8).toUpperCase(), icon: <Tag className="h-4 w-4" /> },
            { label: 'Type', value: product.type || 'PRODUCT', icon: <Box className="h-4 w-4" /> },
            { label: 'Brand', value: product.brand || '-', icon: <Layers className="h-4 w-4" /> },
            { label: 'Category', value: product.category || '-', icon: <Tag className="h-4 w-4" /> },
        ]

        if (product.customAttributes && Array.isArray(product.customAttributes)) {
            product.customAttributes.forEach((attr: any) => {
                if (attr.key && attr.value) {
                    specs.push({ label: attr.key, value: String(attr.value) })
                }
            })
        }

        return specs
    }, [product])

    return (
        <div className="flex flex-col gap-8 pb-20 w-full bg-background scroll-smooth animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 px-6 border-b border-border/40">
                <Button
                    variant="ghost"
                    onClick={() => window.close()}
                    className="flex items-center gap-2 group hover:bg-muted/50 rounded-full px-4"
                >
                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span className="font-semibold text-sm">Close Preview</span>
                </Button>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Checkout Total</span>
                        <span className="text-lg font-black text-primary leading-tight">KES {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center ring-2 ring-background">
                            {quantity}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 max-w-full">
                {/* 1st Column: Media (span 3) */}
                <div className="lg:col-span-3 space-y-6 max-w-[280px] w-full mx-auto lg:mx-0">
                    <div className="space-y-4">
                        <div className="relative aspect-[1/1] rounded-[24px] overflow-hidden border border-border/50 shadow-sm bg-muted/20">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 transition-all duration-700"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                                    <Package className="h-10 w-10 opacity-20" />
                                    <span className="text-[10px] uppercase tracking-widest font-semibold opacity-50">No Image</span>
                                </div>
                            )}
                        </div>

                        <ScrollArea className="w-full whitespace-nowrap rounded-md border-none">
                            <div className="flex gap-2 pb-2">
                                {(product.images?.length ? product.images : [selectedImage]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => img && setSelectedImage(img)}
                                        className={cn(
                                            "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-muted/10",
                                            selectedImage === img
                                                ? "border-primary shadow-sm"
                                                : "border-transparent ring-1 ring-border/30 opacity-80"
                                        )}
                                    >
                                        {img ? (
                                            <Image
                                                src={img}
                                                alt={`${product.name} thumb ${idx + 1}`}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-4 w-4 opacity-10" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <Card className="rounded-[24px] border-border/50 shadow-sm bg-card overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                    <Store className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-[12px] truncate">Stylish Store</h3>
                                        <CheckCircle2 className="h-2.5 w-2.5 text-blue-500 shrink-0 fill-current" />
                                    </div>
                                    <div className="flex items-center text-yellow-500 text-[10px] font-bold gap-0.5">
                                        <Star className="h-2.5 w-2.5 fill-current" />
                                        <span className="text-foreground">(4.8)</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2nd Column: Details (span 6) */}
                <div className="lg:col-span-6 flex flex-col gap-8 md:pt-2">
                    <div className="space-y-4">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-md w-fit flex items-center gap-2">
                            <ShoppingCart className="h-3 w-3" />
                            Checkout Preview
                        </Badge>
                        <h1 className="text-3xl font-black tracking-tight leading-tight text-foreground lowercase first-letter:uppercase">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-6">
                            <span className="text-3xl font-black text-primary uppercase">
                                KES {price.toLocaleString()}
                            </span>
                        </div>

                        {/* Traditional Add to Cart with +/- */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                            <div className="flex items-center rounded-2xl border border-border/50 bg-muted/20 p-1 w-full sm:w-auto">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-xl hover:bg-background"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus className="h-5 w-5" />
                                </Button>
                                <span className="w-12 text-center text-lg font-black">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-xl hover:bg-background"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                            <Button className="flex-1 w-full sm:w-auto h-14 rounded-2xl bg-foreground text-background font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Colors */}
                        {colors.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                "w-10 h-10 rounded-xl border-2 p-1 transition-all",
                                                selectedColor === color ? "border-primary shadow-md" : "border-border/50"
                                            )}
                                        >
                                            <div className="w-full h-full rounded-lg" style={{ backgroundColor: color }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "min-w-[48px] h-10 rounded-lg border-2 font-black transition-all text-xs",
                                                selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border/50 text-foreground"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Description</h3>
                        <div
                            className="text-sm text-muted-foreground leading-relaxed font-medium rich-text-content"
                            dangerouslySetInnerHTML={{ __html: product.description || 'No description provided.' }}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Product Specifications</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {specifications.map((spec, i) => (
                                <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-muted/5 border border-border/30">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{spec.label}</span>
                                    <span className="text-xs font-black text-foreground truncate">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment Section */}
                    {(product.shippingDelivery || product.shippingInternational || product.paymentTaxInfo || product.paymentTerms) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/40 pb-4">
                            {/* Shipping info */}
                            {(product.shippingDelivery || product.shippingInternational || product.shippingArrival) && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-primary" />
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Logistics</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {product.shippingDelivery && (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Domestic Delivery</span>
                                                <span className="text-xs font-bold">{product.shippingDelivery}</span>
                                            </div>
                                        )}
                                        {product.shippingInternational && (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">International Shipping</span>
                                                <span className="text-xs font-bold">{product.shippingInternational}</span>
                                            </div>
                                        )}
                                        {product.shippingArrival && (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Estimated Arrival</span>
                                                <span className="text-xs font-bold">{product.shippingArrival}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Checkout Details</h3>
                                </div>
                                <div className="space-y-3">
                                    {(product.paymentTaxInfo || product.paymentTerms) && (
                                        <div className="flex flex-col gap-2">
                                            {product.paymentTaxInfo && (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Tax Information</span>
                                                    <span className="text-xs font-bold">{product.paymentTaxInfo}</span>
                                                </div>
                                            )}
                                            {product.paymentTerms && (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Service Terms</span>
                                                    <span className="text-xs font-bold">{product.paymentTerms}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                        Secure transaction processing. Refund protection policy applies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3rd Column: Order Summary (span 3) */}
                <div className="lg:col-span-3">
                    <Card className="rounded-[32px] border-border/50 shadow-2xl bg-card sticky top-24 overflow-hidden overflow-y-auto max-h-[calc(100vh-120px)]">
                        <CardHeader className="p-6 border-b border-border/40 bg-muted/10">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Quantity Selector */}
                            <div className="space-y-4">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Quantity</Label>
                                <div className="flex items-center justify-between p-2 rounded-2xl border border-border/50 bg-muted/20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-xl hover:bg-background"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="text-base font-black">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-xl hover:bg-background"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Payment Options */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                        paystackEnabled ? "border-primary bg-primary/5" : "border-border/40 bg-background"
                                    )} onClick={() => { setPaystackEnabled(true); setMpesaEnabled(false) }}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-[10px]">PS</div>
                                            <span className="text-xs font-bold">Paystack Card</span>
                                        </div>
                                        <div className={cn("h-4 w-4 rounded-full border-2", paystackEnabled ? "border-primary bg-primary" : "border-border")} />
                                    </div>

                                    <div className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                        mpesaEnabled ? "border-green-500 bg-green-500/5" : "border-border/40 bg-background"
                                    )} onClick={() => { setMpesaEnabled(true); setPaystackEnabled(false) }}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-500/5 overflow-hidden flex items-center justify-center p-1 border border-green-500/10">
                                                <Image src="/icons/mpesa-phone.png" alt="M-Pesa" width={24} height={24} className="object-contain" />
                                            </div>
                                            <span className="text-xs font-bold">M-Pesa Mobile</span>
                                        </div>
                                        <div className={cn("h-4 w-4 rounded-full border-2", mpesaEnabled ? "border-green-500 bg-green-500" : "border-border")} />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border/40" />

                            {/* Calculations */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground">Subtotal ({quantity} items)</span>
                                    <span>KES {(price * quantity).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground">Estimated Tax (16%)</span>
                                    <span>KES {tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-emerald-500 uppercase tracking-tighter">Calculated at address</span>
                                </div>
                                <Separator className="bg-border/30 my-1" />
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="text-sm font-black uppercase tracking-tighter">Total Amount</span>
                                    <span className="text-2xl font-black text-primary">KES {totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 bg-muted/10">
                            <Button
                                onClick={() => router.push(`/inventory-checkout/${product.id}?qty=${quantity}&color=${selectedColor || ''}&size=${selectedSize || ''}`)}
                                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                            >
                                Proceed to Terminal
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ProductCheckoutView
