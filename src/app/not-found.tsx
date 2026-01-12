import { ArrowUpRightMini } from "@medusajs/icons"

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)] bg-bronco-white text-bronco-black p-4">
      <div className="relative">
        <h1 className="font-display text-[150px] leading-none font-black text-bronco-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          404
        </h1>
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-bronco-yellow rounded-full border-2 border-bronco-black shadow-hard hidden md:block"></div>
      </div>
      
      <h2 className="text-2xl font-bold font-display mt-4">
        Oops! You've gone off-road.
      </h2>
      
      <p className="text-base-regular text-bronco-black/70 max-w-md text-center mb-8 font-sans">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>

      <Link
        href="/"
        className="group relative px-8 py-3 bg-bronco-yellow border-2 border-bronco-black font-bold text-bronco-black shadow-hard transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] rounded-base flex items-center gap-2"
      >
        <span>Back to Homepage</span>
        <ArrowUpRightMini className="group-hover:rotate-45 transition-transform duration-200" />
      </Link>
    </div>
  )
}
