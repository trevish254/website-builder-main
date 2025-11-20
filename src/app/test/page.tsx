'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('User')
          .select('count')
          .limit(1)

        if (error) {
          setError(`Database Error: ${error.message}`)
          setStatus('Failed')
        } else {
          setStatus('Success! Database connection working')
        }
      } catch (err) {
        setError(`Connection Error: ${err}`)
        setStatus('Failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        {error && (
          <div className="text-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}
        <div>
          <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </div>
        <div>
          <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}
        </div>
      </div>
    </div>
  )
}
