"use client"

import { clx } from "@medusajs/ui"
import { ProductImage } from "@xclade/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: ProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Main Image View */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-terminal-panel border border-terminal-border"
        id={images[selectedImageIndex].id}
      >
        {!!images[selectedImageIndex].url && (
          <Image
            src={images[selectedImageIndex].url}
            priority={true}
            className="absolute inset-0 object-cover p-2"
            alt={`Product image ${selectedImageIndex + 1}`}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          />
        )}
      </div>

      {/* Thumbnails Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => {
            return (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={clx(
                  "relative aspect-square w-full overflow-hidden border transition-all duration-200 bg-terminal-panel",
                  {
                    "border-bronco-orange": index === selectedImageIndex,
                    "border-terminal-border hover:border-bronco-orange/50":
                      index !== selectedImageIndex,
                  }
                )}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    className={clx(
                      "absolute inset-0 object-cover p-1 transition-all duration-300"
                    )}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
