'use client'

import { useLivePreview as usePayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useLivePreview = <T extends Record<string, any>>(initialData: T): T => {
  const router = useRouter()
  
  // Determine the correct server URL for live preview to trust
  const serverURL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

  // The official hook handles the handshake and data merging automatically
  const { data } = usePayloadLivePreview({
    initialData,
    serverURL, 
    depth: 2,
  })

  return data as T
}
