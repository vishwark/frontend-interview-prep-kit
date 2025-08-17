import { CategoryList } from "@/components/view/category-list"
import { systemDesignCategories } from "@/config/frontend-system-design"

export default function FrontendSystemDesignPage() {
  return (
    <CategoryList
      title="Frontend System Design"
      description="Learn about frontend system design concepts and patterns"
      items={systemDesignCategories}
    />
  )
}
