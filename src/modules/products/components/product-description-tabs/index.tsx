"use client"

import { Button, Container, Text, clx } from "@medusajs/ui"
import { Product } from "@xclade/types"
import { useState } from "react"
import ReviewForm from "../product-tabs/review-form"
import { Star } from "lucide-react"

type ProductDescriptionTabsProps = {
  product: Product
  reviews?: any[]
}

const ProductDescriptionTabs = ({
  product,
  reviews = [],
}: ProductDescriptionTabsProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  )
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Use passed reviews or fallback (though product.reviews is likely empty now)
  const displayReviews =
    reviews.length > 0 ? reviews : (product as any).reviews || []

  return (
    <div className="w-full">
      <div className="flex border-b border-terminal-border mb-8">
        <button
          onClick={() => setActiveTab("description")}
          className={clx(
            "pb-4 px-8 text-lg font-display font-bold uppercase tracking-wide border-b-2 transition-colors",
            activeTab === "description"
              ? "border-terminal-border text-terminal-white dark:border-white "
              : "border-transparent text-terminal-dim hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={clx(
            "pb-4 px-8 text-lg font-display font-bold uppercase tracking-wide border-b-2 transition-colors flex items-center gap-2",
            activeTab === "reviews"
              ? "border-terminal-border text-terminal-white dark:border-white "
              : "border-transparent text-terminal-dim hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          Reviews
          <span className="bg-terminal-highlight text-terminal-white text-xs px-2 py-0.5 rounded-full ">
            {displayReviews.length}
          </span>
        </button>
      </div>

      <div className="min-h-[300px]">
        {activeTab === "description" && (
          <div
            className="text-base font-body text-terminal-white/80 dark:text-neutral-300 leading-relaxed max-w-4xl prose prose-zinc prose-sm small:prose-base prose-headings:font-display prose-headings:uppercase prose-headings:font-bold prose-ul:list-disc prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4 prose-headings: prose-p:dark:text-neutral-300 prose-li:dark:text-neutral-300 prose-strong:"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
        )}

        {activeTab === "reviews" && (
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold font-display uppercase mb-2 text-terminal-white ">
                  Customer Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex text-businessx-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={clx(
                          "w-5 h-5",
                          i <
                            Math.round(
                              (product as any).rating_summary?.average_rating ||
                                0
                            )
                            ? "fill-current"
                            : "text-gray-200 fill-gray-200 dark:text-zinc-700 dark:fill-zinc-700"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-terminal-dim ">
                    Based on {displayReviews.length} reviews
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-businessx-black text-white hover:bg-businessx-black/80 dark:bg-terminal-black dark:text-black dark:hover:bg-gray-200 font-display font-bold uppercase tracking-wide rounded-none"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </Button>
            </div>

            {showReviewForm && (
              <div className="mb-12 border-b border-terminal-border pb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                <ReviewForm
                  productId={product.id}
                  onClose={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {displayReviews.length > 0 ? (
              <div className="flex flex-col gap-y-8">
                {displayReviews.slice(0, 3).map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b border-terminal-border pb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-businessx-yellow text-sm">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={clx(
                                  "w-4 h-4",
                                  i < review.rating
                                    ? "fill-current"
                                    : "text-gray-200 fill-gray-200"
                                )}
                              />
                            ))}
                          </div>
                          <span className="font-bold font-display text-sm uppercase text-terminal-white">
                            {review.title || "Review"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-terminal-dim">
                          <span className="font-bold text-terminal-white">
                            {review.first_name} {review.last_name}
                          </span>
                          <span>•</span>
                          <span>Verified Buyer</span>
                          <span>•</span>
                          <span>
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.content && (
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-terminal-panel rounded-none">
                <p className="text-terminal-dim font-medium">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDescriptionTabs
