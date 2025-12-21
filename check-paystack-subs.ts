import { paystack } from './src/lib/paystack'

async function checkPaystackSubs() {
    const email = 'trevormurithi254@gmail.com'
    console.log('--- CHECKING PAYSTACK FOR:', email, '---')
    const res = await paystack.listSubscriptions(email)
    console.log('STATUS:', res.status)
    if (res.status && res.data) {
        console.log('SUBS_COUNT:', res.data.length)
        console.log('SUBS_DATA:', JSON.stringify(res.data, null, 2))
    } else {
        console.log('ERROR:', res.message)
    }
}

checkPaystackSubs()
