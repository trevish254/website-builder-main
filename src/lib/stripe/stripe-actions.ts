'use server'
import Stripe from 'stripe'
import { supabase } from '../supabase'
import { stripe } from '.'

export const subscriptionCreated = async (
  subscription: Stripe.Subscription,
  customerId: string
) => {
  try {
    const { data: agency } = await supabase
      .from('Agency')
      .select(`
        *,
        SubAccount (*)
      `)
      .eq('customerId', customerId)
      .single()
      
    if (!agency) {
      throw new Error('Could not find and agency to upsert the subscription')
    }

    const data = {
      active: subscription.status === 'active',
      agencyId: agency.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000).toISOString(),
      //@ts-ignore
      priceId: subscription.plan.id,
      subscritiptionId: subscription.id,
      //@ts-ignore
      plan: subscription.plan.id,
    }

    const { data: res, error } = await supabase
      .from('Subscription')
      .upsert(data, {
        onConflict: 'agencyId'
      })
      .select()
      .single()
      
    if (error) {
      console.error('Error upserting subscription:', error)
      return
    }
    
    console.log(`🟢 Created Subscription for ${subscription.id}`)
  } catch (error) {
    console.log('🔴 Error from Create action', error)
  }
}

export const getConnectAccountProducts = async (stripeAccount: string) => {
  const products = await stripe.products.list(
    {
      limit: 50,
      expand: ['data.default_price'],
    },
    {
      stripeAccount,
    }
  )
  return products.data
}
