import { paystack } from './src/lib/paystack'

async function checkPlan() {
    const planCode = 'PLN_94lyi50x08ydc2u'
    console.log('--- CHECKING PLAN:', planCode, '---')
    // We don't have a fetchPlan utility, so let's use fetch directly
    const res = await fetch(`https://api.paystack.co/plan/${planCode}`, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    })
    const data = await res.json()
    console.log('PLAN_DATA:', JSON.stringify(data, null, 2))
}

checkPlan()
