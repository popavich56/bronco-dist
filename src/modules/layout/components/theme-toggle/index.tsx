"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@medusajs/ui"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="transparent" 
      size="small" 
      onClick={toggleTheme}
      className="w-8 h-8 rounded-full border border-terminal-border/50 dark:border-terminal-border/20 p-0 flex items-center justify-center hover:bg-terminal-highlight transition-all"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-businessx-orange" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-businessx-orange" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
