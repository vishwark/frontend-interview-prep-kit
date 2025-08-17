import { notFound } from "next/navigation"
import { ContentView } from "@/components/view/content-view"
import { theoryCategories } from "@/config/theory"

interface TheoryItemPageProps {
  params: {
    categoryId: string
    itemId: string
  }
}

export default function TheoryItemPage({ params }: TheoryItemPageProps) {
  const categoryId = params.categoryId
  const itemId = params.itemId
  
  const category = theoryCategories.find(
    (category) => category.id === categoryId
  )

  if (!category) {
    notFound()
  }

  const item = category.items.find((item) => item.id === itemId)

  if (!item) {
    notFound()
  }

  // In a real application, you would fetch the content from a database or API
  // For now, we'll just use placeholder content
  const theoryContent = `
    <h3>Theory</h3>
    <p>This is a placeholder for the theory content of ${item.title}.</p>
    <h4>Key Concepts</h4>
    <ul>
      <li>Concept 1: Description of concept 1</li>
      <li>Concept 2: Description of concept 2</li>
      <li>Concept 3: Description of concept 3</li>
    </ul>
    <h4>Examples</h4>
    <pre><code>
// Example code
function example() {
  console.log("This is an example");
}
    </code></pre>
  `

  return (
    <ContentView
      title={item.title}
      description={item.description}
      theoryContent={theoryContent}
    />
  )
}

export function generateStaticParams() {
  const paths: { categoryId: string; itemId: string }[] = []

  theoryCategories.forEach((category) => {
    category.items.forEach((item) => {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      })
    })
  })

  return paths
}
