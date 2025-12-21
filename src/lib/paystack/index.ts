export const paystack = {
    initializeTransaction: async (data: {
        email: string
        amount: string // amount in kobo/cents
        plan?: string
        metadata?: any
        callback_url?: string
    }) => {
        const res = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return res.json()
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
}
