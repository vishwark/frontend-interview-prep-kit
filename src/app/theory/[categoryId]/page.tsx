import { notFound } from "next/navigation"
import { CategoryList } from "@/components/view/category-list"
import { theoryCategories } from "@/config/theory"

interface TheoryCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default function TheoryCategoryPage({ params }: TheoryCategoryPageProps) {
  const categoryId = params.categoryId
  const category = theoryCategories.find(
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
  return theoryCategories.map((category) => ({
    categoryId: category.id,
  }))
}
