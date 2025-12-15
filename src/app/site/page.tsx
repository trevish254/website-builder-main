import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/lib/constants'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ThreeDMarqueeDemo } from '@/components/site/three-d-marquee-demo'
import { HeroParallaxDemo } from '@/components/site/hero-parallax-demo'
import { Footer } from '@/components/ui/footer-section'
import { HeroScrollDemo } from '@/components/site/hero-scroll-demo'
import { ZoomParallaxDemo } from '@/components/site/zoom-parallax-demo'
import { FullScreenScrollDemo } from '@/components/site/full-screen-scroll-demo'
import { ThreeDPhotoCarouselDemo } from '@/components/site/3d-carousel-demo'

export default async function Home() {
  // Stripe is disabled, using static pricing
  const prices = { data: [] }

  return (
    <>
      <section className="h-full w-full md:pt-44 mt-[-70px] relative flex items-center justify-center flex-col ">
        {/* grid */}

        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

        <p className="text-center">Run your agency, in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Plura
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center relative md:mt-[-70px] w-full gap-10">
          <ThreeDMarqueeDemo />
          <HeroParallaxDemo />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section id="features" className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">Powerful Features for Your Agency</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Streamline your agency operations with our comprehensive suite of tools designed for modern businesses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Pipeline Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and manage unlimited pipelines to track your leads and deals effectively.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Invite team members and manage permissions across multiple sub-accounts.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Funnel Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build high-converting sales funnels with our drag-and-drop editor.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <HeroScrollDemo />
      </section>
      <section className="mt-[-60px]">
        <ZoomParallaxDemo />
      </section>
      <section className="mt-[-60px] relative z-[20]">
        <FullScreenScrollDemo />
      </section>
      <section className="mt-20">
        <ThreeDPhotoCarouselDemo />
      </section>
      <section id="about" className="flex justify-center items-center flex-col gap-4 md:!mt-20">
        <h2 className="text-4xl text-center">About Plura</h2>
        <p className="text-muted-foreground text-center max-w-3xl">
          Plura is the all-in-one platform designed specifically for agencies looking to scale their operations.
          From lead management to team collaboration, we provide the tools you need to run your agency efficiently.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              To empower agencies with the tools they need to focus on what matters most - growing their business and serving their clients.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Why Choose Plura</h3>
            <p className="text-muted-foreground">
              Built by agency owners for agency owners, Plura understands the unique challenges of running a modern agency.
            </p>
          </div>
        </div>
      </section>
      <section id="pricing" className="flex justify-center items-center flex-col gap-4 md:!mt-20">
        <h2 className="text-4xl text-center"> Choose what fits you right</h2>
        <p className="text-muted-foreground text-center">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not <br />
          ready to commit you can get started for free.
        </p>
        <div className="flex  justify-center gap-4 flex-wrap mt-6">
          {prices.data.map((card) => (
            //WIP: Wire up free product from stripe
            <Card
              key={card.nickname}
              className={clsx('w-[300px] flex flex-col justify-between', {
                'border-2 border-primary': card.nickname === 'Unlimited Saas',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('', {
                    'text-muted-foreground': card.nickname !== 'Unlimited Saas',
                  })}
                >
                  {card.nickname}
                </CardTitle>
                <CardDescription>
                  {
                    pricingCards.find((c) => c.title === card.nickname)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {card.unit_amount && card.unit_amount / 100}
                </span>
                <span className="text-muted-foreground">
                  <span>/ {card.recurring?.interval}</span>
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {pricingCards
                    .find((c) => c.title === card.nickname)
                    ?.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex gap-2"
                      >
                        <Check />
                        <p>{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.id}`}
                  className={clsx(
                    'w-full text-center bg-primary p-2 rounded-md',
                    {
                      '!bg-muted-foreground':
                        card.nickname !== 'Unlimited Saas',
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
          <Card className={clsx('w-[300px] flex flex-col justify-between')}>
            <CardHeader>
              <CardTitle
                className={clsx({
                  'text-muted-foreground': true,
                })}
              >
                {pricingCards[0].title}
              </CardTitle>
              <CardDescription>{pricingCards[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">$0</span>
              <span>/ month</span>
            </CardContent>
            <CardFooter className="flex flex-col  items-start gap-4 ">
              <div>
                {pricingCards
                  .find((c) => c.title === 'Starter')
                  ?.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-2"
                    >
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
              </div>
              <Link
                href="/agency"
                className={clsx(
                  'w-full text-center bg-primary p-2 rounded-md',
                  {
                    '!bg-muted-foreground': true,
                  }
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
      <section id="contact" className="flex justify-center items-center flex-col gap-4 md:!mt-20">
        <h2 className="text-4xl text-center">Get Started Today</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Ready to transform your agency operations? Join thousands of agencies already using Plura to streamline their workflow.
        </p>
        <div className="flex gap-4 mt-8">
          <Link
            href="/agency"
            className="bg-primary text-white p-4 px-8 rounded-md hover:bg-primary/80 text-lg font-semibold"
          >
            Start Free Trial
          </Link>
          <Link
            href="#pricing"
            className="border border-primary text-primary p-4 px-8 rounded-md hover:bg-primary/10 text-lg font-semibold"
          >
            View Pricing
          </Link>
        </div>
      </section>
      <Footer />
    </>
  )
}
