import { listNavCategories } from "@lib/data/categories"
import { NavigationProvider } from "@modules/layout/components/navigation-provider"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await listNavCategories()

  return (
    <NavigationProvider initialCategories={categories}>
      <Nav />
      {children}
      <Footer />
    </NavigationProvider>
  )
}
