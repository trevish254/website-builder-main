'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import EmployeeForm from '../forms/employee-form'

type Props = {
    agencyId: string
    children?: React.ReactNode
}

const QuickInvite = ({ agencyId, children }: Props) => {
    const [open, setOpen] = useState(false)

    if (!agencyId) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110">
                        <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Quick Invite</DialogTitle>
                    <DialogDescription>
                        Send a quick invitation to a teammate. They can add their details after accepting.
                    </DialogDescription>
                </DialogHeader>
                <EmployeeForm
                    agencyId={agencyId}
                    mode="invite"
                    onSuccess={() => {
                        // Success logic is handled inside EmployeeForm (it shows the link)
                        // When user clicks "Done", onSuccess is called.
                        setOpen(false)
                    }}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default QuickInvite
