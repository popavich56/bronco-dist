'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Media } from '@lib/payload/types'
import { ArrowLeft, ArrowRight, Circle, CircleDot } from 'lucide-react'

type SliderProps = {
    images: {
        id?: string | null
        image: string | Media | number
        caption?: string | null
        alt: string
    }[]
    settings?: {
        autoplay?: boolean | null
        autoplaySpeed?: number | null
        showArrows?: boolean | null
        showDots?: boolean | null
    }
}

const GallerySlider = ({ images, settings }: SliderProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // Default settings
    const autoplay = settings?.autoplay ?? true
    const autoplaySpeed = settings?.autoplaySpeed || 5000
    const showArrows = settings?.showArrows ?? true
    const showDots = settings?.showDots ?? true

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return
        
        const container = scrollRef.current
        const itemWidth = container.clientWidth
        
        if (direction === 'left') {
            container.scrollBy({ left: -itemWidth, behavior: 'smooth' })
            setCurrentIndex(prev => Math.max(0, prev - 1))
        } else {
            // Check if we are at the end to loop back or just scroll
            const maxScrollLeft = container.scrollWidth - container.clientWidth
            if (Math.ceil(container.scrollLeft) >= maxScrollLeft) {
                container.scrollTo({ left: 0, behavior: 'smooth' })
                setCurrentIndex(0)
            } else {
                container.scrollBy({ left: itemWidth, behavior: 'smooth' })
                setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))
            }
        }
    }

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return
        const container = scrollRef.current
        const itemWidth = container.clientWidth
        container.scrollTo({ left: index * itemWidth, behavior: 'smooth' })
        setCurrentIndex(index)
    }

    // Handle scroll events to update current index manually (e.g. swipe)
    const handleScroll = () => {
        if (!scrollRef.current) return
        const container = scrollRef.current
        const itemWidth = container.clientWidth
        const newIndex = Math.round(container.scrollLeft / itemWidth)
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex)
        }
    }

    // Autoplay logic
    useEffect(() => {
        if (!autoplay) return

        const interval = setInterval(() => {
            scroll('right')
        }, autoplaySpeed)

        return () => clearInterval(interval)
    }, [autoplay, autoplaySpeed, currentIndex]) // Depend on currentIndex so manual intervention resets timer effectively? Actually standard Interval is fine.

    return (
        <section className="py-20 bg-terminal-black relative group">
            <div className="content-container px-6 relative">
                
                {/* Scroll Container */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((item, i) => {
                        const img = typeof item.image === 'object' ? item.image as Media : null
                        if (!img?.url) return null

                        return (
                            <div 
                                key={item.id || i}
                                className="min-w-full flex-shrink-0 snap-center relative aspect-video md:aspect-[21/9] bg-terminal-surface rounded-none overflow-hidden"
                            >
                                <Image
                                    src={img.url}
                                    alt={item.alt || img.alt || 'Slider image'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px"
                                    priority={i === 0}
                                />
                                {item.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-10">
                                        <p className="text-white text-lg md:text-xl font-bold">{item.caption}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Arrows */}
                {showArrows && (
                    <>
                        <button 
                            onClick={() => scroll('left')}
                            className="absolute left-10 top-1/2 -translate-y-1/2 bg-terminal-black/80 hover:bg-terminal-black text-terminal-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-none hidden md:block"
                            aria-label="Previous slide"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="absolute right-10 top-1/2 -translate-y-1/2 bg-terminal-black/80 hover:bg-terminal-black text-terminal-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-none hidden md:block"
                            aria-label="Next slide"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </>
                )}

                {/* Dots */}
                {showDots && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={`transition-colors text-white hover:text-businessx-yellow ${i === currentIndex ? 'text-businessx-yellow' : 'text-white/50'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            >
                                {i === currentIndex ? <CircleDot size={12} fill="currentColor" /> : <Circle size={12} fill="currentColor" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default GallerySlider
