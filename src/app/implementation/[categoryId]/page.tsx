import { notFound } from "next/navigation"
import { CategoryList } from "@/components/view/category-list"
import { implementationCategories } from "@/config/implementation"

interface ImplementationCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default function ImplementationCategoryPage({ params }: ImplementationCategoryPageProps) {
  const categoryId = params.categoryId
  const category = implementationCategories.find(
    (category) => category.id === categoryId
  )

  if (!category) {
    notFound()
  }

  return (
    <CategoryList
      title={category.title}
      description={category.description}
      items={category.items}
    />
  )
}

export function generateStaticParams() {
  return implementationCategories.map((category) => ({
    categoryId: category.id,
  }))
}
