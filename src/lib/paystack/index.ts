export const paystack = {
    initializeTransaction: async (data: {
        email: string
        amount: string // amount in kobo/cents
        plan?: string
        metadata?: any
        callback_url?: string
    }) => {
        console.log('📡 Sending to Paystack:', JSON.stringify(data, null, 2))
        const res = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const result = await res.json()
        console.log('📥 Paystack Response:', JSON.stringify(result, null, 2))
        return result
    },
    verifyTransaction: async (reference: string) => {
        const res = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )
        return res.json()
    },
    fetchSubscription: async (subscriptionId: string) => {
        const res = await fetch(
            `https://api.paystack.co/subscription/${subscriptionId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )
        return res.json()
    },
    fetchCustomer: async (emailOrCode: string) => {
        const res = await fetch(
            `https://api.paystack.co/customer/${emailOrCode}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )
        return res.json()
    },
    listTransactions: async (customerIdOrCode?: string) => {
        const url = customerIdOrCode
            ? `https://api.paystack.co/transaction?customer=${customerIdOrCode}`
            : 'https://api.paystack.co/transaction'
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        })
        return res.json()
    },
    listSubscriptions: async (customerIdOrCode?: string) => {
        const url = customerIdOrCode
            ? `https://api.paystack.co/subscription?customer=${customerIdOrCode}`
            : 'https://api.paystack.co/subscription'
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        })
        return res.json()
    },
}
