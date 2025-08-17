import { CategoryList } from "@/components/view/category-list"
import { outputCategories } from "@/config/output-based"

export default function OutputBasedPage() {
  return (
    <CategoryList
      title="Output-Based Questions"
      description="Practice predicting the output of JavaScript code snippets"
      items={outputCategories}
    />
  )
}
