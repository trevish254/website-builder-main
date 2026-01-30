import africastalking from 'africastalking'

const credentials = {
    apiKey: process.env.AT_API_KEY || '',
    username: process.env.AT_USERNAME || 'sandbox',
}

// Initialize the SDK
const at = africastalking(credentials)

export const sms = at.SMS
export const voice = at.VOICE
export const airtime = at.AIRTIME
export const payments = at.PAYMENTS

export default at
