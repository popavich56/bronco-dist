'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'

export const PreviewRefresh = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for Payload Live Preview or Save events
      if (
        event.data?.type === 'payload-live-preview' || 
        event.data?.type === 'payload-save' || 
        event.data?.type === 'payload-autosave'
      ) {
        startTransition(() => {
          router.refresh()
        })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [router])

  return (
    <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${isPending ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className="bg-bronco-black/90 backdrop-blur-md text-bronco-yellow border border-bronco-yellow/30 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronco-yellow opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-bronco-yellow"></span>
        </div>
        <span className="text-sm font-bold tracking-tight">Syncing Live Changes...</span>
      </div>
    </div>
  )
}
