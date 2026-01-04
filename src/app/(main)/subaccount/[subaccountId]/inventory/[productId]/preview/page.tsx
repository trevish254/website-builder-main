import React from 'react'
import { getProductDetails } from '@/lib/queries'
import { redirect } from 'next/navigation'
import ProductCheckoutView from '../_components/product-checkout-view'
import BlurPage from '@/components/global/blur-page'

interface Props {
    params: {
        subaccountId: string
        productId: string
    }
}

const ProductPreviewPage = async ({ params }: Props) => {
    const product = await getProductDetails(params.productId)

    if (!product) {
        return redirect(`/subaccount/${params.subaccountId}/inventory`)
    }

    return (
        <BlurPage>
            <div className="flex flex-col gap-4 p-4">
                <ProductCheckoutView product={product as any} />
            </div>
        </BlurPage>
    )
}

export default ProductPreviewPage
