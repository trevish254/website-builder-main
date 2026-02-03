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
    const [showFilters, setShowFilters] = useState(true)
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
            <div className="flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-4 p-4 pb-0 pt-0 -mt-4">
                    <h1 className="text-4xl font-bold">Inventory</h1>

                    <div className="flex items-center justify-between w-full h-[3rem]">
                        <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
                            <button
                                onClick={() => handleStatusChange('all')}
                                className={cn("px-4 py-1 text-sm font-medium rounded-md transition-all", currentStatus === 'all' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleStatusChange('active')}
                                className={cn("px-4 py-1 text-sm font-medium rounded-md transition-all", currentStatus === 'active' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => handleStatusChange('non-active')}
                                className={cn("px-4 py-1 text-sm font-medium rounded-md transition-all", currentStatus === 'non-active' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                Non Active
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <InventoryControls subAccountId={subAccountId} />
                            <CreateProductButton subaccountId={subAccountId} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 p-4 pt-0 relative flex-1">
                    {/* Sidebar Filters */}
                    <aside className="hidden md:block w-[280px] flex-shrink-0 pt-0 animate-in slide-in-from-left-4 duration-300">
                        <div className="sticky top-[80px] h-[calc(100vh-100px)]">
                            <InventoryFilter
                                subAccountId={subAccountId}
                                attributes={attributes}
                                existingBrands={existingBrands}
                                existingCategories={existingCategories}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 pt-0 transition-all duration-300">
                        {products && products.length > 0 ? (
                            <>
                                {view === 'grid' ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mb-8">
                                        <ProductList products={products} subAccountId={subAccountId} />
                                    </div>
                                )}

                                <Pagination className="justify-center mt-auto">
                                    <PaginationContent>
                                        {page > 1 && (
                                            <PaginationPrevious href={`?page=${page - 1}&${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`} />
                                        )}
                                        <PaginationItem>
                                            <span className="px-4 text-sm text-muted-foreground">
                                                Page {page} of {totalPages}
                                            </span>
                                        </PaginationItem>
                                        {page < totalPages && (
                                            <PaginationNext href={`?page=${page + 1}&${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`} />
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-20 border-[1px] border-dashed rounded-lg bg-card text-center h-full">
                                <Package size={40} className="text-muted-foreground mb-4" />
                                <h2 className="text-xl font-bold">No Products Found</h2>
                                <p className="text-muted-foreground mb-6">
                                    Try adjusting your filters or search query.
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
