import { getOrders, getOrderStats, getSubaccountDetails } from '@/lib/queries'
import React from 'react'
import OrdersClient from './_components/orders-client'

const OrdersPage = async ({
    params,
    searchParams,
}: {
    params: { subaccountId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const page = Number(searchParams.page) || 1
    const limit = 20

    const filters = {
        query: searchParams.query as string,
        status: searchParams.status as string,
        paymentStatus: searchParams.paymentStatus as string,
        startDate: searchParams.startDate as string,
        endDate: searchParams.endDate as string,
        page,
        limit,
    }

    const { data: orders, count } = await getOrders(params.subaccountId, filters)
    const stats = await getOrderStats(params.subaccountId)
    const subaccount = await getSubaccountDetails(params.subaccountId)
    const totalPages = Math.ceil((count || 0) / limit)

    return (
        <OrdersClient
            subAccountId={params.subaccountId}
            subaccount={subaccount}
            orders={orders || []}
            stats={stats}
            count={count}
            totalPages={totalPages}
            page={page}
            searchParams={searchParams}
        />
    )
}

export default OrdersPage
