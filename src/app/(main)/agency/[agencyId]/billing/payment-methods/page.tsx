import React from 'react'
import { Separator } from '@/components/ui/separator'

const PaymentMethodsPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-4xl p-4">Payment Methods</h1>
            <Separator className="mb-6" />
            <div className="p-4 text-muted-foreground">
                Payment method management coming soon.
            </div>
        </div>
    )
}

export default PaymentMethodsPage
