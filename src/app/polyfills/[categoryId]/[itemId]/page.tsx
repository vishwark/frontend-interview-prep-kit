import fs from "fs/promises"
import path from "path"
import { notFound } from "next/navigation"
import { PolyfillLayout } from "@/components/view/polyfill-layout"
import { polyfillCategories } from "@/config/polyfills"

interface PolyfillItemPageProps {
  params: {
    categoryId: string
    itemId: string
  }
}

export default async function PolyfillItemPage({ params }: PolyfillItemPageProps) {
  const { categoryId, itemId } = await params

  const category = polyfillCategories[0].items.find(
    (category) => category.id === categoryId
  )
  console.debug(category,categoryId,itemId,'11111')
  if (!category) {
    notFound()
  }

  const item = category.items.find((item) => item.id === itemId)

  if (!item) {
    notFound()
  }

  let requirementContent = ""
  let implementationContent = ""

  try {
    // Read the file
    const filePath = path.join(process.cwd(), item.filePath)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    
    // Extract comments for requirements
    const commentMatch = fileContent.match(/\/\*\*([\s\S]*?)\*\//)
    if (commentMatch && commentMatch[1]) {
      const comment = commentMatch[1].trim()
      requirementContent = `
        <div class="markdown">
          <h3>${item.title}</h3>
          <pre class="whitespace-pre-wrap">${comment}</pre>
        </div>
      `
    } else {
      requirementContent = `
        <h3>Requirements for ${item.title}</h3>
        <p>Implement the ${item.title} functionality as per JavaScript specifications.</p>
      `
    }
    
    // Use the file content for implementation
    implementationContent = fileContent
  } catch (error) {
    console.error(`Error reading polyfill file ${item.filePath}:`, error)
    
    // Fallback content
    requirementContent = `
      <h3>Requirements for ${item.title}</h3>
      <p>Implement the ${item.title} functionality as per JavaScript specifications.</p>
    `
    
    implementationContent = `// Implementation for ${item.title}\n// Content could not be loaded`
  }

  return (
    <PolyfillLayout 
      categories={polyfillCategories}
      activeCategory="js-polyfill"
      activeItem={categoryId}
      activeSubItem={itemId}
      requirementContent={requirementContent}
      implementationContent={implementationContent}
    />
  )
}

export function generateStaticParams() {
  const paths: { categoryId: string; itemId: string }[] = []

  polyfillCategories[0].items.forEach((category) => {
    category.items.forEach((item) => {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      })
    })
  })

  return paths
}
