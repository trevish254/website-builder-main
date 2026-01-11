'use client'

/**
 * Template Admin Page
 * Seed and manage default templates
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Upload, Trash2 } from 'lucide-react'

export default function TemplateAdminPage() {
    const [loading, setLoading] = useState(false)

    const handleSeedTemplates = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/templates/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: 'Success',
                    description: data.message || 'Templates seeded successfully'
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: data.error || 'Failed to seed templates'
                })
            }
        } catch (error) {
            console.error('Error seeding templates:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to seed templates'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Template Administration</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage default website templates
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Seed Default Templates</CardTitle>
                        <CardDescription>
                            Add the default premium templates to the database. This will skip templates that already exist.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <h4 className="font-medium mb-2">Templates to be seeded:</h4>
                                <ul className="text-sm space-y-1 text-muted-foreground">
                                    <li>• Manufacturing Excellence (Business)</li>
                                    <li className="text-xs italic">More templates coming soon...</li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleSeedTemplates}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Seeding Templates...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Seed Templates
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Template Information</CardTitle>
                        <CardDescription>
                            Details about the template system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-1">Manufacturing Excellence</h4>
                                <p className="text-muted-foreground">
                                    A modern, professional template for manufacturing and technology companies.
                                    Features hero section with stats, services grid, benefits showcase, pricing plans, and more.
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">Business</span>
                                    <span className="px-2 py-1 bg-muted rounded text-xs">7 Sections</span>
                                    <span className="px-2 py-1 bg-muted rounded text-xs">Responsive</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="font-medium text-amber-900 mb-2">⚠️ Important Notes</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Templates will be available in the "Start with Template" section</li>
                        <li>• Existing templates with the same name will be skipped</li>
                        <li>• Templates are marked as public by default</li>
                        <li>• After seeding, refresh the websites page to see templates</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
