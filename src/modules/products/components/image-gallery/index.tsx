"use client"

import { clx } from "@medusajs/ui"
import { ProductImage } from "@xclade/types"
import Image from "next/image"
import { useRef, useState } from "react"

type ImageGalleryProps = {
  images: ProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const thumbsRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return null
  }

  const hasMultiple = images.length > 1

  const scrollThumbs = (direction: "left" | "right") => {
    if (!thumbsRef.current) return
    const scrollAmount = 200
    thumbsRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className="flex flex-col gap-y-3">
      {/* Main Image */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-terminal-panel border border-terminal-border rounded-2xl group"
        id={images[selectedImageIndex].id}
      >
        {!!images[selectedImageIndex].url && (
          <Image
            src={images[selectedImageIndex].url}
            priority={true}
            className="absolute inset-0 object-cover p-2 transition-transform duration-300 group-hover:scale-105"
            alt={`Product image ${selectedImageIndex + 1}`}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          />
        )}
      </div>

      {/* Horizontal Thumbnails with Arrows */}
      {hasMultiple && (
        <div className="relative flex items-center gap-x-2">
          {/* Left Arrow */}
          <button
            onClick={() => scrollThumbs("left")}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-200/50 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-700 dark:text-white/50 dark:hover:text-white/80 transition-all"
            aria-label="Scroll thumbnails left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Thumbnails Strip */}
          <div
            ref={thumbsRef}
            className="flex gap-x-2 overflow-x-auto no-scrollbar scroll-smooth flex-1"
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={clx(
                  "relative w-16 h-16 small:w-20 small:h-20 shrink-0 overflow-hidden rounded-xl transition-all duration-200 bg-terminal-panel",
                  {
                    "ring-2 ring-[#6DB3D9] ring-offset-2 ring-offset-terminal-black":
                      index === selectedImageIndex,
                    "border border-terminal-border hover:border-neutral-400 dark:hover:border-white/30":
                      index !== selectedImageIndex,
                  }
                )}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    className="absolute inset-0 object-cover p-1 transition-all duration-300"
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    loading="eager"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollThumbs("right")}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-200/50 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-700 dark:text-white/50 dark:hover:text-white/80 transition-all"
            aria-label="Scroll thumbnails right"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
