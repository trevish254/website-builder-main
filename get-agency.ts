import { supabase } from './src/lib/supabase'

async function getAgency() {
    const { data, error } = await supabase.from('Agency').select('id, companyEmail').limit(1).single()
    if (error) {
        console.error('Error:', error)
        return
    }
    console.log('FULL_ID_' + data.id + '_END')
}

getAgency()
