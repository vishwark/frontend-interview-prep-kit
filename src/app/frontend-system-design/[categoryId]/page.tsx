import { notFound } from "next/navigation"
import { CategoryList } from "@/components/view/category-list"
import { systemDesignCategories } from "@/config/frontend-system-design"

interface SystemDesignCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function SystemDesignCategoryPage({ params }: SystemDesignCategoryPageProps) {
  const categoryId = await params.categoryId
  const category = systemDesignCategories.find(
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
  return systemDesignCategories.map((category) => ({
    categoryId: category.id,
  }))
}
