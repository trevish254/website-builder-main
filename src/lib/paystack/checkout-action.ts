'use server'
import { paystack } from './index'
import { v4 } from 'uuid'

import { createOrder } from '../queries'

export const processCheckout = async (data: {
    email: string
    amount: number
    productId: string
    productName: string
    quantity: number
    subAccountId: string
    cardData?: {
        number: string
        cvv: string
        expiry_month: string
        expiry_year: string
    }
    paymentMethod: 'card' | 'mpesa'
    phone?: string
}) => {
    console.log('💳 Processing Checkout for:', data.email)

    try {
        // Step 1: Initialize transaction with order details
        const initResponse = await paystack.initializeTransaction({
            email: data.email,
            amount: Math.round(data.amount * 100).toString(),
            metadata: {
                cart_id: v4(),
                subAccountId: data.subAccountId,
                custom_fields: [
                    {
                        display_name: "Product Name",
                        variable_name: "product_name",
                        value: data.productName
                    },
                    {
                        display_name: "Quantity",
                        variable_name: "quantity",
                        value: data.quantity.toString()
                    },
                    {
                        display_name: "Product ID",
                        variable_name: "product_id",
                        value: data.productId
                    },
                    {
                        display_name: "SubAccount ID",
                        variable_name: "subaccount_id",
                        value: data.subAccountId
                    }
                ],
                cart: [
                    {
                        id: data.productId,
                        name: data.productName,
                        price: Math.round((data.amount / data.quantity) * 100),
                        quantity: data.quantity
                    }
                ]
            }
        })

        if (!initResponse.status || !initResponse.data?.reference) {
            return { status: false, message: initResponse.message || 'Failed to initialize transaction' }
        }

        const reference = initResponse.data.reference

        // Step 2: Charge the initialized transaction
        let chargeResponse: any = null

        if (data.paymentMethod === 'card' && data.cardData) {
            chargeResponse = await paystack.charge({
                email: data.email,
                amount: Math.round(data.amount * 100).toString(),
                card: data.cardData,
                metadata: {
                    reference: reference,
                    productId: data.productId,
                    productName: data.productName,
                    quantity: data.quantity,
                    subAccountId: data.subAccountId
                }
            })
        } else if (data.paymentMethod === 'mpesa' && data.phone) {
            const response = await fetch('https://api.paystack.co/charge', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    amount: Math.round(data.amount * 100).toString(),
                    reference: reference,
                    mobile_money: {
                        phone: data.phone,
                        provider: "mpesa"
                    },
                    metadata: {
                        productId: data.productId,
                        productName: data.productName,
                        quantity: data.quantity,
                        subAccountId: data.subAccountId
                    }
                }),
            })
            chargeResponse = await response.json()
        }

        // Step 3: If payment is successful immediately (no OTP), create the order
        if (chargeResponse && (chargeResponse.data?.status === 'success' || chargeResponse.status === 'success' || chargeResponse.status === true)) {
            await createOrder({
                subAccountId: data.subAccountId,
                customerEmail: data.email,
                customerName: data.email.split('@')[0], // Fallback name
                totalPrice: data.amount,
                paymentMethod: data.paymentMethod.toUpperCase(),
                paymentStatus: 'Done',
                orderStatus: 'Order Confirmed',
                items: [
                    {
                        productId: data.productId,
                        productName: data.productName,
                        quantity: data.quantity,
                        unitPrice: data.amount / data.quantity,
                        totalPrice: data.amount
                    }
                ]
            })
        }

        return chargeResponse || { status: false, message: 'Invalid payment details' }
    } catch (error: any) {
        console.error('🔴 Checkout Error:', error)
        return { status: false, message: error.message || 'Payment failed' }
    }
}

export const submitPaymentOtp = async (otp: string, reference: string, orderDetails?: any) => {
    try {
        const response = await paystack.submitOtp({ otp, reference })

        // If OTP verification is successful, create the order
        if (response.status && (response.data?.status === 'success' || response.status === true) && orderDetails) {
            await createOrder({
                subAccountId: orderDetails.subAccountId,
                customerEmail: orderDetails.email,
                customerName: orderDetails.email.split('@')[0],
                totalPrice: orderDetails.amount,
                paymentMethod: orderDetails.paymentMethod?.toUpperCase() || 'CARD',
                paymentStatus: 'Done',
                orderStatus: 'Order Confirmed',
                items: [
                    {
                        productId: orderDetails.productId,
                        productName: orderDetails.productName,
                        quantity: orderDetails.quantity,
                        unitPrice: orderDetails.amount / orderDetails.quantity,
                        totalPrice: orderDetails.amount
                    }
                ]
            })
        }

        return response
    } catch (error: any) {
        return { status: false, message: error.message || 'OTP submission failed' }
    }
}

