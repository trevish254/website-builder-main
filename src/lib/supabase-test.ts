// Test file to verify Supabase connection
import { supabase } from './supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('User')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      console.error('📋 Error details:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Connection test result:', data)
    return true
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    return false
  }
}

export const testAgencyTable = async () => {
  try {
    console.log('🔍 Testing Agency table access...')
    
    // Test if Agency table exists and is accessible
    const { data, error } = await supabase
      .from('Agency')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Agency table access failed:', error.message)
      return false
    }
    
    console.log('✅ Agency table is accessible!')
    console.log('📊 Current agencies:', data?.length || 0)
    return true
  } catch (error) {
    console.error('❌ Agency table test failed:', error)
    return false
  }
}
