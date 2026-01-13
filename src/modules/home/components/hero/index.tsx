"use client"

import { Button, Heading } from "@medusajs/ui"
import { motion } from "framer-motion"
import { ArrowRight, Terminal } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] w-full bg-terminal-black dark:bg-[#0a0a0a] border-b border-terminal-border  flex items-center justify-center overflow-hidden">
      
      {/* Subtle Grid Background - Kept as detailed texture, not 'random placeholder' */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          color: 'var(--grid-color, #000000)' // Fallback
        }}
      >
          <div className="absolute inset-0 bg-gradient-to-t from-terminal-black dark:from-[#0a0a0a] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] px-6 md:px-12 flex flex-col items-center text-center gap-8">
          


          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="flex flex-col items-center"
          >
            <Heading level="h1" className="text-6xl md:text-8xl lg:text-[7rem] font-bold text-terminal-white  leading-[0.9] tracking-tighter uppercase mix-blend-normal transform-gpu">
              <span className="text-businessx-orange">BusinessX</span>
            </Heading>
          </motion.div>

          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-lg md:text-xl font-mono text-terminal-dim  max-w-2xl leading-relaxed"
          >
             High-velocity supply chain solutions for the modern operator. 
             deploying global inventory with tactical precision.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
             <LocalizedClientLink href="/store">
                 <Button 
                   className="h-12 px-8 rounded-none bg-businessx-orange hover:bg-orange-600 text-black font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:gap-4"
                 >
                    View Catalog
                    <ArrowRight className="w-4 h-4" />
                 </Button>
             </LocalizedClientLink>


             <LocalizedClientLink href="/account">
               <Button 
                 variant="secondary"
                 className="h-12 px-8 rounded-none border border-terminal-border dark:border-white/20 bg-transparent text-terminal-white  hover:border-businessx-orange hover:text-businessx-orange font-mono uppercase text-xs transition-all tracking-wider"
               >
                  Create An Account
               </Button>
             </LocalizedClientLink>
          </motion.div>
      </div>
    </section>
  )
}
