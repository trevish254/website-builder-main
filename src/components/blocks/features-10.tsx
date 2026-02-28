import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Calendar, LucideIcon, MapIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function FeaturesGrid() {
    return (
        <section className="py-16 md:py-32 bg-transparent">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto grid gap-6 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={MapIcon}
                                title="Real time location tracking"
                                description="Advanced tracking system, Instantly locate all your assets."
                            />
                        </CardHeader>

                        <div className="relative mb-6 border-t border-dashed sm:mb-0">
                            <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)] dark:[background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),black_125%)]"></div>
                            <div className="aspect-[76/59] p-1 px-6">
                                <DualModeImage
                                    darkSrc="https://tailark.com/_next/image?url=%2Fpayments.png&w=3840&q=75"
                                    lightSrc="https://tailark.com/_next/image?url=%2Fpayments-light.png&w=3840&q=75"
                                    alt="payments illustration"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Calendar}
                                title="Advanced Scheduling"
                                description="Scheduling system, Instantly locate all your assets."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-[76/59] border border-border/50 rounded-xl overflow-hidden shadow-2xl">
                                    <DualModeImage
                                        darkSrc="https://tailark.com/_next/image?url=%2Forigin-cal-dark.png&w=3840&q=75"
                                        lightSrc="https://tailark.com/_next/image?url=%2Forigin-cal.png&w=3840&q=75"
                                        alt="calendar illustration"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-12 max-w-5xl text-balance text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Smart scheduling with automated reminders for maintenance.</p>

                        <div className="flex justify-center gap-12 overflow-hidden pb-8">
                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Join"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Exclusion"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-[32px] overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:border-primary/20', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-4 border-l-2 border-t-2 rounded-tl-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className="border-primary absolute -right-px -top-px block size-4 border-r-2 border-t-2 rounded-tr-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-4 border-b-2 border-l-2 rounded-bl-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-4 border-b-2 border-r-2 rounded-br-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-2">
        <span className="text-primary flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-6 text-2xl font-bold leading-tight">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <img
            src={darkSrc}
            className={cn('hidden dark:block w-full h-full object-cover', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
        <img
            src={lightSrc}
            className={cn('shadow dark:hidden w-full h-full object-cover', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-primary/20 size-fit rounded-full to-transparent p-px">
            <div className="bg-card/50 backdrop-blur-xl relative flex aspect-square w-fit items-center -space-x-4 rounded-full p-6 shadow-xl border border-border/50">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-10 rounded-full border-2 transition-transform duration-500 hover:scale-110 sm:size-12', {
                            'border-primary/50 bg-primary/10': circle.pattern === 'none',
                            'border-primary/50 bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)/0.2),hsl(var(--primary)/0.2)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-primary/20 bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)/0.5),hsl(var(--primary)/0.5)_2px,transparent_2px,transparent_6px)]': circle.pattern === 'primary',
                            'bg-blue-500/20 z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,theme(colors.blue.500),theme(colors.blue.500)_2px,transparent_2px,transparent_6px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-4 block text-center text-sm font-semibold uppercase tracking-wider">{label}</span>
    </div>
)
