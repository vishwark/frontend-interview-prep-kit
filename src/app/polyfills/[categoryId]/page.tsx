import { notFound } from "next/navigation"
import { PolyfillLayout } from "@/components/view/polyfill-layout"
import { polyfillCategories } from "@/config/polyfills"

interface PolyfillCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function PolyfillCategoryPage({ params }: PolyfillCategoryPageProps) {
  const { categoryId } = await params
  
  const category = polyfillCategories[0].items.find(
    (category) => category.id === categoryId
  )

  if (!category) {
    notFound()
  }

  return (
    <PolyfillLayout 
      categories={polyfillCategories}
      activeCategory="js-polyfill"
      activeItem={categoryId}
    />
  )
}

export function generateStaticParams() {
  const paths: { categoryId: string }[] = []

  polyfillCategories[0].items.forEach((category) => {
    paths.push({
      categoryId: category.id,
    })
  })

  return paths
}
