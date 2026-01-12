import { Heading, Text } from "@medusajs/ui"
import { Star, MessageSquare } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const FeaturedReviews = ({ reviews }: { reviews: any[] }) => {
  if (!reviews || reviews.length === 0) return null

  return (
    <section className="py-24 bg-terminal-black border-t border-terminal-border">
      <div className="content-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
             <div className="flex items-center gap-2 mb-4">
               <span className="font-mono text-xs font-bold text-bronco-orange uppercase tracking-widest">Feedback</span>
             </div>
             <Heading level="h2" className="text-5xl md:text-6xl font-bold font-display text-terminal-white uppercase leading-none tracking-tighter">
               Operator Reviews
             </Heading>
          </div>
          
          <LocalizedClientLink href="/products" className="group flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-terminal-dim hover:text-bronco-orange transition-colors">
            See All
            <span className="block w-4 h-[1px] bg-current transition-all group-hover:w-8" />
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className="bg-terminal-panel p-8 border border-terminal-border hover:border-bronco-orange transition-all duration-300 flex flex-col justify-between h-full group"
            >
              <div>
                <div className="flex gap-1 mb-6 text-bronco-orange">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-terminal-active fill-terminal-active"}`} />
                  ))}
                </div>
                
                <h3 className="font-bold text-lg mb-4 font-display uppercase leading-tight text-terminal-white tracking-wide">
                  "{review.title}"
                </h3>
                <p className="text-terminal-dim font-mono text-sm leading-relaxed mb-8 border-l border-terminal-active pl-4">
                  {review.content}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-terminal-active/30">
                <div className="w-8 h-8 bg-terminal-surface border border-terminal-border flex items-center justify-center font-bold font-mono text-terminal-white text-xs">
                  {review.first_name?.[0]}{review.last_name?.[0]}
                </div>
                <div>
                   <p className="font-bold text-xs uppercase text-terminal-white tracking-widest mb-1">
                     {review.first_name} {review.last_name}
                   </p>
                   {review.product && (
                     <LocalizedClientLink href={`/products/${review.product.handle}`} className="text-[10px] font-mono text-terminal-tech uppercase hover:text-bronco-orange transition-colors flex items-center gap-1">
                       <MessageSquare className="w-3 h-3" />
                       Verified Purchase
                     </LocalizedClientLink>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
