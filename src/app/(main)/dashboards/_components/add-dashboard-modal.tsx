'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createDashboard } from '@/lib/dashboard-queries'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type Props = {
    isOpen: boolean
    onClose: () => void
    userId: string
    agencyId?: string | null
    subAccountId?: string | null
    onSuccess: (dashboard: any) => void
}

export default function AddDashboardModal({
    isOpen,
    onClose,
    userId,
    agencyId,
    subAccountId,
    onSuccess,
}: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPrivate: true,
        isDefault: false,
        isFavorite: false,
        template: 'blank',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const dashboard = await createDashboard({
                userId,
                agencyId,
                subAccountId,
                name: formData.name,
                description: formData.description || undefined,
                isPrivate: formData.isPrivate,
                isDefault: formData.isDefault,
                isFavorite: formData.isFavorite,
            })

            if (dashboard) {
                toast.success('Dashboard created successfully')
                onSuccess(dashboard)
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    isPrivate: true,
                    isDefault: false,
                    isFavorite: false,
                    template: 'blank',
                })
            } else {
                toast.error('Failed to create dashboard')
            }
        } catch (error) {
            console.error('Error creating dashboard:', error)
            toast.error('An error occurred while creating the dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Dashboard</DialogTitle>
                    <DialogDescription>
                        Create a customizable dashboard to track your metrics and data
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        {/* Dashboard Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Dashboard Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Sales Dashboard, Marketing Analytics"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what this dashboard is for..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        {/* Privacy Settings */}
                        <div className="space-y-4">
                            <Label>Privacy Settings</Label>
                            <RadioGroup
                                value={formData.isPrivate ? 'private' : 'shared'}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, isPrivate: value === 'private' })
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="private" id="private" />
                                    <Label htmlFor="private" className="font-normal cursor-pointer">
                                        <div>
                                            <div className="font-medium">Private</div>
                                            <div className="text-sm text-muted-foreground">
                                                Only you can access this dashboard
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="shared" id="shared" />
                                    <Label htmlFor="shared" className="font-normal cursor-pointer">
                                        <div>
                                            <div className="font-medium">Shared</div>
                                            <div className="text-sm text-muted-foreground">
                                                You can share this dashboard with team members
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Additional Options */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="default">Set as Default Dashboard</Label>
                                    <p className="text-sm text-muted-foreground">
                                        This will be your main dashboard
                                    </p>
                                </div>
                                <Switch
                                    id="default"
                                    checked={formData.isDefault}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isDefault: checked })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="favorite">Add to Favorites</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Quick access from favorites tab
                                    </p>
                                </div>
                                <Switch
                                    id="favorite"
                                    checked={formData.isFavorite}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isFavorite: checked })
                                    }
                                />
                            </div>
                        </div>

                        {/* Template Selection */}
                        <div className="space-y-2">
                            <Label>Start From</Label>
                            <RadioGroup
                                value={formData.template}
                                onValueChange={(value) => setFormData({ ...formData, template: value })}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="blank" id="blank" />
                                    <Label htmlFor="blank" className="font-normal cursor-pointer">
                                        Blank Dashboard
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="analytics" id="analytics" />
                                    <Label htmlFor="analytics" className="font-normal cursor-pointer">
                                        Analytics Template
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="tasks" id="tasks" />
                                    <Label htmlFor="tasks" className="font-normal cursor-pointer">
                                        Tasks Template
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="finance" id="finance" />
                                    <Label htmlFor="finance" className="font-normal cursor-pointer">
                                        Finance Template
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.name}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Dashboard
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
