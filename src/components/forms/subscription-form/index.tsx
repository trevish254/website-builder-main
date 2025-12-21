'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import React, { useState } from 'react'

type Props = {
  selectedPriceId: string
  email: string
}

const SubscriptionForm = ({ selectedPriceId, email }: Props) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [priceError, setPriceError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPriceId) {
      setPriceError('You need to select a plan to subscribe.')
      return
    }
    if (!email) {
      setPriceError('User email is missing. Please try again or contact support.')
      return
    }

    setPriceError('')
    setLoading(true)

    try {
      const response = await fetch('/api/paystack/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          planCode: selectedPriceId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.authorization_url) {
        throw new Error(data.message || 'Failed to initialize payment')
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: 'Could not initiate payment. Please try again later.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">
          You will be redirected to Paystack to complete your payment securely.
        </p>
      </div>
      <Button
        disabled={loading || !selectedPriceId}
        className="mt-4 w-full"
      >
        {loading ? 'Initializing...' : 'Pay with Paystack'}
      </Button>
    </form>
  )
}
export default SubscriptionForm
