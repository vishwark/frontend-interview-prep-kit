import { CategoryList } from "@/components/view/category-list"
import { implementationCategories } from "@/config/implementation"

export default function ImplementationPage() {
  return (
    <CategoryList
      title="Implementation Challenges"
      description="Practice implementing common frontend interview coding challenges"
      items={implementationCategories}
    />
  )
}
