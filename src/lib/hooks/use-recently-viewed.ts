import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecentlyViewedStore {
  productIds: string[]
  addProduct: (id: string) => void
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      productIds: [],
      addProduct: (id: string) =>
        set((state) => {
          // Remove if exists to move to top, limit to 12 items
          const newIds = [id, ...state.productIds.filter((pId) => pId !== id)].slice(0, 12)
          return { productIds: newIds }
        }),
    }),
    {
      name: "recently-viewed-storage",
    }
  )
)
