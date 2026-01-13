"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      className={`rounded-none font-bold uppercase tracking-widest text-xs h-10 shadow-none transition-all ${
        variant === "primary" 
          ? "bg-businessx-black text-white hover:bg-businessx-black/90 border-0" 
          : variant === "secondary"
            ? "bg-terminal-black border-2 border-terminal-border text-terminal-dim hover:border-terminal-border hover:text-terminal-white"
            : ""
      } ${className}`}
      type="submit"
      isLoading={pending}
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
