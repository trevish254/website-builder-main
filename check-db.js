
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCounts() {
    const { count: contactsCount } = await supabase.from('Contact').select('*', { count: 'exact', head: true })
    const { count: ordersCount } = await supabase.from('Order').select('*', { count: 'exact', head: true })

    console.log('Contacts Count:', contactsCount)
    console.log('Orders Count:', ordersCount)

    if (ordersCount > 0) {
        const { data: orders } = await supabase.from('Order').select('customerEmail').limit(10)
        console.log('Sample Order Emails:', orders.map(o => o.customerEmail))
    }

    if (contactsCount > 0) {
        const { data: contacts } = await supabase.from('Contact').select('email').limit(10)
        console.log('Sample Contact Emails:', contacts.map(c => c.email))
    }
}

checkCounts()
