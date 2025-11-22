import React from 'react'
import { getWallet, getTransactions, getMpesaSettings } from '@/lib/queries'
import DashboardGrid from '@/components/finance/dashboard-grid'

type Props = {
    params: { agencyId: string }
}

const FinancePage = async ({ params }: Props) => {
    const wallet = await getWallet(params.agencyId)
    const transactions = wallet ? await getTransactions(wallet.id) : []
    const mpesaSettings = await getMpesaSettings(params.agencyId)

    const totalBalance = wallet?.balance || 0.00

    return (
        <DashboardGrid
            balance={totalBalance}
            transactions={transactions}
            agencyId={params.agencyId}
            mpesaSettings={mpesaSettings}
        />
    )
}

export default FinancePage
