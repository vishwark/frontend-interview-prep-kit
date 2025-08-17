import fs from "fs/promises"
import path from "path"
import { notFound } from "next/navigation"
import { ContentView } from "@/components/view/content-view"
import { implementationCategories } from "@/config/implementation"

interface ImplementationItemPageProps {
  params: {
    categoryId: string
    itemId: string
  }
}

export default async function ImplementationItemPage({ params }: ImplementationItemPageProps) {
  const resolvedParams = await params
  const categoryId = resolvedParams.categoryId
  const itemId = resolvedParams.itemId
  
  const category = implementationCategories.find(
    (category) => category.id === categoryId
  )

  if (!category) {
    notFound()
  }

  const item = category.items.find((item) => item.id === itemId)

  if (!item) {
    notFound()
  }

  let requirementContent = ""
  let implementationContent = ""

  // For JS polyfill section, use actual content from files
  if (categoryId === "js-polyfill") {
    try {
      // Use a different approach to get the file path directly
      const basePath = path.join(process.cwd(), 'interview', 'implementation', '2.js-polyfill')
      let filePath = ''
      
      if (itemId === "promise") {
        filePath = path.join(basePath, '1.promise', '1.promise-all.js')
      } else if (itemId === "array") {
        filePath = path.join(basePath, '2.array', '1.map.js')
      } else if (itemId === "function") {
        filePath = path.join(basePath, '3.function', '1.call.js')
      } else if (itemId === "utility-func") {
        filePath = path.join(basePath, '4.utility-func', '1.debounce.js')
      } else if (itemId === "object") {
        filePath = path.join(basePath, '5.object', '1.object-create.js')
      } else if (itemId === "timeouts") {
        filePath = path.join(basePath, '6.timeouts', '1.set-timeout.js')
      }
      
      if (filePath) {
        // Read the file synchronously
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
        }
        
        // Use the file content for implementation
        implementationContent = fileContent
      }
    } catch (error) {
      console.error("Error reading polyfill files:", error)
      
      // Fallback content
      requirementContent = `
        <h3>Requirements for ${item.title}</h3>
        <p>Implement the ${item.title} functionality as per JavaScript specifications.</p>
      `
      
      implementationContent = `// Implementation for ${item.title}\n// Content could not be loaded`
    }
  } else {
    // For other sections, use placeholder or requirement path if available
    if (item.requirementPath) {
      try {
        // Read the file
        const requirementFile = await fs.readFile(path.join(process.cwd(), item.requirementPath), 'utf-8')
        requirementContent = `
          <div class="markdown">
            <h3>${item.title} Requirements</h3>
            <pre class="whitespace-pre-wrap">${requirementFile}</pre>
          </div>
        `
      } catch (error) {
        console.error(`Error reading requirement file ${item.requirementPath}:`, error)
        requirementContent = `
          <h3>Requirements for ${item.title}</h3>
          <p>Requirements could not be loaded.</p>
        `
      }
    } else {
      requirementContent = `
        <h3>Requirements</h3>
        <p>This is a placeholder for the requirements of ${item.title}.</p>
        <ul>
          <li>Requirement 1</li>
          <li>Requirement 2</li>
          <li>Requirement 3</li>
        </ul>
      `
    }

    implementationContent = `
// Sample implementation code for ${item.title}
function sampleImplementation() {
  // Your implementation here
  console.log("This is a sample implementation");
  return "Implementation complete";
}

// Usage
sampleImplementation();
    `
  }

  return (
    <ContentView
      title={item.title}
      description={item.description}
      requirementContent={requirementContent}
      implementationContent={implementationContent}
    />
  )
}

// Helper function to get polyfill file paths
async function getPolyfillFilePaths(categoryId: string, itemId: string) {
  const basePath = path.join(process.cwd(), 'interview', 'implementation', '2.js-polyfill')
  
  try {
    let filePaths: string[] = []
    
    if (itemId === "promise") {
      const promiseDir = path.join(basePath, '1.promise')
      const files = await fs.readdir(promiseDir)
      filePaths = files.map(file => path.join(promiseDir, file))
    } else if (itemId === "array") {
      const arrayDir = path.join(basePath, '2.array')
      const files = await fs.readdir(arrayDir)
      filePaths = files.map(file => path.join(arrayDir, file))
    } else if (itemId === "function") {
      const functionDir = path.join(basePath, '3.function')
      const files = await fs.readdir(functionDir)
      filePaths = files.map(file => path.join(functionDir, file))
    } else if (itemId === "utility-func") {
      const utilityDir = path.join(basePath, '4.utility-func')
      const files = await fs.readdir(utilityDir)
      filePaths = files.map(file => path.join(utilityDir, file))
    } else if (itemId === "object") {
      const objectDir = path.join(basePath, '5.object')
      const files = await fs.readdir(objectDir)
      filePaths = files.map(file => path.join(objectDir, file))
    } else if (itemId === "timeouts") {
      const timeoutsDir = path.join(basePath, '6.timeouts')
      const files = await fs.readdir(timeoutsDir)
      filePaths = files.map(file => path.join(timeoutsDir, file))
    }
    
    return filePaths
  } catch (error) {
    console.error(`Error getting polyfill files for ${categoryId}/${itemId}:`, error)
    return []
  }
}

export function generateStaticParams() {
  const paths: { categoryId: string; itemId: string }[] = []

  implementationCategories.forEach((category) => {
    category.items.forEach((item) => {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      })
    })
  })

  return paths
}
