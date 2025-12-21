'use server'
import { supabase } from '../supabase'

export const paystackSubscriptionCreated = async (
    subscriptionCode: string,
    customerCode: string,
    planCode: string,
    email: string,
    nextPaymentDate: string
) => {
    try {
        // Find agency by email (Paystack customer email)
        const { data: agency } = await supabase
            .from('Agency')
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

        const data = {
            active: true,
            agencyId: agency.id,
            customerId: customerCode,
            currentPeriodEndDate: nextPaymentDate,
            priceId: planCode,
            subscritiptionId: subscriptionCode,
            plan: planCode,
        }

        const { error } = await supabase
            .from('Subscription')
            .upsert(data, {
                onConflict: 'agencyId'
            })

        if (error) {
            console.error('Error upserting Paystack subscription:', error)
            return
        }

        console.log(`🟢 Created Paystack Subscription for ${subscriptionCode}`)
    } catch (error) {
        console.log('🔴 Error from Paystack Create action', error)
    }
}

export const paystackSubscriptionDisabled = async (subscriptionCode: string) => {
    try {
        const { error } = await supabase
            .from('Subscription')
            .update({ active: false })
            .eq('subscritiptionId', subscriptionCode)

        if (error) {
            console.error('Error disabling Paystack subscription:', error)
            return
        }

        console.log(`🟠 Disabled Paystack Subscription ${subscriptionCode}`)
    } catch (error) {
        console.error('🔴 Error from Paystack Disable action', error)
    }
}
