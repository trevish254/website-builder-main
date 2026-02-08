'use server'

import { sms, voice } from '@/lib/africas-talking'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export const sendBulkSMS = async (subaccountId: string, recipients: string[], message: string) => {
    try {
        const user = await currentUser()
        if (!user) return { error: 'Unauthorized' }

        if (!recipients.length || !message) {
            return { error: 'Missing recipients or message' }
        }

        // Send SMS via Africa's Talking
        // Note: For sandbox, recipients must wait for approval or use your own verified number
        const result = await sms.send({
            to: recipients,
            message: message,
            // from: 'ATLABS', // Optional sender ID, defaults to standard if omitted
        })

        console.log('AT SMS Result:', result)

        // Log the activity in DB (optional but recommended)
        /*
        await db.campaignActivity.create({
            data: {
                subAccountId,
                type: 'SMS',
                description: `Sent SMS to ${recipients.length} recipients`,
                status: 'COMPLETED',
                metadata: result
            }
        })
        */

        return { success: true, data: result }
    } catch (error: any) {
        console.error('Error sending SMS:', error)
        return { error: error.message || 'Failed to send SMS' }
    }
}

export const sendBulkVoice = async (subaccountId: string, recipients: string[], audioUrl: string) => {
    try {
        const user = await currentUser()
        if (!user) return { error: 'Unauthorized' }

        const result = await voice.call({
            callFrom: '+254711082000', // Standard AT Sandbox number
            callTo: recipients,
        })

        console.log('AT Voice Result:', result)
        return { success: true, data: result }
    } catch (error: any) {
        console.error('Error sending Voice:', error)
        return { error: error.message || 'Failed to initiate calls' }
    }
}
