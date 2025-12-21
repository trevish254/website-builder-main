import { paystack } from './src/lib/paystack'

async function checkAllUserSubs() {
    const customerCode = 'CUS_ybcdcbpbs20lws1'
    console.log('--- CHECKING ALL SUBSCRIPTIONS FOR:', customerCode, '---')
    const res = await paystack.listSubscriptions()
    if (res.status && Array.isArray(res.data)) {
        const userSubs = res.data.filter((s: any) =>
            s.customer?.customer_code === customerCode
        )
        console.log('MATCHED_COUNT:', userSubs.length)
        userSubs.forEach((s: any, i: number) => {
            console.log(`SUB #${i + 1}: Status: ${s.status}, Plan: ${s.plan.name} (${s.plan.plan_code})`)
        })
    } else {
        console.log('ERROR:', res.message)
    }
}

checkAllUserSubs()
