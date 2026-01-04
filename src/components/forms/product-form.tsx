'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { useForm, useFieldArray } from 'react-hook-form' // Updated import
import { Product } from '@/lib/database.types'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { ProductFormSchema } from '@/lib/types'
import {
    saveActivityLogsNotification,
    upsertProduct,
} from '@/lib/queries'
import { toast } from '../ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUpload from '../global/file-upload'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Plus, Trash, X } from 'lucide-react'
import RichTextEditor from '../global/rich-text-editor'
import CustomColorPicker from '../global/custom-color-picker'

interface ProductFormProps {
    defaultData?: Product
    subAccountId: string
}

const ProductForm: React.FC<ProductFormProps> = ({
    defaultData,
    subAccountId,
}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof ProductFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            description: defaultData?.description || '',
            price: defaultData?.price ? String(defaultData.price) : '0',
            type: (defaultData?.type as 'PRODUCT' | 'SERVICE') || 'PRODUCT',
            images: defaultData?.images || [],
            active: defaultData?.active ?? true,
            brand: defaultData?.brand || '',
            category: defaultData?.category || '',
            colors: defaultData?.colors || [],
            // @ts-ignore
            stockQuantity: defaultData?.stockQuantity ?? 0,
            // @ts-ignore
            minOrder: defaultData?.minOrder ?? 1,
            // @ts-ignore
            maxOrder: defaultData?.maxOrder ?? undefined,
            // @ts-ignore
            lowStockThreshold: defaultData?.lowStockThreshold ?? 5,
            // @ts-ignore
            customAttributes: defaultData?.customAttributes || [],
            shippingDelivery: defaultData?.shippingDelivery || '',
            shippingInternational: defaultData?.shippingInternational || '',
            shippingArrival: defaultData?.shippingArrival || '',
            paymentTaxInfo: defaultData?.paymentTaxInfo || '',
            paymentTerms: defaultData?.paymentTerms || '',
        },
    })

    // Custom Attributes Field Array
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "customAttributes"
    });

    useEffect(() => {
        if (defaultData) {
            form.reset({
                name: defaultData.name || '',
                description: defaultData.description || '',
                price: String(defaultData.price) || '0',
                type: (defaultData.type as 'PRODUCT' | 'SERVICE') || 'PRODUCT',
                images: defaultData.images || [],
                active: defaultData.active ?? true,
                brand: defaultData?.brand || '',
                category: defaultData?.category || '',
                colors: defaultData?.colors || [],
                // @ts-ignore
                stockQuantity: defaultData?.stockQuantity ?? 0,
                // @ts-ignore
                minOrder: defaultData?.minOrder ?? 1,
                // @ts-ignore
                maxOrder: defaultData?.maxOrder ?? undefined,
                // @ts-ignore
                lowStockThreshold: defaultData?.lowStockThreshold ?? 5,
                // @ts-ignore
                customAttributes: defaultData?.customAttributes || [],
                shippingDelivery: defaultData?.shippingDelivery || '',
                shippingInternational: defaultData?.shippingInternational || '',
                shippingArrival: defaultData?.shippingArrival || '',
                paymentTaxInfo: defaultData?.paymentTaxInfo || '',
                paymentTerms: defaultData?.paymentTerms || '',
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
        // Fallback: react-hook-form resolver seems to be returning empty values despite validation passing.
        // We use getValues() to ensure we get the actual input state.
        const formData = form.getValues()
        // console.log('🚀 ProductForm onSubmit values (arg):', values)
        // console.log('🚀 ProductForm getValues() (manual):', formData)

        if (!subAccountId) return

        try {
            const response = await upsertProduct({
                ...formData,
                id: defaultData?.id,
                subAccountId: subAccountId,
                price: parseFloat(formData.price),
                // Ensure customAttributes are passed
                customAttributes: formData.customAttributes,
            })

            if (!response) {
                throw new Error('Failed to save product. Check server logs.')
            }

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `${defaultData ? 'Updated' : 'Created'} a product | ${response?.name}`,
                subaccountId: subAccountId,
            })

            toast({
                title: 'Success',
                description: 'Saved product details',
            })

            setClose()
            router.refresh()
        } catch (error) {
            console.error('❌ Error saving product:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save product details',
            })
        }
    }

    return (
        <Card className="w-full border-0 shadow-none p-0">
            {/* <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                    {defaultData
                        ? 'Update your product or service information.'
                        : 'Create a new product or service for your inventory.'}
                </CardDescription>
            </CardHeader> */}
            <CardContent className="p-0">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Left Column: Essential Info */}
                            <div className="space-y-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Winter Jacket"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <RichTextEditor
                                                    placeholder="Product details..."
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (KES)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Clothing">Clothing</SelectItem>
                                                        <SelectItem value="Shoes">Shoes</SelectItem>
                                                        <SelectItem value="Bags">Bags</SelectItem>
                                                        <SelectItem value="Accessories">Accessories</SelectItem>
                                                        <SelectItem value="Jewelry">Jewelry</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="brand"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Nike"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PRODUCT">Physical Product</SelectItem>
                                                        <SelectItem value="SERVICE">Service</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Images</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    apiEndpoint="productImage"
                                                    onChange={(urls) => field.onChange(urls)}
                                                    value={field.value}
                                                    multiple
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Right Column: Inventory & Settings */}
                            <div className="space-y-6">
                                <div className="p-4 border rounded-lg bg-muted/40 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm text-foreground">Inventory Management</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            disabled={isLoading}
                                            control={form.control}
                                            name="stockQuantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>In Stock</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            disabled={isLoading}
                                            control={form.control}
                                            name="lowStockThreshold"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Low Stock Alert</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="5"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            disabled={isLoading}
                                            control={form.control}
                                            name="minOrder"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Min. Order</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="1"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            disabled={isLoading}
                                            control={form.control}
                                            name="maxOrder"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max. Order</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="∞"
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm text-foreground">Available Colors</h3>
                                        <CustomColorPicker
                                            color="#000000"
                                            onChange={(newColor) => {
                                                const currentColors = form.getValues('colors') || []
                                                if (!currentColors.includes(newColor)) {
                                                    form.setValue('colors', [...currentColors, newColor])
                                                }
                                            }}
                                        >
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1"
                                            >
                                                <Plus size={14} /> Add Color
                                            </Button>
                                        </CustomColorPicker>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="colors"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg border bg-muted/20">
                                                        {field.value?.map((color, index) => (
                                                            <div
                                                                key={index}
                                                                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border bg-background shadow-sm transition-all hover:pr-8"
                                                                style={{ borderColor: `${color}40` }}
                                                            >
                                                                <div
                                                                    className="h-3 w-3 rounded-full border border-black/10"
                                                                    style={{ backgroundColor: color }}
                                                                />
                                                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">{color}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = field.value?.filter((_, i) => i !== index)
                                                                        field.onChange(updated)
                                                                    }}
                                                                    className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {(!field.value || field.value.length === 0) && (
                                                            <span className="text-xs text-muted-foreground m-auto">No colors selected</span>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Custom Attributes Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm text-foreground">Custom Attributes</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ key: '', value: '' })}
                                            className="h-8 gap-1"
                                        >
                                            <Plus size={14} /> Add Attribute
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 items-start">
                                                <FormField
                                                    control={form.control}
                                                    name={`customAttributes.${index}.key`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="Name (e.g. Material)" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`customAttributes.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-[2]">
                                                            <FormControl>
                                                                <Input placeholder="Value (e.g. Cotton)" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                        {fields.length === 0 && (
                                            <div className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg text-center border border-dashed">
                                                No custom attributes added. Add details like material, care instructions, etc.
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/40">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Active Status</FormLabel>
                                                <FormDescription>
                                                    Visible in store
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="p-4 border rounded-lg bg-muted/40 space-y-4">
                                    <h3 className="font-semibold text-sm">Shipping Information</h3>
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="shippingDelivery"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Domestic Delivery</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 3-5 business days" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="shippingInternational"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>International Shipping</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 10-15 business days" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="shippingArrival"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Arrival Estimate</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Calculated at checkout" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="p-4 border rounded-lg bg-muted/40 space-y-4">
                                    <h3 className="font-semibold text-sm">Payment Information</h3>
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="paymentTaxInfo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Information</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Inclusive of VAT" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        disabled={isLoading}
                                        control={form.control}
                                        name="paymentTerms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Terms</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Payment terms and conditions..." {...field} className="h-20" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4"
                            disabled={isLoading}
                            type="submit"
                        >
                            {isLoading ? <Loading /> : 'Save Product'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ProductForm
