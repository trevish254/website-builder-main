// Environment Configuration
// This file controls which KRA environment to use

export const ENVIRONMENT_CONFIG = {
  // Set to 'PRODUCTION' when ready to go live
  CURRENT_ENV: 'SANDBOX' as 'SANDBOX' | 'PRODUCTION',
  
  // Production credentials (set these in your .env.local file)
  PRODUCTION_CREDENTIALS: {
    CONSUMER_KEY: process.env.KRA_CONSUMER_KEY || '',
    CONSUMER_SECRET: process.env.KRA_CONSUMER_SECRET || '',
    APIGEE_APP_ID: '593e6bdf-2300-430e-b855-8ae14358db0e'
  },
  
  // Sandbox credentials (for testing)
  SANDBOX_CREDENTIALS: {
    CONSUMER_KEY: 'i9Gj8fq4zQYOa4SkSLmC2nl4HzzWfi6mGlMCUDEMIrg8clNW',
    CONSUMER_SECRET: 'NxbMe67PSG6HWYxEBl8ocMQ4zYXU9QO3sPrErv6vnsRehPPvwijGbjjtDWYmTaAz',
    APIGEE_APP_ID: 'sandbox-app-id'
  }
}

// Helper function to get current environment
export const getCurrentEnvironment = () => {
  return ENVIRONMENT_CONFIG.CURRENT_ENV
}

// Helper function to check if production is active
export const isProduction = () => {
  return ENVIRONMENT_CONFIG.CURRENT_ENV === 'PRODUCTION'
}

// Helper function to get credentials for current environment
export const getCurrentCredentials = () => {
  return ENVIRONMENT_CONFIG.CURRENT_ENV === 'PRODUCTION' 
    ? ENVIRONMENT_CONFIG.PRODUCTION_CREDENTIALS
    : ENVIRONMENT_CONFIG.SANDBOX_CREDENTIALS
}
