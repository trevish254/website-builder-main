'use server'
import { paystack } from './index'
import { v4 } from 'uuid'

export const processCheckout = async (data: {
    email: string
    amount: number
    productId: string
    productName: string
    quantity: number
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
        // This creates the order record in Paystack
        const initResponse = await paystack.initializeTransaction({
            email: data.email,
            amount: Math.round(data.amount * 100).toString(), // convert to kobo
            metadata: {
                cart_id: v4(),
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
                    }
                ],
                // Cart items for order display
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

        console.log('📋 Transaction Initialized:', JSON.stringify(initResponse, null, 2))

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
                    reference: reference, // Link to initialized transaction
                    productId: data.productId,
                    productName: data.productName,
                    quantity: data.quantity
                }
            })

            console.log('✅ Paystack Charge Response:', JSON.stringify(chargeResponse, null, 2))
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
                    reference: reference, // Link to initialized transaction
                    mobile_money: {
                        phone: data.phone,
                        provider: "mpesa"
                    },
                    metadata: {
                        productId: data.productId,
                        productName: data.productName,
                        quantity: data.quantity
                    }
                }),
            })
            chargeResponse = await response.json()
            console.log('✅ Paystack M-Pesa Response:', JSON.stringify(chargeResponse, null, 2))
        }

        return chargeResponse || { status: false, message: 'Invalid payment details' }
    } catch (error: any) {
        console.error('🔴 Checkout Error:', error)
        return { status: false, message: error.message || 'Payment failed' }
    }
}

export const submitPaymentOtp = async (otp: string, reference: string) => {
    try {
        const response = await paystack.submitOtp({ otp, reference })
        return response
    } catch (error: any) {
        return { status: false, message: error.message || 'OTP submission failed' }
    }
}
