import { paystack } from './src/lib/paystack'

async function checkAllTrans() {
    const email = 'trevormurithi254@gmail.com'
    console.log('--- CHECKING ALL RECENT TRANSACTIONS ---')
    const res = await paystack.listTransactions()
    console.log('STATUS:', res.status)
    if (res.status && Array.isArray(res.data)) {
        console.log('TOTAL_FETCHED:', res.data.length)
        const userTrans = res.data.filter((t: any) =>
            t.customer?.email?.toLowerCase() === email.toLowerCase()
        )
        console.log('MATCHED_FOR_EMAIL:', userTrans.length)
        if (userTrans.length > 0) {
            console.log('FIRST_MATCHED_TRANS:', JSON.stringify(userTrans[0], null, 2))
        } else {
            console.log('NO MATCHES. LATEST 5 EMAILS IN PAYSTACK:')
            res.data.slice(0, 5).forEach((t: any) => console.log(' -', t.customer?.email))
        }
    } else {
        console.log('ERROR:', res.message)
    }
}

checkAllTrans()
