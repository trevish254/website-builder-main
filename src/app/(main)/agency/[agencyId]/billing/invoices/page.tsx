import React from 'react'
import { Separator } from '@/components/ui/separator'
import { getAuthUserDetails } from '@/lib/queries'
import { paystack } from '@/lib/paystack'
import InvoicesList from '../_components/invoice-list'

type Props = {
    params: { agencyId: string }
}

const InvoicesPage = async ({ params }: Props) => {
    const userDetails = await getAuthUserDetails()
    if (!userDetails) return null

    const agency = userDetails.Agency
    const agencySubscription = agency?.Subscription?.[0] || agency?.Subscription
    let customerCode = agencySubscription?.customerId

    // 2. If no customerId in DB, try to find it via Paystack API using the agency's company email
    if (!customerCode && agency?.companyEmail) {
        const customerRes = await paystack.fetchCustomer(agency.companyEmail)
        if (customerRes.status && customerRes.data) {
            customerCode = customerRes.data.customer_code
        }
    }

    // 3. Fallback to user email if still no customerCode
    if (!customerCode && userDetails?.email) {
        const customerRes = await paystack.fetchCustomer(userDetails.email)
        if (customerRes.status && customerRes.data) {
            customerCode = customerRes.data.customer_code
        }
    }

    // 4. Fetch ALL charges from Paystack
    const transactionsRes = await paystack.listTransactions()

    const allTransactions = Array.isArray(transactionsRes.data) ? transactionsRes.data : []
    const userEmail = userDetails.email.toLowerCase()
    const agencyEmail = agency?.companyEmail?.toLowerCase()

    const filteredTransactions = allTransactions.filter((tx: any) => {
        const txEmail = tx.customer?.email?.toLowerCase()
        const txCustCode = tx.customer?.customer_code

        return (
            txEmail === userEmail ||
            (agencyEmail && txEmail === agencyEmail) ||
            (customerCode && txCustCode === customerCode)
        )
    })

    const allInvoices = filteredTransactions.map((transaction: any) => ({
        id: transaction.reference,
        description: transaction.plan_object?.name || (transaction.amount === 1500000 ? 'Unlimited Saas Plan' : transaction.amount === 500000 ? 'Basic Plan' : 'One-time Payment'),
        date: new Date(transaction.paid_at || transaction.created_at).toLocaleDateString(),
        status: transaction.status === 'success' ? 'Paid' : transaction.status,
        amount: `KSh ${(transaction.amount / 100).toLocaleString()}`,
        customerName: transaction.customer?.first_name ? `${transaction.customer.first_name} ${transaction.customer.last_name || ''}` : userDetails.name,
        customerEmail: transaction.customer?.email || userDetails.email,
    }))

    const agencyDetails = {
        name: agency?.name || 'Aventis Org',
        email: agency?.companyEmail || 'support@aventis.org',
        address: agency?.address || 'Nairobi, Kenya',
        logo: agency?.agencyLogo || '',
    }

    return (
        <div className="flex flex-col gap-10 pb-20 p-4 md:p-8 relative">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Invoices</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Access and download your official billing documents. Keep track of your agency's financial records with ease.
                </p>
                <div className="h-1 w-20 bg-emerald-500 rounded-full" />
            </div>

            <InvoicesList
                data={allInvoices}
                agencyDetails={agencyDetails}
            />

            {/* Decorative background element */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    )
}

export default InvoicesPage
