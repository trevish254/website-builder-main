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
    <main className="flex flex-col items-center justify-center w-full bg-background transition-colors duration-500">
      <section className="h-full w-full pt-20 md:pt-40 relative flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        <div className="absolute inset-0 -z-10 h-full w-full opacity-[0.03] dark:opacity-[0.05] [background-image:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:4rem_4rem]"></div>

        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24 items-center">
            <div className="flex flex-col gap-8 text-left px-4 md:pl-20 2xl:pl-40 lg:-mt-24">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-white/10 px-4 py-1.5 text-sm text-primary dark:text-white/80 font-medium w-fit border border-primary/20 dark:border-white/20 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary dark:bg-purple-500 animate-pulse" />
                Run your agency, in one place
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.2] font-futuristic">
                The All-in-One <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                  Agency Solution
                </span>
              </h1>
              <p className="text-muted-foreground text-xl md:text-2xl max-w-[600px] leading-relaxed">
                Scale your operations, manage pipelines, and build high-converting funnels with the platform designed for modern agency owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href="/agency"
                  className="bg-primary text-primary-foreground p-4 px-10 rounded-xl hover:opacity-90 transition-all text-lg font-bold text-center shadow-lg shadow-primary/20"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#pricing"
                  className="bg-background border border-border text-foreground p-4 px-10 rounded-xl hover:bg-accent transition-all text-lg font-bold text-center shadow-sm"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center w-full lg:overflow-visible pr-0 lg:pr-10">
              <div className="w-full lg:translate-x-12 translate-x-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <ThreeDMarqueeDemo />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-20"></div>
      </section>

      <div className="flex flex-col justify-center items-center relative w-full px-4 md:px-0 mt-32 mb-20 z-30">
        <div className="mb-10 w-full max-w-4xl">
          <MorphingText texts={["Welcome to", "CHAPABIZ"]} className="text-primary dark:text-white font-futuristic" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/20 dark:bg-primary/40 w-[80%] h-[60%] blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative group max-w-[1200px] w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl transition duration-1000 group-hover:duration-200"></div>
          <Image
            src="/assets/preview.png"
            alt="Dashboard Preview"
            width={1200}
            height={800}
            className="rounded-xl border border-border/50 shadow-2xl relative z-10 bg-background/50 backdrop-blur-sm"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"></div>
      </div>

      <div className="w-full overflow-hidden border-y border-border/50 bg-accent/30 py-10">
        <TextCarouselDemo />
      </div>

      <div className="w-full overflow-hidden">
        <FeatureSectionDemo />
      </div>

      <div className="flex flex-col justify-center items-center relative w-full gap-10 mt-40 overflow-x-hidden">
        <HeroParallaxDemo />
        <div className="bottom-0 top-[50%] bg-gradient-to-t from-background to-transparent left-0 right-0 absolute z-10"></div>
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
      <section id="pricing" className="flex justify-center items-center flex-col gap-6 md:!mt-32 px-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-center">Plan that scales with you</h2>
        </div>
        <p className="text-muted-foreground text-center max-w-lg text-lg">
          Our straightforward pricing plans are tailored to meet your needs. If
          {" you're"} not ready to commit you can get started for free.
        </p>
        <div className="flex justify-center gap-6 flex-wrap mt-10">
          {prices.data.map((card) => (
            //WIP: Wire up free product from stripe
            <Card
              key={card.nickname}
              className={clsx('w-[350px] flex flex-col justify-between border-border/50 shadow-xl transition-all hover:border-primary/50', {
                'border-2 border-primary shadow-primary/10 scale-105 z-10': card.nickname === 'Unlimited Saas',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx('text-2xl font-bold', {
                    'text-primary': card.nickname === 'Unlimited Saas',
                  })}
                >
                  {card.nickname}
                </CardTitle>
                <CardDescription className="text-base">
                  {
                    pricingCards.find((c) => c.title === card.nickname)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">
                    {card.unit_amount && card.unit_amount / 100}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    / {card.recurring?.interval}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-6">
                <div className="space-y-3 w-full">
                  {pricingCards
                    .find((c) => c.title === card.nickname)
                    ?.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex gap-3 items-center text-sm"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <p className="text-foreground/80">{feature}</p>
                      </div>
                    ))}
                </div>
                <Link
                  href={`/agency?plan=${card.id}`}
                  className={clsx(
                    'w-full text-center p-3 rounded-xl font-bold transition-all shadow-md',
                    {
                      'bg-primary text-primary-foreground hover:opacity-90': card.nickname === 'Unlimited Saas',
                      'bg-secondary text-secondary-foreground hover:bg-secondary/80': card.nickname !== 'Unlimited Saas',
                    }
                  )}
                >
                  Get Started
                </Link>
              </CardFooter>
            </Card>
          ))}
          <Card className={clsx('w-[350px] flex flex-col justify-between border-border/50 shadow-xl transition-all hover:border-primary/50')}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{pricingCards[0].title}</CardTitle>
              <CardDescription className="text-base">{pricingCards[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                <span className="text-muted-foreground font-medium">/ month</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-6">
              <div className="space-y-3 w-full">
                {pricingCards
                  .find((c) => c.title === 'Starter')
                  ?.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex gap-3 items-center text-sm"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <p className="text-foreground/80">{feature}</p>
                    </div>
                  ))}
              </div>
              <Link
                href="/agency"
                className="w-full text-center bg-secondary text-secondary-foreground p-3 rounded-xl font-bold transition-all hover:bg-secondary/80 shadow-md"
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
