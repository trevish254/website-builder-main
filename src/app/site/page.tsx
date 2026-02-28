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
import { HeroSection } from '@/components/blocks/hero-section-5'
import { Features as FeaturesIntro } from '@/components/blocks/features-6'
import { FeaturesGrid } from '@/components/blocks/features-10'
import { OperationsDelivery } from '@/components/blocks/features-8'
import SectionWithMockup from '@/components/blocks/section-with-mockup'
import { AboutSection } from '@/components/ui/about-section'
import { HeroParallaxDemo } from '@/components/site/hero-parallax-demo'
import { Footer } from '@/components/ui/footer-section'
import { HeroScrollDemo } from '@/components/site/hero-scroll-demo'
import { ZoomParallaxDemo } from '@/components/site/zoom-parallax-demo'
import { ThreeDPhotoCarouselDemo } from '@/components/site/3d-carousel-demo'
import { TextCarouselDemo } from '@/components/site/text-carousel'
import { MorphingText } from '@/components/ui/morphing-text'
import { BigStackDemo } from '@/components/site/big-stack-demo'
import { DisplayCardsDemo } from '@/components/site/display-cards-demo'
import AnimatedCardStack from '@/components/ui/animate-card-animation'
import { Process } from '@/components/site/cards-stack-demo'
import { TrustHero } from '@/components/ui/glassmorphism-trust-hero'
import { IntroductionVideoDemo } from '@/components/site/introduction-video'
import ReleaseTimeLineDemo from '@/components/site/release-time-line-demo'
import ContactCardDemo from '@/components/site/contact-card-demo'
import BentoCardsAbout from '@/components/site/bento-cards-about'
import FeatureSectionDemo from '@/components/site/feature-section-demo'

import { Testimonial } from '@/components/ui/design-testimonial'

export default async function Home() {
  // Stripe is disabled, using static pricing
  const prices = { data: [] }

  return (
    <main className="flex flex-col w-full bg-background transition-colors duration-500">
      {/* New animated hero section with floating header, video background, and brand logos */}
      <HeroSection />

      {/* Redesigned Intro Section with ecosystem and feature highlights */}
      <FeaturesIntro />

      <div className="w-full overflow-hidden border-y border-border/50 bg-accent/30 py-10">
        <TextCarouselDemo />
      </div>

      <div className="w-full overflow-hidden">
        <FeatureSectionDemo />
      </div>

      <section className="w-full">
        <AboutSection />
      </section>
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

      <section className="w-full overflow-hidden">
        <OperationsDelivery />
      </section>

      <section className="w-full">
        <SectionWithMockup
          title={
            <>
              Agency Intelligence,
              <br />
              delivered to you.
            </>
          }
          description={
            <>
              Get a tailored Monday morning brief directly in
              <br />
              your inbox, crafted by your virtual personal
              <br />
              analyst, spotlighting essential lead stories
              <br />
              and conversion trends for the week ahead.
            </>
          }
          primaryImageSrc="/assets/preview.png"
          secondaryImageSrc="https://www.fey.com/marketing/_next/static/media/newsletter-desktop-1_4x.9cc114e6.png"
        />
      </section>

      <FeaturesGrid />

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

      <div className="container mx-auto px-4">
        <TrustHero />
      </div>

      <ReleaseTimeLineDemo />
      <section className="mt-20 w-full overflow-hidden">
        <ThreeDPhotoCarouselDemo />
      </section>
      <div id="about">
        <BentoCardsAbout />
      </div>

      <Testimonial />
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
