
import { Skeleton } from "@medusajs/ui"
import { clx } from "@medusajs/ui"

export default function Loading() {
  return (
    <div className="content-container flex flex-col small:grid small:grid-cols-[1.5fr_1fr] small:items-start py-6 gap-x-12 relative">
      {/* Image Skeleton */}
      <div className="flex flex-col gap-y-8 w-full">
        {/* Main Image - Large aspect ratio for both mobile and desktop */}
        <div className="relative aspect-[29/34] w-full bg-gray-100 rounded-lg animate-pulse border-2 border-transparent">
             {/* Inner highlight to simulate depth/border */}
             <div className="absolute inset-0 border-2 border-gray-200/50 rounded-lg"></div>
        </div>
        
        {/* Thumbnails (hidden on mobile usually, or shown below) */}
        <div className="hidden small:grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[29/34] bg-gray-100 rounded-md animate-pulse" />
             ))}
        </div>
      </div>
      
      {/* Info Skeleton */}
      <div className="flex flex-col small:sticky small:top-24 small:py-0 small:max-w-[400px] w-full py-8 gap-y-12 ml-auto">
        <div className="flex flex-col gap-y-4">
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-4 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
             </div>

             {/* Collection / Subtitle */}
             <div className="w-1/3 h-5 bg-gray-100 rounded animate-pulse" />
             
             {/* Title - Double line */}
             <div className="flex flex-col gap-2">
                 <div className="w-full h-12 bg-gray-100 rounded animate-pulse" />
                 <div className="w-2/3 h-12 bg-gray-100 rounded animate-pulse" />
             </div>

             {/* Price */}
             <div className="w-1/4 h-10 bg-gray-100 rounded animate-pulse mt-2" />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-y-8 border-y border-gray-100 py-8">
            <div className="flex flex-col gap-y-3">
                 <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                 <div className="flex gap-3">
                     <div className="w-14 h-12 bg-gray-100 rounded-md animate-pulse border border-gray-200" />
                     <div className="w-14 h-12 bg-gray-100 rounded-md animate-pulse border border-gray-200" />
                     <div className="w-14 h-12 bg-gray-100 rounded-md animate-pulse border border-gray-200" />
                 </div>
            </div>
            
             <div className="flex flex-col gap-y-3">
                 <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                 <div className="flex gap-3">
                     <div className="w-14 h-12 bg-gray-100 rounded-md animate-pulse border border-gray-200" />
                     <div className="w-14 h-12 bg-gray-100 rounded-md animate-pulse border border-gray-200" />
                 </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-y-4">
             <div className="w-full h-14 bg-gray-200 rounded animate-pulse shadow-sm" />
             <div className="flex justify-between items-center px-4 py-2 border border-gray-100 rounded">
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
             </div>
        </div>
        
        {/* Accordions */}
        <div className="flex flex-col gap-y-0 mt-4 border-t border-gray-200">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-6 border-b border-gray-200">
                    <div className="w-1/3 h-5 bg-gray-100 rounded animate-pulse" />
                    <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
