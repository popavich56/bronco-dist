import { ArrowUpRightMini } from "@medusajs/icons"

import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-64px)] bg-terminal-black text-terminal-white p-4">
      <h1 className="font-display text-[120px] md:text-[150px] leading-none font-black text-terminal-white tracking-tighter mix-blend-difference">
        404
      </h1>
      
      <h2 className="text-2xl font-bold font-display mt-4 text-terminal-white uppercase tracking-tight">
        Page Not Found
      </h2>
      
      <p className="font-mono text-sm text-terminal-dim max-w-md text-center mb-8 leading-relaxed">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="px-8 py-3 bg-businessx-orange border border-businessx-orange font-bold text-black font-mono uppercase tracking-widest text-xs hover:bg-orange-600 transition-all"
      >
        GO TO HOME
      </Link>
    </div>
  )
}
