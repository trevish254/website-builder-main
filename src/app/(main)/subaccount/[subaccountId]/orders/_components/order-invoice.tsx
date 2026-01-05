'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface OrderInvoiceProps {
    order: {
        id: string
        orderId: string
        customerName?: string
        customerEmail?: string
        totalPrice: number
        paymentMethod?: string
        paymentStatus: string
        createdAt: string
        OrderItem?: Array<{
            id: string
            quantity: number
            unitPrice: number
            totalPrice: number
            Product?: {
                name: string
                images?: string[]
            }
        }>
    }
    subaccount: {
        name: string
        companyEmail: string
        address: string
        subAccountLogo?: string
    }
}

const OrderInvoice = ({ order, subaccount }: OrderInvoiceProps) => {
    const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })

    const subName = subaccount?.name || 'Local Store'
    const subEmail = subaccount?.companyEmail || 'support@store.com'
    const subAddress = subaccount?.address || 'Global Distribution Hub'
    const subLogo = subaccount?.subAccountLogo

    return (
        <Card id="order-invoice-content" className="p-8 md:p-12 bg-white text-black border-none shadow-none max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div className="flex flex-col gap-2">
                    {subLogo ? (
                        <img src={subLogo} alt={subName} className="size-16 object-contain mb-4 rounded-xl" />
                    ) : (
                        <div className="size-12 bg-slate-900 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl">
                            {subName.charAt(0)}
                        </div>
                    )}
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{subName}</h1>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                        {subAddress}
                    </p>
                    <p className="text-gray-500 text-sm font-bold">{subEmail}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <h2 className="text-6xl font-black text-gray-100 uppercase mb-4 leading-none select-none">Invoice</h2>
                    <div className="space-y-1 mt-4">
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Invoice ID</p>
                        <p className="text-lg font-black text-slate-900">#INV-{order.orderId.toUpperCase()}</p>

                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-4">Date Issued</p>
                        <p className="text-sm font-black text-slate-900">{today}</p>

                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-4">Status</p>
                        <p className={cn(
                            "text-sm font-black tracking-widest",
                            order.paymentStatus === 'Done' ? 'text-emerald-500' : 'text-orange-500'
                        )}>
                            {order.paymentStatus === 'Done' ? 'PAID' : 'PENDING'}
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="bg-gray-100 mb-12" />

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
                    <p className="text-xl font-black text-slate-900">{order.customerName || 'Standard Customer'}</p>
                    <p className="text-gray-500 font-medium">{order.customerEmail || 'no-email@customer.com'}</p>
                </div>
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        Standard Shipping<br />
                        Verified Residential Address<br />
                        Service Area: {subaccount.address?.split(',').pop()?.trim() || 'Global'}
                    </p>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-12 border border-gray-100 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                    <div className="col-span-6">Item Manifest</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>
                {order.OrderItem && order.OrderItem.length > 0 ? (
                    order.OrderItem.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 p-6 items-center border-b last:border-0 border-gray-100 bg-white">
                            <div className="col-span-6 flex items-center gap-4">
                                {item.Product?.images?.[0] && (
                                    <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                                        <img src={item.Product.images[0]} alt={item.Product.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-black text-slate-900 uppercase tracking-tight text-sm">
                                        {item.Product?.name || 'Inventory Item'}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">SKU: {order.orderId}-{idx}</p>
                                </div>
                            </div>
                            <div className="col-span-2 text-center font-bold text-gray-600">
                                {item.quantity}
                            </div>
                            <div className="col-span-2 text-right font-medium text-gray-600">
                                ${item.unitPrice.toFixed(2)}
                            </div>
                            <div className="col-span-2 text-right font-black text-slate-900">
                                ${item.totalPrice.toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400 italic">No items manifest recorded</div>
                )}
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-full md:w-80 space-y-3 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                        <p>Subtotal</p>
                        <p className="text-slate-900">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                        <p>Tax (0%)</p>
                        <p className="text-slate-900">$0.00</p>
                    </div>
                    <Separator className="bg-gray-200" />
                    <div className="flex justify-between items-baseline pt-2">
                        <p className="text-sm font-black uppercase tracking-widest text-slate-900">Grand Total</p>
                        <p className="text-3xl font-black text-slate-900">${order.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">
                        Payment via {order.paymentMethod || 'SECURE CHECKOUT'}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 font-mono">Authenticated Commercial Document</p>
                <p className="text-gray-400 text-[11px] font-medium leading-relaxed">
                    This document serves as an official receipt of transaction between {subName} and {order.customerName || 'the Customer'}.<br />
                    For inquiries, contact {subEmail}. Thank you for your business.
                </p>
            </div>
        </Card>
    )
}

export default OrderInvoice
