'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'

type InvoiceTemplateProps = {
    invoiceNumber: string
    date: string
    agencyName: string
    agencyEmail: string
    agencyAddress: string
    agencyLogo: string
    customerName: string
    customerEmail: string
    description: string
    amount: string
    status: string
}

const InvoiceTemplate = ({
    invoiceNumber,
    date,
    agencyName,
    agencyEmail,
    agencyAddress,
    agencyLogo,
    customerName,
    customerEmail,
    description,
    amount,
    status
}: InvoiceTemplateProps) => {

    const handleDownload = async () => {
        const html2pdf = (await import('html2pdf.js')).default
        const element = document.getElementById('invoice-content')
        const opt = {
            margin: 0.5,
            filename: `invoice_${invoiceNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save()
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end gap-2 no-print">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                </Button>
                <Button variant="default" size="sm" onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    Download PDF
                </Button>
            </div>

            <Card id="invoice-content" className="p-8 md:p-12 bg-white text-black border-none shadow-none max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                    <div className="flex flex-col gap-2">
                        {agencyLogo ? (
                            <img src={agencyLogo} alt={agencyName} className="w-16 h-16 object-contain mb-4" />
                        ) : (
                            <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl">
                                {agencyName.charAt(0)}
                            </div>
                        )}
                        <h1 className="text-2xl font-bold uppercase tracking-tight">{agencyName}</h1>
                        <p className="text-gray-500 text-sm max-w-xs">{agencyAddress}</p>
                        <p className="text-gray-500 text-sm">{agencyEmail}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <h2 className="text-4xl font-light text-gray-300 uppercase mb-4">Invoice</h2>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold">Invoice ID: <span className="font-mono font-normal text-gray-600">#{invoiceNumber}</span></p>
                            <p className="text-sm font-semibold">Date: <span className="font-normal text-gray-600">{date}</span></p>
                            <p className="text-sm font-semibold">Status: <span className={status === 'Paid' ? 'text-emerald-600 font-bold' : 'text-orange-600 font-bold'}>{status.toUpperCase()}</span></p>
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-100 mb-12" />

                {/* Client & Billing Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Bill To</h3>
                        <p className="text-lg font-bold">{customerName}</p>
                        <p className="text-gray-500">{customerEmail}</p>
                    </div>
                    {/* Optional: Add more billing info if available */}
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <div className="grid grid-cols-4 pb-4 border-b-2 border-gray-900 text-xs font-bold uppercase tracking-widest">
                        <div className="col-span-2 text-left">Description</div>
                        <div className="text-center">Quantity</div>
                        <div className="text-right">Total</div>
                    </div>
                    <div className="grid grid-cols-4 py-6 border-b border-gray-100">
                        <div className="col-span-2 text-left">
                            <p className="font-bold">{description}</p>
                            <p className="text-sm text-gray-500 mt-1">Subscription / Service rendered</p>
                        </div>
                        <div className="text-center text-gray-600">1</div>
                        <div className="text-right font-bold">{amount}</div>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-full md:w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-500">Subtotal</p>
                            <p className="font-semibold">{amount}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-500">Tax (0%)</p>
                            <p className="font-semibold">KSh 0</p>
                        </div>
                        <Separator className="bg-gray-200" />
                        <div className="flex justify-between text-lg font-bold">
                            <p>Grand Total</p>
                            <p className="text-blue-600">{amount}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-400 text-sm italic">Thank you for your business! If you have any questions, please contact support.</p>
                </div>
            </Card>
        </div>
    )
}

export default InvoiceTemplate
