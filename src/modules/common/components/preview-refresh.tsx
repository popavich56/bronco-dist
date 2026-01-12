'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'

export const PreviewRefresh = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Basic check for object
      if (typeof event.data !== 'object' || !event.data) return

      if (
        event.data.type === 'payload-live-preview' || 
        event.data.type === 'payload-save'
      ) {
        // Trigger a Next.js server-side re-render of the current route
        // This ensures the Server Components refetch the latest draft data with fully populated relationships
        startTransition(() => {
          router.refresh()
        })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  return (
    <div className={`fixed bottom-4 right-4 pointer-events-none z-50 transition-opacity duration-300 ${isPending ? 'opacity-100' : 'opacity-0'}`}>
       <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-none border border-[#FBBF24]/50">
          <div className="w-2 h-2 bg-[#FBBF24] rounded-full animate-pulse"></div>
          Syncing...
       </div>
    </div>
  )
}
