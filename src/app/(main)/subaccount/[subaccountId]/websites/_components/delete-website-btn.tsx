'use client'

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { deleteWebsite } from '@/lib/website-queries'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

type Props = {
    websiteId: string
}

const DeleteWebsiteBtn = ({ websiteId }: Props) => {
    const router = useRouter()
    const { toast } = useToast()

    const handleDelete = async () => {
        try {
            await deleteWebsite(websiteId)
            toast({
                title: 'Success',
                description: 'Deleted website',
            })
            router.refresh()
        } catch (error) {
            console.error(error)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could not delete website',
            })
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="gap-2">
                    <Trash size={14} /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the website and all its data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteWebsiteBtn
