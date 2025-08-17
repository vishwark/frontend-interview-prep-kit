import { notFound } from "next/navigation"
import { ContentView } from "@/components/view/content-view"
import { systemDesignCategories } from "@/config/frontend-system-design"

interface SystemDesignItemPageProps {
  params: {
    categoryId: string
    itemId: string
  }
}

export default async function SystemDesignItemPage({ params }: SystemDesignItemPageProps) {
  const categoryId = await params.categoryId
  const itemId = await params.itemId
  
  const category = systemDesignCategories.find(
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
    <h3>System Design: ${item.title}</h3>
    <p>This is a placeholder for the system design content of ${item.title}.</p>
    
    <h4>Requirements</h4>
    <ul>
      <li>Functional Requirement 1</li>
      <li>Functional Requirement 2</li>
      <li>Non-functional Requirement 1</li>
      <li>Non-functional Requirement 2</li>
    </ul>
    
    <h4>Architecture</h4>
    <p>The architecture for this system consists of the following components:</p>
    <ul>
      <li>Component 1: Description of component 1</li>
      <li>Component 2: Description of component 2</li>
      <li>Component 3: Description of component 3</li>
    </ul>
    
    <h4>Data Flow</h4>
    <p>The data flows through the system as follows:</p>
    <ol>
      <li>Step 1: Description of step 1</li>
      <li>Step 2: Description of step 2</li>
      <li>Step 3: Description of step 3</li>
    </ol>
    
    <h4>Implementation Considerations</h4>
    <ul>
      <li>Consideration 1: Description of consideration 1</li>
      <li>Consideration 2: Description of consideration 2</li>
      <li>Consideration 3: Description of consideration 3</li>
    </ul>
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

  systemDesignCategories.forEach((category) => {
    category.items.forEach((item) => {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      })
    })
  })

  return paths
}
