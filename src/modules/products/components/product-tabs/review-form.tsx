"use client"

import { Button, Input, Label, Textarea, clx } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { createReview } from "@lib/data/reviews"
import { getCustomer } from "@lib/data/customer"
import { useRouter } from "next/navigation"

const ReviewForm = ({
  productId,
  onClose,
}: {
  productId: string
  onClose?: () => void
}) => {
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [customer, setCustomer] = useState<any>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchCustomer = async () => {
      const customerData = await getCustomer().catch(() => null)
      setCustomer(customerData)
    }
    fetchCustomer()
  }, [])

  if (!customer) {
    return (
      <div className="bg-terminal-panel border border-terminal-border rounded-none p-6 text-center">
        <h3 className="font-display font-bold text-lg text-terminal-white mb-2">
          Sign in to Write a Review
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          You must be logged in to leave a review for this product.
        </p>
        <Button
          onClick={() => (window.location.href = "/account/login")}
          className="bg-businessx-black text-white hover:bg-businessx-black/80 dark:bg-terminal-black dark:text-black dark:hover:bg-gray-200 font-display font-medium uppercase tracking-wide"
        >
          Sign In
        </Button>
      </div>
    )
  }

  // Success state UI
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-none p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
          ✓
        </div>
        <h3 className="font-display font-bold text-lg text-green-900 mb-2">
          Review Submitted!
        </h3>
        <p className="text-sm text-green-700 mb-6">
          Thank you for sharing your experience. Your review is being processed.
        </p>
        <Button
          onClick={() => {
            setSuccess(false)
            if (onClose) onClose()
          }}
          className="bg-green-700 text-white hover:bg-green-800 font-display font-bold uppercase tracking-wide rounded-none"
        >
          Write Another Review
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      await createReview({
        product_id: productId,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        rating,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
      })

      setSuccess(true)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-y-4 py-4 rounded-none bg-terminal-black "
    >
      <div className="flex gap-x-2">
        <div className="w-1/2">
          <Label className="font-display font-bold text-xs uppercase tracking-wider mb-1 block text-terminal-white ">
            First Name
          </Label>
          <div className="px-4 py-2 bg-terminal-panel border border-terminal-border rounded font-bold text-terminal-dim text-sm">
            {customer.first_name}
          </div>
        </div>
        <div className="w-1/2">
          <Label className="font-display font-bold text-xs uppercase tracking-wider mb-1 block text-terminal-white ">
            Last Name
          </Label>
          <div className="px-4 py-2 bg-terminal-panel border border-terminal-border rounded font-bold text-terminal-dim text-sm">
            {customer.last_name}
          </div>
        </div>
      </div>

      <div>
        <Label className="font-display font-bold text-xs uppercase tracking-wider mb-1 block text-terminal-white ">
          Email
        </Label>
        <div className="px-4 py-2 bg-terminal-panel border border-terminal-border rounded font-bold text-terminal-dim text-sm">
          {customer.email}
        </div>
      </div>

      <div>
        <Label className="font-display font-bold text-xs uppercase tracking-wider mb-1 block text-terminal-white ">
          Rating
        </Label>
        <div className="flex gap-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors ${
                star <= rating
                  ? "text-businessx-yellow"
                  : "text-neutral-400 dark:text-zinc-700"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="font-display font-bold text-xs uppercase tracking-wider mb-1 block text-terminal-white ">
          Title
        </Label>
        <Input
          name="title"
          placeholder="Great product!"
          className="bg-terminal-black border text-sm rounded-none border-terminal-border focus:border-terminal-border dark:focus:border-white focus:ring-0 placeholder:text-terminal-dim "
        />
      </div>

      <div>
        <Label className="font-display font-bold text-xs uppercase tracking-wider mb-1 block text-terminal-white ">
          Review
        </Label>
        <Textarea
          name="content"
          placeholder="Share your experience (optional)..."
          className="bg-terminal-black border text-sm rounded-none border-terminal-border focus:border-terminal-border dark:focus:border-white focus:ring-0 placeholder:text-terminal-dim min-h-[100px] "
        />
      </div>

      <Button
        type="submit"
        isLoading={submitting}
        className="w-full bg-businessx-black hover:bg-businessx-black/80 text-white font-display font-bold uppercase tracking-wide rounded-none h-12"
      >
        Submit Review
      </Button>
    </form>
  )
}

export default ReviewForm
