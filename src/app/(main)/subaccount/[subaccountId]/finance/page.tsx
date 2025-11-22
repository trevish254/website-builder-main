import React from 'react'
import { getWallet, getTransactions, getMpesaSettings } from '@/lib/queries'
import DashboardGrid from '@/components/finance/dashboard-grid'

type Props = {
    params: { subaccountId: string }
}

const FinancePage = async ({ params }: Props) => {
    const wallet = await getWallet(undefined, params.subaccountId)
    const transactions = wallet ? await getTransactions(wallet.id) : []
    const mpesaSettings = await getMpesaSettings(undefined, params.subaccountId)

    const totalBalance = wallet?.balance || 0.00

    return (
        <DashboardGrid
            balance={totalBalance}
            transactions={transactions}
            subAccountId={params.subaccountId}
            mpesaSettings={mpesaSettings}
        />
    )
}

export default FinancePage
