import { getProducts, getDistinctCustomAttributes, getDistinctBrands, getDistinctCategories } from '@/lib/queries'
import React from 'react'
import InventoryClient from './_components/inventory-client'

const InventoryPage = async ({
    params,
    searchParams,
}: {
    params: { subaccountId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const page = Number(searchParams.page) || 1
    const limit = 12
    const view = (searchParams.view as string) || 'grid'

    const filters = {
        query: searchParams.query as string,
        brand: searchParams.brand
            ? Array.isArray(searchParams.brand)
                ? searchParams.brand
                : [searchParams.brand]
            : undefined,
        category: searchParams.category as string,
        colors: searchParams.colors ? (searchParams.colors as string).split(',') : undefined,
        active: searchParams.active ? searchParams.active === 'true' : undefined,
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        page,
        limit,
    }

    const { data: products, count } = await getProducts(params.subaccountId, filters)
    const totalPages = Math.ceil((count || 0) / limit)

    // Fetch dynamic attributes for sidebar
    const attributes = await getDistinctCustomAttributes(params.subaccountId)
    const existingBrands = await getDistinctBrands(params.subaccountId)
    const existingCategories = await getDistinctCategories(params.subaccountId)

    return (
        <InventoryClient
            subAccountId={params.subaccountId}
            products={products || []}
            count={count}
            attributes={attributes}
            existingBrands={existingBrands}
            existingCategories={existingCategories}
            totalPages={totalPages}
            page={page}
            view={view}
            searchParams={searchParams}
        />
    )
}

export default InventoryPage
