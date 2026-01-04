'use client'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Product, ProductVariant } from '@/lib/database.types'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import ProductForm from '../forms/product-form'
import { deleteProduct } from '@/lib/queries'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProductListProps {
    products: (Product & { ProductVariant: ProductVariant[] })[]
    subAccountId: string
}

const ProductList: React.FC<ProductListProps> = ({ products, subAccountId }) => {
    const { setOpen } = useModal()
    const router = useRouter()

    const handleEditProduct = (product: Product) => {
        setOpen(
            <CustomModal
                title="Edit Product Details"
                subheading="Update your inventory and Paystack sync."
            >
                <ProductForm
                    subAccountId={subAccountId}
                    defaultData={product}
                />
            </CustomModal>
        )
    }

    const handleDeleteProduct = async (productId: string) => {
        try {
            const success = await deleteProduct(productId, subAccountId)
            if (success) {
                toast({
                    title: 'Success',
                    description: 'Product deactivated',
                })
                router.refresh()
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to deactivate product',
            })
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount)
    }

    return (
        <Table className="bg-card border-[1px] border-border rounded-md mt-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id} className={!product.active ? 'opacity-50' : ''}>
                        <TableCell>
                            <div className="relative w-12 h-12">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                                        <span className="text-[10px] text-muted-foreground">No Img</span>
                                    </div>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="font-bold">{product.name}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{product.type}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                            {product.active ? (
                                <Badge className="bg-emerald-600">Active</Badge>
                            ) : (
                                <Badge variant="destructive">Inactive</Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Archive
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ProductList
