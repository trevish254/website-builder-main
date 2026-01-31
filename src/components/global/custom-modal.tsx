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
  let sidebarContext: any = null

  try {
    sidebarContext = useSidebar()
  } catch (e) {
    // Silent fail if outside sidebar context
  }

  const isCollapsed = sidebarContext?.isPanelCollapsed

  return (
    <Dialog
      open={isOpen || defaultOpen}
      onOpenChange={setClose}
    >
      <DialogContent className={cn(
        "overflow-hidden max-h-[90vh] md:max-h-[85vh] bg-card/95 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] rounded-[2rem]",
        className
      )}>
        <DialogHeader className="p-8 text-left">
          <DialogTitle className="text-3xl font-extrabold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400">{subheading}</DialogDescription>
        </DialogHeader>
        <div
          className="overflow-y-auto max-h-[calc(90vh-10rem)] md:max-h-[calc(85vh-10rem)] pr-2 custom-scrollbar"
          data-lenis-prevent
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
