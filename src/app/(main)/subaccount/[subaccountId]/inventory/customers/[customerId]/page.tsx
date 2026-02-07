import BlurPage from '@/components/global/blur-page'
import { getCustomerDetails } from '@/lib/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import CustomerDetailsClient from '../_components/customer-details-client'

type Props = {
    params: { subaccountId: string, customerId: string }
}

const CustomerDetailsPage = async ({ params }: Props) => {
    const customer = await getCustomerDetails(params.customerId)

    if (!customer) {
        return redirect(`/subaccount/${params.subaccountId}/inventory/customers`)
    }

    return (
        <BlurPage>
            <CustomerDetailsClient
                customer={customer}
                subaccountId={params.subaccountId}
            />
        </BlurPage>
    )
}

export default CustomerDetailsPage
