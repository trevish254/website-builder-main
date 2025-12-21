import { paystack } from './src/lib/paystack'

async function checkCustomerTrans() {
    const customerCode = 'CUS_ybcdcbpbs20lws1'
    console.log('--- CHECKING TRANSACTIONS FOR:', customerCode, '---')
    const res = await paystack.listTransactions(customerCode)
    console.log('STATUS:', res.status)
    if (res.status && res.data) {
        console.log('TRANS_COUNT:', res.data.length)
        console.log('TRANS_DATA:', JSON.stringify(res.data, null, 2))
    } else {
        console.log('ERROR:', res.message)
    }
}

checkCustomerTrans()
