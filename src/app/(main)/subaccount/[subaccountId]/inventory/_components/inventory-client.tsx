'use client'
import React, { useState } from 'react'
import CreateProductButton from './create-product-btn'
import ProductList from '@/components/inventory/product-list'
import { Package, Filter } from 'lucide-react'
import InventoryFilter from './inventory-filter'
import InventoryControls from './inventory-controls'
import ProductCard from './product-card'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BlurPage from '@/components/global/blur-page'
import { useRouter } from 'next/navigation'

interface InventoryClientProps {
    subAccountId: string
    products: any[]
    count: number | null
    attributes: Record<string, string[]>
    existingBrands: string[]
    existingCategories: string[]
    totalPages: number
    page: number
    view: string
    searchParams: any
}

const InventoryClient: React.FC<InventoryClientProps> = ({
    subAccountId,
    products,
    count,
    attributes,
    existingBrands,
    existingCategories,
    totalPages,
    page,
    view,
    searchParams,
}) => {
    const router = useRouter()

    const handleStatusChange = (status: 'all' | 'active' | 'non-active') => {
        const params = new URLSearchParams(searchParams)
        if (status === 'all') params.delete('active')
        if (status === 'active') params.set('active', 'true')
        if (status === 'non-active') params.set('active', 'false')
        params.set('page', '1')
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }

    const currentStatus = searchParams.active === 'true' ? 'active' : searchParams.active === 'false' ? 'non-active' : 'all'

    return (
        <BlurPage>
            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-col gap-4 p-4 pb-0 pt-0 -mt-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">Inventory</h1>

                    <div className="flex flex-wrap items-center justify-between w-full gap-4">
                        <div className="flex items-center bg-muted/30 p-1.5 rounded-xl border border-border/50 backdrop-blur-md">
                            <button
                                onClick={() => handleStatusChange('all')}
                                className={cn("px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all", currentStatus === 'all' ? "bg-background shadow-md text-foreground border border-border" : "text-muted-foreground hover:text-foreground")}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleStatusChange('active')}
                                className={cn("px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all", currentStatus === 'active' ? "bg-background shadow-md text-foreground border border-border" : "text-muted-foreground hover:text-foreground")}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => handleStatusChange('non-active')}
                                className={cn("px-5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all", currentStatus === 'non-active' ? "bg-background shadow-md text-foreground border border-border" : "text-muted-foreground hover:text-foreground")}
                            >
                                Non Active
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <InventoryControls subAccountId={subAccountId} />
                            <CreateProductButton subaccountId={subAccountId} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-start gap-8 p-6 pt-0 relative w-full h-full min-h-0">
                    {/* Sidebar Filters - Forced Visibility */}
                    <aside className="w-[300px] flex-shrink-0 sticky top-20 self-start z-20">
                        <div className="h-[calc(100vh-140px)] w-full">
                            <InventoryFilter
                                subAccountId={subAccountId}
                                attributes={attributes}
                                existingBrands={existingBrands}
                                existingCategories={existingCategories}
                            />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0 flex flex-col pt-0">
                        {products && products.length > 0 ? (
                            <>
                                <div className="mb-6">
                                    {view === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {products.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <ProductList products={products} subAccountId={subAccountId} />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto py-4">
                                    <Pagination className="justify-center">
                                        <PaginationContent>
                                            {page > 1 && (
                                                <PaginationPrevious href={`?page=${page - 1}&${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`} />
                                            )}
                                            <PaginationItem>
                                                <span className="px-6 py-2 bg-muted/40 rounded-full text-xs font-bold uppercase tracking-widest border border-border/50">
                                                    Page {page} of {totalPages}
                                                </span>
                                            </PaginationItem>
                                            {page < totalPages && (
                                                <PaginationNext href={`?page=${page + 1}&${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`} />
                                            )}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border/50 rounded-3xl bg-muted/20 text-center h-full">
                                <Package size={48} className="text-muted-foreground/50 mb-4" />
                                <h2 className="text-2xl font-bold tracking-tight">No Products Found</h2>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                    Your search didn't match any products. Try refining your filters or search terms.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BlurPage>
    )
}

export default InventoryClient
