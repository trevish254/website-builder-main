'use client'
import React from 'react'
import { Palette } from 'lucide-react'

const EmailBrandKitTab = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
            <Palette className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">Email Theme</p>
            <p className="text-xs opacity-60">Global styles for your email campaign.</p>
        </div>
    )
}

export default EmailBrandKitTab
