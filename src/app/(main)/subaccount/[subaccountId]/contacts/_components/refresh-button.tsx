'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Button
      variant="outline"
      onClick={handleRefresh}
      className="flex items-center gap-2"
    >
      <RefreshCw size={16} />
      Refresh
    </Button>
  )
}

