import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return <SignIn routing="path" path="/agency/sign-in" />
}

export default Page
