import { paystack } from './src/lib/paystack'

async function findCustomer() {
    const email = 'trevormurithi254@gmail.com'
    console.log('--- FINDING CUSTOMER:', email, '---')
    const res = await paystack.fetchCustomer(email)
    console.log('STATUS:', res.status)
    if (res.status && res.data) {
        console.log('CUSTOMER_CODE:', res.data.customer_code)
        console.log('CUST_DATA:', JSON.stringify(res.data, null, 2))

        console.log('\n--- CHECKING SUBS WITH CODE ---')
        const subs = await paystack.listSubscriptions(res.data.customer_code)
        console.log('SUBS:', JSON.stringify(subs, null, 2))
    } else {
        console.log('ERROR:', res.message)
    }
}

findCustomer()
