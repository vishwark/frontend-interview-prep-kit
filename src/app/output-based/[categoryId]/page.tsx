import { notFound } from "next/navigation"
import { CategoryList } from "@/components/view/category-list"
import { outputCategories } from "@/config/output-based"

interface OutputBasedCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function OutputBasedCategoryPage({ params }: OutputBasedCategoryPageProps) {
  const categoryId = await params.categoryId
  const category = outputCategories.find(
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
  return outputCategories.map((category) => ({
    categoryId: category.id,
  }))
}
