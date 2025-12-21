'use client'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FileText, Eye } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/global/custom-modal'
import InvoiceTemplate from './invoice-template'

type Transaction = {
    id: string
    description: string
    date: string
    status: string
    amount: string
    customerName: string
    customerEmail: string
}

type Props = {
    data: Transaction[]
    agencyDetails: {
        name: string
        email: string
        address: string
        logo: string
    }
}

const InvoicesList = ({ data, agencyDetails }: Props) => {
    const { setOpen } = useModal()

    const handleViewInvoice = (transaction: Transaction) => {
        setOpen(
            <CustomModal
                title="Invoice Preview"
                subheading="View and download your transaction invoice"
            >
                <InvoiceTemplate
                    invoiceNumber={transaction.id}
                    date={transaction.date}
                    agencyName={agencyDetails.name}
                    agencyEmail={agencyDetails.email}
                    agencyAddress={agencyDetails.address}
                    agencyLogo={agencyDetails.logo}
                    customerName={transaction.customerName}
                    customerEmail={transaction.customerEmail}
                    description={transaction.description}
                    amount={transaction.amount}
                    status={transaction.status}
                />
            </CustomModal>
        )
    }

    return (
        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden shadow-xl shadow-background/20 animate-in fade-in duration-500">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="py-6 font-bold text-foreground pl-8">Invoice ID</TableHead>
                        <TableHead className="font-bold text-foreground">Plan / Description</TableHead>
                        <TableHead className="font-bold text-foreground">Billing Date</TableHead>
                        <TableHead className="font-bold text-foreground">Net Amount</TableHead>
                        <TableHead className="text-right font-bold text-foreground pr-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((transaction) => (
                            <TableRow key={transaction.id} className="border-border/40 hover:bg-muted/20 transition-all group">
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-emerald-500" />
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                                            #{transaction.id.slice(0, 12)}...
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-5 font-semibold text-foreground">
                                    {transaction.description}
                                </TableCell>
                                <TableCell className="text-muted-foreground font-medium">
                                    {transaction.date}
                                </TableCell>
                                <TableCell className="font-extrabold text-lg tabular-nums">
                                    {transaction.amount}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 px-4 rounded-lg flex items-center gap-2 border-border/50 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group-hover:shadow-sm"
                                        onClick={() => handleViewInvoice(transaction)}
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Preview</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <FileText className="w-12 h-12 opacity-10" />
                                    <p className="text-xl font-bold text-foreground">No invoices yet</p>
                                    <p className="text-sm">Once you make a payment, your invoices will appear here.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default InvoicesList
