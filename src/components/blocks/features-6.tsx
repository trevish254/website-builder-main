import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'

export function Features() {
    return (
        <section id="features" className="py-16 md:py-32">
            <div className="mx-auto max-w-7xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold">The Chapabiz ecosystem brings together your agency tools</h2>
                    <p className="max-w-sm sm:ml-auto text-muted-foreground">Empower your team with streamlined workflows and powerful automation, all within a unified platform designed for modern agency owners.</p>
                </div>
                <div className="relative rounded-3xl p-3 md:-mx-8 lg:col-span-3">
                    <div
                        className="aspect-[88/45] relative overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-muted/50 dark:bg-black"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                        }}
                    >
                        <img
                            src="/assets/preview.png"
                            className="absolute inset-0 z-10 w-full h-full object-cover object-top"
                            alt="Chapabiz Dashboard Preview"
                        />
                        {/* Extra gradient overlays for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none"></div>
                    </div>
                </div>

                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Fast</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Rapidly build and deploy high-converting funnels with our drag-and-drop editor.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Manage unlimited pipelines and sub-accounts with ease using our robust infrastructure.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Enterprise-grade security and permissions to protect your agency and client data.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-primary" />
                            <h3 className="text-sm font-medium">AI Powered</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Leverage cutting-edge AI to optimize your marketing strategies and client interactions.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
