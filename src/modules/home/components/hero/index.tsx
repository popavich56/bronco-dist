"use client"

import { Button, Heading } from "@medusajs/ui"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] w-full bg-[#001F2E] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
      >
        <source src="https://owm-bucket.s3.ap-south-1.amazonaws.com/videos/bronco+video.mp4" type="video/mp4" />
      </video>

      {/* Navy overlay for text contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#001F2E]/60 via-[#001F2E]/40 to-[#001F2E]/80" />

      <div className="relative z-20 w-full max-w-[1440px] px-6 md:px-12 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <Heading
            level="h1"
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold text-white leading-[0.9] tracking-tighter uppercase"
          >
            <span className="text-[#6DB3D9]">BRONCO</span>{" "}
            <span className="text-[#ADE0EE]">DISTRIBUTION</span>
          </Heading>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-xl font-mono text-white/80 max-w-2xl leading-relaxed"
        >
          Colorado&apos;s Wholesale Smoke Shop &amp; Vape Distributor
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          <LocalizedClientLink href="/store">
            <Button className="h-12 px-8 rounded-none bg-[#6DB3D9] hover:bg-[#ADE0EE] text-[#001F2E] font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 hover:gap-4">
              View Catalog
              <ArrowRight className="w-4 h-4" />
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/account/login">
            <Button
              variant="secondary"
              className="h-12 px-8 rounded-none border border-[#6DB3D9]/50 bg-transparent text-white hover:border-[#6DB3D9] hover:text-[#6DB3D9] font-mono uppercase text-xs transition-all tracking-wider"
            >
              Apply for Account
            </Button>
          </LocalizedClientLink>
        </motion.div>
      </div>
    </section>
  )
}
