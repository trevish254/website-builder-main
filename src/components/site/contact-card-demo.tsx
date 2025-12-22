"use client";

import { ContactCard } from "@/components/ui/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactCardDemo() {
    return (
        <section className="relative py-20 px-4">
            <div className="mx-auto max-w-6xl">
                <ContactCard
                    title="Ready to Scale Your Agency?"
                    description="Fill out the form below and one of our agency growth specialists will reach out to you within 24 hours. Let's build your high-converting future together."
                    contactInfo={[
                        {
                            icon: MailIcon,
                            label: 'Email',
                            value: 'hello@chapabiz.com',
                        },
                        {
                            icon: PhoneIcon,
                            label: 'Partnership',
                            value: '+1 (555) 012-3456',
                        },
                        {
                            icon: MapPinIcon,
                            label: 'Office',
                            value: 'Innovation Hub, Silicon Valley',
                            className: 'col-span-1 md:col-span-2 lg:col-span-1',
                        }
                    ]}
                >
                    <form action="#" className="w-full space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs uppercase tracking-widest opacity-70">Agency Name</Label>
                            <Input type="text" placeholder="The Growth Co." className="bg-background/50" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs uppercase tracking-widest opacity-70">Work Email</Label>
                            <Input type="email" placeholder="you@agency.com" className="bg-background/50" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs uppercase tracking-widest opacity-70">Your Needs</Label>
                            <Textarea placeholder="Tell us about your current bottlenecks..." className="bg-background/50 min-h-[100px]" />
                        </div>
                        <Button className="w-full text-sm font-bold uppercase tracking-widest h-12" type="button">
                            Get Started Now
                        </Button>
                    </form>
                </ContactCard>
            </div>
        </section>
    );
}
