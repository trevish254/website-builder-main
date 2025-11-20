import { ModeToggle } from '@/components/global/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navigation = async () => {
  const user = await currentUser()
  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10 bg-background/80 backdrop-blur-sm border-b">
      <aside className="flex items-center gap-2">
        <Image
          src={'/assets/plura-logo.svg'}
          width={40}
          height={40}
          alt="plur logo"
        />
        <span className="text-xl font-bold"> Plura.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={'#pricing'} className="text-foreground hover:text-primary transition-colors">Pricing</Link>
          <Link href={'#features'} className="text-foreground hover:text-primary transition-colors">Features</Link>
          <Link href={'#about'} className="text-foreground hover:text-primary transition-colors">About</Link>
          <Link href={'#contact'} className="text-foreground hover:text-primary transition-colors">Contact</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        {user ? (
          <>
            <Link
              href={'/agency'}
              className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
            >
              Dashboard
            </Link>
            <UserButton />
          </>
        ) : (
          <>
            <Link
              href={'/agency/sign-in'}
              className="text-foreground p-2 px-4 rounded-md hover:bg-muted"
            >
              Sign In
            </Link>
            <Link
              href={'/agency/sign-up'}
              className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
            >
              Get Started
            </Link>
          </>
        )}
        <ModeToggle />
      </aside>
    </div>
  )
}

export default Navigation
