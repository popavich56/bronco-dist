"use client"

import { clx } from "@medusajs/ui"
import Image from "next/image"
import React, { useState } from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "group relative w-full overflow-hidden bg-terminal-surface border border-terminal-border rounded-none",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  const [loaded, setLoaded] = useState(false)

  if (!image) {
    return (
      <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-terminal-surface text-terminal-dim gap-2">
        <svg
          width={size === "small" ? 28 : 36}
          height={size === "small" ? 28 : 36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-30"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="text-[9px] font-mono uppercase tracking-widest opacity-40 select-none">
          Image coming soon
        </span>
      </div>
    )
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-terminal-surface animate-pulse" />
      )}
      <Image
        src={image}
        alt="Thumbnail"
        className={clx(
          "absolute inset-0 object-cover object-center transition-all duration-500 ease-out group-hover:scale-105",
          loaded ? "opacity-100" : "opacity-0"
        )}
        draggable={false}
        quality={50}
        sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
        fill
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}

export default Thumbnail
