"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { ProductCategory } from "@xclade/types"

interface NavigationContextType {
  categories: ProductCategory[]
  isLoading: boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const NavigationProvider = ({ 
  children, 
  initialCategories = [] 
}: { 
  children: React.ReactNode
  initialCategories?: ProductCategory[]
}) => {
  // Use a singleton pattern to ensure we only ever fetch once if initialCategories is empty
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(initialCategories.length === 0)

  // Effectively "Load Once" for the session
  return (
    <NavigationContext.Provider value={{ categories, isLoading }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
