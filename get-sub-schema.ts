import { supabase } from './src/lib/supabase'

async function getSubscriptionSchema() {
    const { data, error } = await supabase.from('Subscription').select('*').limit(1)
    if (error) {
        console.error('Error:', error)
        return
    }
    if (data && data.length > 0) {
        console.log('FIELDS:', Object.keys(data[0]).join(', '))
        console.log('SAMPLE_DATA:', JSON.stringify(data[0], null, 2))
    } else {
        console.log('No subscriptions found.')
    }
}

getSubscriptionSchema()
