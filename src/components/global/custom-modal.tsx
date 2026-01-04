import { useModal } from '@/providers/modal-provider'
import React from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

type Props = {
  title: string
  subheading: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

const CustomModal = ({ children, defaultOpen, subheading, title, className }: Props) => {
  const { isOpen, setClose } = useModal()
  return (
    <Dialog
      open={isOpen || defaultOpen}
      onOpenChange={setClose}
    >
      <DialogContent className={cn("overflow-scroll md:max-h-[700px] md:h-fit h-screen bg-card", className)}>
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
