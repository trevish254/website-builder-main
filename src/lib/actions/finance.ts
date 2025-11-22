'use server'

import { upsertMpesaSettings, createTransaction, getWallet, updateTransactionStatus, createWallet } from '@/lib/queries'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MpesaSettingsSchema = z.object({
    shortCode: z.string().min(1, 'Shortcode is required'),
    consumerKey: z.string().min(1, 'Consumer Key is required'),
    consumerSecret: z.string().min(1, 'Consumer Secret is required'),
    passkey: z.string().optional(),
    environment: z.enum(['SANDBOX', 'PRODUCTION']),
    callbackUrl: z.string().optional(),
    agencyId: z.string().optional(),
    subAccountId: z.string().optional(),
})

export const saveMpesaSettings = async (values: z.infer<typeof MpesaSettingsSchema>) => {
    try {
        const validated = MpesaSettingsSchema.parse(values)
        const response = await upsertMpesaSettings(validated)

        if (validated.agencyId) {
            revalidatePath(`/agency/${validated.agencyId}/finance`)
        } else if (validated.subAccountId) {
            revalidatePath(`/subaccount/${validated.subAccountId}/finance`)
        }

        return response
    } catch (error) {
        console.error('Error saving MPESA settings:', error)
        throw error
    }
}

const SendMoneySchema = z.object({
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    description: z.string().optional(),
    type: z.enum(['B2C', 'B2B']),
    agencyId: z.string().optional(),
    subAccountId: z.string().optional(),
})

export const sendMoney = async (values: z.infer<typeof SendMoneySchema>) => {
    try {
        const validated = SendMoneySchema.parse(values)
        const wallet = await getWallet(validated.agencyId, validated.subAccountId)

        if (!wallet) throw new Error('Wallet not found')
        if (wallet.balance < validated.amount) throw new Error('Insufficient funds')

        // Create transaction record
        const transaction = await createTransaction(
            wallet.id,
            validated.amount,
            validated.type,
            validated.description,
            undefined, // Reference will be updated by MPESA callback
            validated.phoneNumber
        )

        // TODO: Trigger actual MPESA B2C API call here
        console.log('🚀 Triggering MPESA Send Money:', validated)

        if (validated.agencyId) {
            revalidatePath(`/agency/${validated.agencyId}/finance`)
        } else if (validated.subAccountId) {
            revalidatePath(`/subaccount/${validated.subAccountId}/finance`)
        }

        return transaction
    } catch (error) {
        console.error('Error sending money:', error)
        throw error
    }
}

const ReceiveMoneySchema = z.object({
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    description: z.string().optional(),
    agencyId: z.string().optional(),
    subAccountId: z.string().optional(),
})

export const requestStkPush = async (values: z.infer<typeof ReceiveMoneySchema>) => {
    try {
        const validated = ReceiveMoneySchema.parse(values)
        const wallet = await getWallet(validated.agencyId, validated.subAccountId)

        if (!wallet) throw new Error('Wallet not found')

        // Create transaction record (C2B/STK Push)
        const transaction = await createTransaction(
            wallet.id,
            validated.amount,
            'C2B',
            validated.description,
            undefined,
            validated.phoneNumber
        )

        // TODO: Trigger actual MPESA STK Push API call here
        console.log('🚀 Triggering MPESA STK Push:', validated)

        if (validated.agencyId) {
            revalidatePath(`/agency/${validated.agencyId}/finance`)
        } else if (validated.subAccountId) {
            revalidatePath(`/subaccount/${validated.subAccountId}/finance`)
        }

        return transaction
    } catch (error) {
        console.error('Error requesting STK Push:', error)
        throw error
    }
}

export const simulateTransactions = async (agencyId?: string, subAccountId?: string) => {
    try {
        let wallet = await getWallet(agencyId, subAccountId)
        if (!wallet) {
            console.log('⚠️ Wallet not found, creating one for simulation...')
            wallet = await createWallet(agencyId, subAccountId)
        }

        if (!wallet) throw new Error('Failed to get or create wallet')

        const transactionTypes = ['DEPOSIT', 'WITHDRAWAL', 'B2C', 'B2B', 'C2B', 'REVERSAL']
        const statuses = ['COMPLETED', 'PENDING', 'FAILED', 'REVERSED']

        // Generate 5 random transactions
        for (let i = 0; i < 5; i++) {
            const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
            const status = statuses[Math.floor(Math.random() * statuses.length)]
            const amount = Math.floor(Math.random() * 10000) + 100

            let description = ''
            switch (type) {
                case 'DEPOSIT': description = 'Funds Top-up'; break;
                case 'WITHDRAWAL': description = 'Withdrawal to Bank'; break;
                case 'B2C': description = 'Salary Payment'; break;
                case 'B2B': description = 'Supplier Payment'; break;
                case 'C2B': description = 'Customer Payment'; break;
                case 'REVERSAL': description = 'Reversal of wrong transaction'; break;
            }

            const newTransaction = await createTransaction(
                wallet.id,
                amount,
                type,
                description,
                `SIM-${Math.random().toString(36).substring(7).toUpperCase()}`,
                `2547${Math.floor(Math.random() * 90000000 + 10000000)}`
            )

            if (newTransaction && status !== 'PENDING') {
                await updateTransactionStatus(newTransaction.id, status)
            }
        }

        if (agencyId) {
            revalidatePath(`/agency/${agencyId}/finance`)
        } else if (subAccountId) {
            revalidatePath(`/subaccount/${subAccountId}/finance`)
        }

        return { success: true }
    } catch (error) {
        console.error('Error simulating transactions:', error)
        throw error
    }
}
