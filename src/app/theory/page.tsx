import { CategoryList } from "@/components/view/category-list"
import { theoryCategories } from "@/config/theory"

export default function TheoryPage() {
  return (
    <CategoryList
      title="Theory Questions"
      description="Theoretical concepts for frontend interviews"
      items={theoryCategories}
    />
  )
}
