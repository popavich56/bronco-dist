import { Metadata } from "next"
import CategoryTileGrid from "@modules/categories/components/category-tile-grid"

export const metadata: Metadata = {
  title: "Categories | Bronco Distribution",
  description:
    "Browse all wholesale product categories at Bronco Distribution.",
}

export default async function CategoriesPage() {
  return (
    <div className="py-16 bg-terminal-panel min-h-screen">
      <div className="content-container">
        <CategoryTileGrid
          eyebrow="Wholesale Inventory"
          title="All Categories"
          subtitle="Browse our full catalog of wholesale products by category."
          headingTag="h1"
        />
      </div>
    </div>
  )
}
