import React from 'react'
import { Page } from '@lib/payload/types'

type VideoBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'video' }>

export const VideoBlock = (props: VideoBlockProps) => {
  const { videoType, youtubeId, vimeoId, videoFile, embedCode, autoplay, controls, thumbnail } = props
  
  const posterUrl = typeof thumbnail === 'object' ? thumbnail?.url : undefined
  let uploadedVideoUrl = typeof videoFile === 'object' ? videoFile?.url : undefined

  // Handle relative URLs for local development
  if (uploadedVideoUrl && uploadedVideoUrl.startsWith('/')) {
    const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
    uploadedVideoUrl = `${cmsUrl}${uploadedVideoUrl}`
  }

  return (
    <section className="w-full py-12 bg-terminal-black">
      <div className="content-container px-4">
        <div className="relative aspect-video w-full rounded-none overflow-hidden bg-black shadow-none">
           {videoType === 'youtube' && youtubeId && (
             <iframe 
               src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&mute=0&loop=0&controls=${controls ? 1 : 0}`} 
               className="absolute inset-0 w-full h-full"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             />
           )}
           {videoType === 'vimeo' && vimeoId && (
             <iframe 
               src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay ? 1 : 0}&muted=0&loop=0&controls=${controls ? 1 : 0}`}
               className="absolute inset-0 w-full h-full"
               allow="autoplay; fullscreen; picture-in-picture"
               allowFullScreen
             />
           )}
           {videoType === 'upload' && uploadedVideoUrl && (
             <video 
                src={uploadedVideoUrl}
                autoPlay={autoplay || false}
                loop={false}
                muted={autoplay ? true : false} 
                controls={controls || false}
                poster={posterUrl || undefined}
                className="w-full h-full object-cover"
                playsInline
             />
           )}
            {videoType === 'embed' && embedCode && (
              <div 
                className="absolute inset-0 w-full h-full"
                dangerouslySetInnerHTML={{ __html: embedCode }} 
              />
            )}
           {((videoType === 'youtube' && !youtubeId) || 
             (videoType === 'vimeo' && !vimeoId) || 
             (videoType === 'upload' && !uploadedVideoUrl) ||
             (videoType === 'embed' && !embedCode)) && (
             <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
               <p className="font-bold mb-2">Video content missing</p>
               {process.env.NODE_ENV === 'development' && videoType === 'upload' && (
                 <p className="text-xs text-terminal-dim font-mono">
                   {typeof videoFile === 'object' ? `URL: ${videoFile?.url}` : `ID: ${videoFile}`}
                 </p>
               )}
             </div>
           )}
        </div>
      </div>
    </section>
  )
}
