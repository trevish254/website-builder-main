import React from 'react'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { getProductDetails } from '@/lib/queries'
import { notFound } from 'next/navigation'
import ProductCheckoutView from '@/components/global/product-checkout-view'

interface Props {
    params: {
        productId: string
    }
}

const ProductStandalonePreview = async ({ params }: Props) => {
    // Force a fresh fetch from the database
    const product = await getProductDetails(params.productId)

    if (!product) {
        return notFound()
    }

    return (
        <div className="flex flex-col gap-4 p-4 min-h-screen bg-background">
            <ProductCheckoutView product={product as any} />
        </div>
    )
}

export default ProductStandalonePreview
