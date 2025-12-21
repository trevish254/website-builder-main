import { paystack } from './src/lib/paystack'

async function checkPaystackTransactions() {
    const email = 'trevormurithi254@gmail.com'
    console.log('--- CHECKING PAYSTACK TRANSACTIONS FOR:', email, '---')
    const res = await paystack.listTransactions(email)
    console.log('STATUS:', res.status)
    if (res.status && res.data) {
        console.log('TRANS_COUNT:', res.data.length)
        console.log('TRANS_DATA:', JSON.stringify(res.data, null, 2))
    } else {
        console.log('ERROR:', res.message)
    }
}

checkPaystackTransactions()
