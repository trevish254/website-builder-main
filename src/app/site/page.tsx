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
import { ThreeDPhotoCarouselDemo } from '@/components/site/3d-carousel-demo'
import { Logos3Demo } from '@/components/site/logos3-demo'
import { TextCarouselDemo } from '@/components/site/text-carousel'
import { MorphingText } from '@/components/ui/morphing-text'
import { BigStackDemo } from '@/components/site/big-stack-demo'
import { DisplayCardsDemo } from '@/components/site/display-cards-demo'
import AnimatedCardStack from '@/components/ui/animate-card-animation'
import { Process } from '@/components/site/cards-stack-demo'
import { ClientOnboardingTimeline } from '@/components/site/client-onboarding-timeline'
import { IntroductionVideoDemo } from '@/components/site/introduction-video'
import ReleaseTimeLineDemo from '@/components/site/release-time-line-demo'
import ContactCardDemo from '@/components/site/contact-card-demo'
import BentoCardsAbout from '@/components/site/bento-cards-about'
import FeatureSectionDemo from '@/components/site/feature-section-demo'

export default async function Home() {
  // Stripe is disabled, using static pricing
  const prices = { data: [] }

  return (
    <main className="flex flex-col items-center justify-center w-full">
      <section className="h-full w-full pt-20 md:pt-40 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24 items-center">
            <div className="flex flex-col gap-6 text-left px-4 md:pl-20 2xl:pl-40 lg:-mt-24">
              <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 font-medium w-fit">
                Run your agency, in one place
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                The All-in-One <br className="hidden md:block" />
                Agency Solution
              </h1>
              <p className="text-slate-300 text-xl max-w-[600px]">
                Scale your operations, manage pipelines, and build high-converting funnels with the platform designed for modern agency owners.
              </p>
              <div className="flex flex-row gap-4 mt-6">
                <Link
                  href="/agency"
                  className="bg-white text-black p-3 px-8 rounded-md hover:bg-white/90 text-lg font-semibold text-center w-[200px]"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#pricing"
                  className="bg-transparent border border-white text-white p-3 px-8 rounded-md hover:bg-white/10 text-lg font-semibold text-center w-[200px]"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center w-full lg:overflow-visible pr-0">
              <div className="w-full lg:translate-x-12 translate-x-0">
                <ThreeDMarqueeDemo />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-20"></div>
      </section>

      <div className="flex flex-col justify-center items-center relative w-full px-4 md:px-0 mt-32 mb-20 z-30">
        <div className="mb-10 w-full max-w-4xl">
          <MorphingText texts={["Welcome to", "CHAPABIZ"]} className="text-white" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/40 w-[80%] h-[60%] blur-[120px] rounded-full pointer-events-none"></div>
        <Image
          src="/assets/preview.png"
          alt="Dashboard Preview"
          width={1200}
          height={800}
          className="rounded-xl border border-white/10 shadow-2xl relative z-10"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"></div>
      </div>

      <div className="w-full overflow-hidden">
        <TextCarouselDemo />
      </div>

      <div className="w-full overflow-hidden">
        <FeatureSectionDemo />
      </div>

      <div className="flex flex-col justify-center items-center relative w-full gap-10 mt-40 overflow-x-hidden">
        <HeroParallaxDemo />
        <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
      </div>
      <section id="features" className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px] container mx-auto px-4">
        <h2 className="text-4xl text-center">Powerful Features for Your Agency</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Streamline your agency operations with our comprehensive suite of tools designed for modern businesses.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8 w-full">
          <div className="flex justify-center items-center w-full overflow-hidden">
            <DisplayCardsDemo />
          </div>
          <div className="grid grid-cols-1 gap-8">
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
        </div>
      </section>

      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px] w-full overflow-hidden">
        <HeroScrollDemo />
      </section>

      <section className="w-full">
        <IntroductionVideoDemo />
      </section>

      <div className="w-full space-y-20">
        <Process />
      </div>

      <section className="w-full py-20">
        <AnimatedCardStack />
      </section>

      <section className="mt-[-60px] w-full">
        <ZoomParallaxDemo />
      </section>

      <section className="w-full">
        <BigStackDemo />
      </section>

      <section className="w-full">
        <ClientOnboardingTimeline />
      </section>

      <ReleaseTimeLineDemo />
      <section className="mt-20 w-full overflow-hidden">
        <ThreeDPhotoCarouselDemo />
      </section>
      <div id="about">
        <BentoCardsAbout />
      </div>
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
      <div id="contact" className="mt-20">
        <ContactCardDemo />
      </div>
      <Footer />
    </main >
  )
}
