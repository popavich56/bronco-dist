import CategoryTileGrid from "@modules/categories/components/category-tile-grid"

export default async function ExploreCategories() {
  return (
    <section className="py-20 bg-terminal-panel border-y border-terminal-border">
      <div className="content-container">
        <CategoryTileGrid
          eyebrow="Browse Inventory"
          title="Explore Categories"
          subtitle="Shop by category to find exactly what your store needs."
          headingTag="h2"
          limit={9}
          cta={{ text: "Browse Full Catalog", href: "/categories" }}
        />
      </div>
    </section>
  )
}
