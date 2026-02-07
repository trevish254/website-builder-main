import BlurPage from '@/components/global/blur-page'
import { getCustomersWithStats } from '@/lib/queries'
import React from 'react'
import CustomersClient from './_components/customers-client'

type Props = {
    params: { subaccountId: string }
}

const CustomersPage = async ({ params }: Props) => {
    const customers = await getCustomersWithStats(params.subaccountId)

    return (
        <BlurPage>
            <CustomersClient
                customers={customers}
                subaccountId={params.subaccountId}
            />
        </BlurPage>
    )
}

export default CustomersPage
