// KRA API Configuration
// This file contains the KRA API credentials and configuration

export const KRA_CONFIG = {
  // Sandbox environment (for testing)
  SANDBOX: {
    domain: 'Sandbox',
    baseUrl: 'https://sandbox.kra.go.ke/api',
    consumerKey: 'i9Gj8fq4zQYOa4SkSLmC2nl4HzzWfi6mGlMCUDEMIrg8clNW',
    consumerSecret: 'NxbMe67PSG6HWYxEBl8ocMQ4zYXU9QO3sPrErv6vnsRehPPvwijGbjjtDWYmTaAz',
    product: 'NIL Return Filing',
    apigeeAppId: 'sandbox-app-id'
  },
  
  // Production environment (LIVE!)
  PRODUCTION: {
    domain: 'Production',
    baseUrl: 'https://api.kra.go.ke/api',
    consumerKey: process.env.KRA_CONSUMER_KEY || '',
    consumerSecret: process.env.KRA_CONSUMER_SECRET || '',
    product: 'NIL Return Filing',
    apigeeAppId: '593e6bdf-2300-430e-b855-8ae14358db0e'
  }
}

// Current environment (change to PRODUCTION when ready for live)
export const CURRENT_ENV = 'SANDBOX' // Change to 'PRODUCTION' when ready to go live

// Get current configuration
export const getKRAConfig = () => {
  return KRA_CONFIG[CURRENT_ENV as keyof typeof KRA_CONFIG]
}

// API Endpoints
export const KRA_ENDPOINTS = {
  // Sandbox endpoints (matching KRA TC002 exactly)
  SANDBOX: {
    NIL_RETURN: 'https://sbx.kra.go.ke/dtd/return/v1/nil',
    PIN_VERIFY: 'https://sbx.kra.go.ke/dtd/pin/verify',
    OBLIGATIONS: 'https://sbx.kra.go.ke/dtd/obligations/fetch',
    TCC_CHECKER: 'https://sbx.kra.go.ke/dtd/tcc/check',
    EXCISE_LICENSE: 'https://sbx.kra.go.ke/dtd/excise-license/check'
  },
  // Production endpoints
  PRODUCTION: {
    NIL_RETURN: 'https://api.kra.go.ke/dtd/return/v1/nil',
    PIN_VERIFY: 'https://api.kra.go.ke/dtd/pin/verify',
    OBLIGATIONS: 'https://api.kra.go.ke/dtd/obligations/fetch',
    TCC_CHECKER: 'https://api.kra.go.ke/dtd/tcc/check',
    EXCISE_LICENSE: 'https://api.kra.go.ke/dtd/excise-license/check'
  }
}

// Get current endpoints based on environment
export const getKRAEndpoints = () => {
  return KRA_ENDPOINTS[CURRENT_ENV as keyof typeof KRA_ENDPOINTS]
}

// Obligation Codes for different tax types
export const OBLIGATION_CODES = {
  INCOME_TAX_COMPANY: '4',      // Income Tax - Company
  INCOME_TAX_PAYE: '7',         // Income Tax - PAYE
  VALUE_ADDED_TAX: '9',         // Value Added Tax (VAT)
  INCOME_TAX_WITHHOLDING: '6'   // Income Tax - Withholding
} as const

// Response Codes
export const KRA_RESPONSE_CODES = {
  SUCCESS: '82000',
  XML_SYNTAX_ERROR: '82001',
  DATA_VALIDATION_ERROR: '82002',
  HASH_VALIDATION_ERROR: '82003',
  AUTHENTICATION_ERROR: '82004'
} as const

// PIN Format Validation
export const PIN_FORMATS = {
  INDIVIDUAL: /^[A-Z]\d{9}[A-Z]$/,  // A123456789M
  COMPANY: /^[P-Z]\d{9}[A-Z]$/,      // P123456789K
  PARTNERSHIP: /^[A-Z]\d{9}[A-Z]$/   // Same as individual
}

// Tax Types
export const TAX_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company', 
  PARTNERSHIP: 'partnership'
} as const

export type TaxType = typeof TAX_TYPES[keyof typeof TAX_TYPES]
