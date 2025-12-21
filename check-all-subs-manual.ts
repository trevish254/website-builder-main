import { paystack } from './src/lib/paystack'

async function checkAllSubs() {
    const customerCode = 'CUS_ybcdcbpbs20lws1'
    console.log('--- CHECKING ALL RECENT SUBSCRIPTIONS ---')
    const res = await paystack.listSubscriptions()
    console.log('STATUS:', res.status)
    if (res.status && Array.isArray(res.data)) {
        console.log('TOTAL_FETCHED:', res.data.length)
        const userSubs = res.data.filter((s: any) =>
            s.customer?.customer_code === customerCode
        )
        console.log('MATCHED_FOR_CODE:', userSubs.length)
        if (userSubs.length > 0) {
            console.log('FIRST_MATCHED_SUB:', JSON.stringify(userSubs[0], null, 2))
        } else {
            console.log('NO MATCHES. LATEST 5 CUSTOMER CODES IN SUBS:')
            res.data.slice(0, 5).forEach((s: any) => console.log(' -', s.customer?.customer_code))
        }
    } else {
        console.log('ERROR:', res.message)
    }
}

checkAllSubs()
