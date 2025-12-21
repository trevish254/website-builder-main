import { supabase } from './src/lib/supabase'

async function checkSpecificAgencySubs() {
    const agencyId = '166ee396-047f-4796-8a5c-2b3a791a71f2'
    console.log('--- CHECKING SUBS FOR AGENCY:', agencyId, '---')
    const { data, error } = await supabase.from('Subscription').select('*').eq('agencyId', agencyId)
    if (error) {
        console.error('Error:', error)
        return
    }
    console.log('SUBS:', JSON.stringify(data, null, 2))
}

checkSpecificAgencySubs()
