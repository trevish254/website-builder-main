'use client'
import React, { useState, useMemo } from 'react'
import { Product, ProductVariant } from '@/lib/database.types'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Star,
    ChevronLeft,
    Edit,
    Truck,
    Package,
    CheckCircle2,
    MapPin,
    Box,
    Tag,
    Layers,
    Info,
    Store,
    ExternalLink,
    CreditCard,
    Settings2,
    Lock,
    Bell,
    Share2,
    Copy,
    Percent,
    Wallet,
    Phone,
    Users,
    MessageSquare,
    Eye,
    Globe,
    Archive,
    Trash,
    MoreVertical,
    Power,
    Send
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import CustomModal from '@/components/global/custom-modal'
import ProductForm from '@/components/forms/product-form'
import { useModal } from '@/providers/modal-provider'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { upsertProduct, deleteProduct } from '@/lib/queries'
import { toast } from '@/components/ui/use-toast'

interface ProductWithVariants extends Product {
    ProductVariant: ProductVariant[]
}

interface ProductDetailViewProps {
    product: ProductWithVariants
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '')
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    // Advanced Settings State (Mock)
    const [paystackEnabled, setPaystackEnabled] = useState(true)
    const [mpesaEnabled, setMpesaEnabled] = useState(true)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [teamAccess, setTeamAccess] = useState('All Members')
    const [isActive, setIsActive] = useState(product.active)
    const [isDeleting, setIsDeleting] = useState(false)

    const router = useRouter()
    const { setOpen } = useModal()

    const handleEdit = () => {
        setOpen(
            <CustomModal
                title="Edit Product"
                subheading="Update your product details and settings"
                className="max-w-[1100px] w-[90vw] md:max-h-[90vh]"
            >
                <ProductForm
                    subAccountId={product.subAccountId}
                    defaultData={product}
                />
            </CustomModal>
        )
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied!",
            description: "Product URL copied to clipboard.",
        })
    }

    const handleToggleActive = async () => {
        const newState = !isActive
        setIsActive(newState)
        try {
            await upsertProduct({
                ...product,
                active: newState
            })
            toast({
                title: newState ? "Product Activated" : "Product Deactivated",
                description: `Product is now ${newState ? 'visible' : 'hidden'} to customers.`,
            })
        } catch (error) {
            setIsActive(!newState)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update product status.",
            })
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const success = await deleteProduct(product.id, product.subAccountId)
            if (success) {
                toast({
                    title: "Product Deleted",
                    description: "Product has been successfully archived/deleted.",
                })
                router.push(`/subaccount/${product.subAccountId}/inventory`)
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Failed to delete product.",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const handlePublish = () => {
        toast({
            title: "Publishing...",
            description: "Syncing product details with your store and channels.",
        })
        // Add actual publish logic here
    }

    const handlePreview = () => {
        // Open the specialized checkout preview page in a new tab
        window.open(`/inventory-preview/${product.id}`, '_blank')
    }

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

    const isLowStock = product.stockQuantity !== null && product.lowStockThreshold !== null && product.stockQuantity <= product.lowStockThreshold
    const isOutOfStock = product.stockQuantity === 0

    // Consolidate all attributes for the specifications grid
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
        <div className="flex flex-col gap-8 pb-20 w-full bg-background/50 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 px-6 border-b border-border/40">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 group hover:bg-muted/50 rounded-full px-4"
                    >
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-semibold text-sm">Inventory</span>
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                            isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-muted border-border text-muted-foreground"
                        )}>
                            <Power className={cn("h-3 w-3", isActive && "fill-current animate-pulse")} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{isActive ? 'Live' : 'Draft'}</span>
                            <Switch
                                checked={isActive}
                                onCheckedChange={handleToggleActive}
                                className="scale-75 data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePreview}
                        className="rounded-xl font-bold text-xs h-10 px-4 flex items-center gap-2 hover:bg-muted/50"
                    >
                        <Eye className="h-4 w-4" />
                        Preview
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handlePublish}
                        className="rounded-xl font-bold text-xs h-10 px-4 flex items-center gap-2 hover:bg-muted/50 border-primary/20 text-primary hover:text-primary hover:bg-primary/5"
                    >
                        <Send className="h-4 w-4" />
                        Publish
                    </Button>

                    <Button onClick={handleEdit} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md rounded-xl px-4 h-10 flex items-center gap-2 font-bold text-xs">
                        <Edit className="h-4 w-4" />
                        Edit Product
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-border/50">
                            <DropdownMenuItem className="rounded-xl p-3 flex items-center gap-3 cursor-pointer">
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold">Export Details</span>
                                    <span className="text-[10px] text-muted-foreground">Download as CSV/JSON</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl p-3 flex items-center gap-3 cursor-pointer">
                                <Archive className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold">Archive Product</span>
                                    <span className="text-[10px] text-muted-foreground">Hide from store lists</span>
                                </div>
                            </DropdownMenuItem>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="rounded-xl p-3 flex items-center gap-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                                    >
                                        <Trash className="h-4 w-4" />
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold">Delete Product</span>
                                            <span className="text-[10px] opacity-70">Permanent removal</span>
                                        </div>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-[32px] border-border/50 shadow-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl font-black">Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm font-medium">
                                            This action cannot be undone. This will permanently delete the product
                                            <strong> "{product.name}"</strong> and all its associated data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-bold"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete Product'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 max-w-full h-auto">
                {/* 1st Column: Media (span 3) */}
                <div className="lg:col-span-3 space-y-6 max-w-[280px] w-full mx-auto lg:mx-0">
                    <div className="space-y-4">
                        <div className="relative aspect-[1/1] rounded-[24px] overflow-hidden border border-border/50 shadow-sm bg-muted/20 group">
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
                            <Button variant="outline" size="sm" className="w-full rounded-lg border-border hover:bg-muted text-foreground font-bold h-8 text-[10px]">
                                View Profile
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* 2nd Column: Details (span 6) */}
                <div className="lg:col-span-6 flex flex-col gap-8 md:pt-2">
                    <div className="space-y-4">
                        <Badge className="bg-muted text-muted-foreground hover:bg-muted font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-md w-fit">INVENTORY</Badge>
                        <h1 className="text-3xl font-black tracking-tight leading-tight text-foreground lowercase first-letter:uppercase">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-6">
                            <span className="text-3xl font-black text-primary">
                                KES {Number(product.price).toLocaleString()}
                            </span>
                            {isOutOfStock ? (
                                <Badge variant="destructive" className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase">Out of Stock</Badge>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase">{product.stockQuantity ?? 0} In Stock</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Colors */}
                        {colors.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Available Colors</h3>
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
                                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Available Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "min-w-[48px] h-10 rounded-lg border-2 font-black transition-all text-xs",
                                                selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border/50"
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
                            dangerouslySetInnerHTML={{ __html: product.description || 'No description provided for this product.' }}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/40">
                            {/* Shipping info */}
                            {(product.shippingDelivery || product.shippingInternational || product.shippingArrival) && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-primary" />
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Shipping Logistics</h3>
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

                            {/* Payment info */}
                            {(product.paymentTaxInfo || product.paymentTerms) && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payment & Terms</h3>
                                    </div>
                                    <div className="space-y-3">
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
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3rd Column: Advanced Settings (span 3) */}
                <div className="lg:col-span-3">
                    <Card className="rounded-[24px] border-border/50 shadow-lg bg-card/50 backdrop-blur-sm sticky top-24 overflow-hidden">
                        <CardHeader className="p-5 border-b border-border/40 bg-muted/10">
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-black uppercase tracking-tight">Advanced Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <ScrollArea className="h-[calc(100vh-320px)] p-0">
                            <div className="p-5 space-y-8">
                                {/* Payment Config */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Configuration</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/40">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="h-8 w-8 rounded-lg p-0 flex items-center justify-center bg-blue-500/5 text-blue-500 border-blue-500/20">
                                                    <span className="text-[10px] font-black">PS</span>
                                                </Badge>
                                                <Label className="text-xs font-bold">Paystack</Label>
                                            </div>
                                            <Switch checked={paystackEnabled} onCheckedChange={setPaystackEnabled} />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/40">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="h-8 w-8 rounded-lg p-0 flex items-center justify-center bg-green-500/5 text-green-500 border-green-500/20">
                                                    <span className="text-[10px] font-black">MP</span>
                                                </Badge>
                                                <Label className="text-xs font-bold">M-Pesa</Label>
                                            </div>
                                            <Switch checked={mpesaEnabled} onCheckedChange={setMpesaEnabled} />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                {/* Marketing */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Marketing & Growth</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-xl bg-background border border-border/40 space-y-2">
                                            <Label className="text-[9px] font-bold text-muted-foreground uppercase">Shareable Product URL</Label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-8 rounded-lg bg-muted/30 border border-border/30 px-2 flex items-center overflow-hidden">
                                                    <span className="text-[10px] text-muted-foreground truncate">plura.com/shop/{product.id.slice(0, 8)}</span>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => copyToClipboard(`https://plura.com/shop/${product.id}`)}>
                                                    <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full justify-between rounded-xl h-10 px-4 group">
                                            <div className="flex items-center gap-2">
                                                <Percent className="h-3.5 w-3.5 text-orange-500" />
                                                <span className="text-xs font-bold">Discount Codes</span>
                                            </div>
                                            <Badge className="bg-orange-500/10 text-orange-500 border-none px-1.5 py-0 text-[10px] font-black">3 ACTIVE</Badge>
                                        </Button>
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                {/* Notifications */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Workflow & Alerts</h4>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/40">
                                        <div className="space-y-0.5">
                                            <Label className="text-xs font-bold">Sales Notifications</Label>
                                            <p className="text-[9px] text-muted-foreground">Email alert on every checkout</p>
                                        </div>
                                        <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                {/* Team Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team & Access</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-xl bg-background border border-border/40 space-y-2">
                                            <Label className="text-[9px] font-bold text-muted-foreground uppercase">Visibility Control</Label>
                                            <select
                                                className="w-full h-8 rounded-lg bg-muted/30 border border-border/30 px-2 text-[11px] font-bold outline-none cursor-pointer"
                                                value={teamAccess}
                                                onChange={(e) => setTeamAccess(e.target.value)}
                                            >
                                                <option>All Members</option>
                                                <option>Admins Only</option>
                                                <option>Inventory Team</option>
                                                <option>Private</option>
                                            </select>
                                        </div>
                                        <Button variant="ghost" className="w-full justify-start gap-2 h-9 rounded-xl hover:bg-muted/50 px-3">
                                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-[11px] font-bold">Product Permissions</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* After Sales */}
                                <div className="space-y-4 pb-4">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">After Sales Support</h4>
                                    </div>
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                                            "Enable custom automated follow-up messages for customers who purchase this product."
                                        </p>
                                        <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase text-primary">Configure Automation</Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailView
