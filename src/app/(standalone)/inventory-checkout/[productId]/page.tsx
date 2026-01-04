import React, { Suspense } from 'react'
import { getProductDetails } from '@/lib/queries'
import { notFound } from 'next/navigation'
import ProductTerminalView from '@/components/global/product-terminal-view'
export const dynamic = 'force-dynamic'

interface Props {
    params: {
        productId: string
    }
}

const ProductTerminalPage = async ({ params }: Props) => {
    const product = await getProductDetails(params.productId)

    if (!product) {
        return notFound()
    }

    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-black animate-pulse">LOADING TERMINAL...</div>}>
            <ProductTerminalView product={product as any} />
        </Suspense>
    )
}

export default ProductTerminalPage
