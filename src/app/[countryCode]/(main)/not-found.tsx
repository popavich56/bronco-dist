import { Metadata } from "next"



export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-64px)] bg-terminal-black text-terminal-white">
      <h1 className="font-display font-black text-8xl md:text-9xl tracking-tighter text-terminal-white">
        404
      </h1>
      
      <p className="font-mono text-sm text-terminal-dim max-w-md text-center leading-relaxed px-6">
        The page you are looking for does not exist.
      </p>
      
      <div className="mt-4">
        <LocalizedClientLink 
          href="/"
          className="px-8 py-3 bg-businessx-orange border border-businessx-orange font-bold text-black font-mono uppercase tracking-widest text-xs hover:bg-orange-600 transition-all block"
        >
          GO TO HOME
        </LocalizedClientLink>
      </div>
    </div>
  )
}
