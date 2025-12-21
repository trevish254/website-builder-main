import { Layers } from 'lucide-react'

const AddonsPage = () => {
    return (
        <div className="flex flex-col gap-10 pb-20 p-4 md:p-8 relative min-h-[80vh]">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Add-ons</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Extend your agency's capabilities with powerful modular add-ons. Custom features, advanced integrations, and more.
                </p>
                <div className="h-1 w-20 bg-emerald-500 rounded-full" />
            </div>

            <div className="flex-1 flex items-center justify-center p-20 border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground bg-card/10 backdrop-blur-sm">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <Layers className="w-10 h-10 text-emerald-500 opacity-80" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">Coming Soon</p>
                    <p className="text-muted-foreground leading-relaxed">
                        We're currently building a marketplace of powerful extensions to help you scale your operations faster. Stay tuned for the launch!
                    </p>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    )
}

export default AddonsPage
