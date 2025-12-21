import { supabase } from './src/lib/supabase'

async function checkAgencies() {
    const { data, error } = await supabase.from('Agency').select('id, name, companyEmail, Subscription(*)').limit(10)
    if (error) {
        console.error('Error:', error)
        return
    }
    console.log('AGENCIES:', JSON.stringify(data, null, 2))
}

checkAgencies()
