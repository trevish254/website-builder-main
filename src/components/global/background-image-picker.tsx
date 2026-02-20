'use client'

import React from 'react'
import { useModal } from '@/providers/modal-provider'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import { Image as ImageIcon } from 'lucide-react'
import RedesignedImageModal from '@/components/media/redesigned-image-modal'
import { Input } from '@/components/ui/input'

type Props = {
    background: string
    subaccountId: string
    onChange: (value: string) => void
}

const BackgroundImagePicker = ({ background, subaccountId, onChange }: Props) => {
    const { setOpen, setClose } = useModal()
    // Extract the raw URL from url('...') if present
    const rawUrl = background?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') || ''

    const handleOpenModal = () => {
        setOpen(
            <Dialog open={true} onOpenChange={() => setClose()}>
                <DialogContent className="max-w-[900px] p-0 border-none bg-transparent">
                    <RedesignedImageModal
                        subaccountId={subaccountId}
                        onSelect={(url) => {
                            onChange(`url(${url})`)
                            setClose()
                        }}
                        onClose={setClose}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div
                    onClick={handleOpenModal}
                    className="w-12 h-12 relative border rounded-md cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-900 hover:opacity-80 transition-opacity"
                >
                    {rawUrl ? (
                        <img
                            src={rawUrl}
                            alt="Background"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="text-muted-foreground w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <Input
                        placeholder="https://image.com"
                        value={rawUrl}
                        onChange={(e) => {
                            const val = e.target.value
                            onChange(val ? `url(${val})` : '')
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default BackgroundImagePicker
