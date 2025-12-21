import { supabase } from '../supabase'
import { saveActivityLogsNotification } from '../queries'

export const paystackSubscriptionCreated = async (
    subscriptionCode: string,
    customerCode: string,
    planCode: string,
    email: string,
    nextPaymentDate: string
) => {
    console.log('🏁 paystackSubscriptionCreated called with:', {
        subscriptionCode,
        customerCode,
        planCode,
        email,
        nextPaymentDate
    })
    try {
        // Find agency by email (Paystack customer email)
        const { data: agency } = await (supabase
            .from('Agency') as any)
            .select(`
        *,
        SubAccount (*)
      `)
            .eq('companyEmail', email)
            .single()

        if (!agency) {
            console.error('Could not find an agency to upsert the subscription for email:', email)
            return
        }

        // HEAL: Update agency customerId if it's missing or incorrect (like mpesa_...)
        if (agency.customerId !== customerCode) {
            console.log(`🩹 Healing Agency customerId: ${agency.customerId} -> ${customerCode}`)
            await (supabase
                .from('Agency') as any)
                .update({ customerId: customerCode })
                .eq('id', agency.id)
        }

        const data = {
            active: true,
            agencyId: agency.id,
            customerId: customerCode,
            currentPeriodEndDate: nextPaymentDate,
            priceId: planCode,
            subscritiptionId: subscriptionCode,
            plan: planCode,
        }

        const { error } = await (supabase
            .from('Subscription') as any)
            .upsert(data, {
                onConflict: 'agencyId'
            })

        if (error) {
            console.error('Error upserting Paystack subscription:', error)
            return
        }

        await saveActivityLogsNotification({
            agencyId: agency.id,
            description: `Paid for ${planCode} subscription plan`,
            subaccountId: undefined,
        })

        console.log(`🟢 Created Paystack Subscription for ${subscriptionCode}`)
    } catch (error) {
        console.log('🔴 Error from Paystack Create action', error)
    }
}

export const paystackSubscriptionDisabled = async (subscriptionCode: string) => {
    try {
        const { error } = await (supabase
            .from('Subscription') as any)
            .update({ active: false })
            .eq('subscritiptionId', subscriptionCode)

        if (error) {
            console.error('Error disabling Paystack subscription:', error)
            return
        }

        // We need to find the agencyId for the notification
        const { data: sub } = await (supabase
            .from('Subscription') as any)
            .select('agencyId')
            .eq('subscritiptionId', subscriptionCode)
            .single()

        if (sub?.agencyId) {
            await saveActivityLogsNotification({
                agencyId: sub.agencyId,
                description: `Subscription disabled`,
                subaccountId: undefined,
            })
        }

        console.log(`🟠 Disabled Paystack Subscription ${subscriptionCode}`)
    } catch (error) {
        console.error('🔴 Error from Paystack Disable action', error)
    }
}
